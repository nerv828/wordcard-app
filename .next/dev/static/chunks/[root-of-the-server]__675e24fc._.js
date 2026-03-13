(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/data/words.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v([{"japanese":"しっとり","kana":"しっとり","chinese":"湿润、润泽","english":"Moist","source":"FamilyMart (2026-03-11)"},{"japanese":"やわらか","kana":"やわらか","chinese":"柔软、松软","english":"Soft","source":"FamilyMart (2026-03-11)"},{"japanese":"食パン","kana":"しょくぱん","chinese":"食面包","english":"Plain Bread","source":"FamilyMart (2026-03-11)"},{"japanese":"コク","kana":"こく","chinese":"浓郁、醇厚","english":"Richness / Body","source":"FamilyMart (2026-03-11)"},{"japanese":"旨み","kana":"うまみ","chinese":"鲜美、美味","english":"Savory / Umami","source":"FamilyMart (2026-03-11)"},{"japanese":"たまご","kana":"たまご","chinese":"鸡蛋","english":"Egg","source":"FamilyMart (2026-03-11)"}]);}),
"[project]/styles/Home.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "answerArea": "Home-module__g21JLG__answerArea",
  "button": "Home-module__g21JLG__button",
  "buttonForgot": "Home-module__g21JLG__buttonForgot",
  "buttonGroup": "Home-module__g21JLG__buttonGroup",
  "buttonPrimary": "Home-module__g21JLG__buttonPrimary",
  "buttonRemember": "Home-module__g21JLG__buttonRemember",
  "buttonSecondary": "Home-module__g21JLG__buttonSecondary",
  "card": "Home-module__g21JLG__card",
  "cardFlipped": "Home-module__g21JLG__cardFlipped",
  "container": "Home-module__g21JLG__container",
  "fadeIn": "Home-module__g21JLG__fadeIn",
  "feedbackGroup": "Home-module__g21JLG__feedbackGroup",
  "footer": "Home-module__g21JLG__footer",
  "hint": "Home-module__g21JLG__hint",
  "levelDot": "Home-module__g21JLG__levelDot",
  "levelDotActive": "Home-module__g21JLG__levelDotActive",
  "levelIndicator": "Home-module__g21JLG__levelIndicator",
  "masteredBadge": "Home-module__g21JLG__masteredBadge",
  "progress": "Home-module__g21JLG__progress",
  "title": "Home-module__g21JLG__title",
  "wordChinese": "Home-module__g21JLG__wordChinese",
  "wordEnglish": "Home-module__g21JLG__wordEnglish",
  "wordJapanese": "Home-module__g21JLG__wordJapanese",
  "wordKana": "Home-module__g21JLG__wordKana",
  "wordSource": "Home-module__g21JLG__wordSource",
});
}),
"[project]/pages/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$words$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/data/words.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/Home.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function Home() {
    _s();
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showAnswer, setShowAnswer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [wordStats, setWordStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Load progress and stats from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const savedStats = localStorage.getItem('wordcard-stats');
            const savedIndex = localStorage.getItem('wordcard-index');
            if (savedStats) {
                setWordStats(JSON.parse(savedStats));
            }
            if (savedIndex !== null) {
                const index = parseInt(savedIndex, 10);
                if (index >= 0 && index < __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$words$2e$json__$28$json$29$__["default"].length) {
                    setCurrentIndex(index);
                }
            }
            setIsLoaded(true);
        }
    }["Home.useEffect"], []);
    // Sync stats to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (isLoaded) {
                localStorage.setItem('wordcard-stats', JSON.stringify(wordStats));
            }
        }
    }["Home.useEffect"], [
        wordStats,
        isLoaded
    ]);
    // Sync index to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (isLoaded) {
                localStorage.setItem('wordcard-index', currentIndex.toString());
            }
        }
    }["Home.useEffect"], [
        currentIndex,
        isLoaded
    ]);
    const currentWord = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$words$2e$json__$28$json$29$__["default"][currentIndex];
    const currentStat = wordStats[currentWord?.japanese] || {
        level: 0,
        lastReview: 0
    };
    const nextWord = ()=>{
        setCurrentIndex((currentIndex + 1) % __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$words$2e$json__$28$json$29$__["default"].length);
        setShowAnswer(false);
    };
    const prevWord = ()=>{
        setCurrentIndex((currentIndex - 1 + __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$words$2e$json__$28$json$29$__["default"].length) % __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$words$2e$json__$28$json$29$__["default"].length);
        setShowAnswer(false);
    };
    const handleFeedback = (remembered)=>{
        const wordKey = currentWord.japanese;
        const now = Date.now();
        const newLevel = remembered ? Math.min(currentStat.level + 1, 5) : 0;
        setWordStats((prev)=>({
                ...prev,
                [wordKey]: {
                    level: newLevel,
                    lastReview: now
                }
            }));
        // Automatically move to next word after a short delay
        setTimeout(()=>{
            nextWord();
        }, 300);
    };
    const toggleFlip = ()=>setShowAnswer(!showAnswer);
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFlip();
        }
    };
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$words$2e$json__$28$json$29$__["default"] || __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$words$2e$json__$28$json$29$__["default"].length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
            children: "暂无单词数据"
        }, void 0, false, {
            fileName: "[project]/pages/index.js",
            lineNumber: 85,
            columnNumber: 12
        }, this);
    }
    if (!isLoaded) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "师傅的购物单词本 - 记忆曲线版"
                }, void 0, false, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                children: "🧠 记忆曲线单词本"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            currentStat.level === 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].masteredBadge,
                children: "✨ 已掌握 (Level 5)"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 99,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].levelIndicator,
                children: [
                    1,
                    2,
                    3,
                    4,
                    5
                ].map((lvl)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].levelDot} ${currentStat.level >= lvl ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].levelDotActive : ''}`
                    }, lvl, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "button",
                tabIndex: 0,
                "aria-label": `单词卡片: ${currentWord.japanese}. 点击或按空格键翻转`,
                onKeyDown: handleKeyDown,
                onClick: toggleFlip,
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card} ${showAnswer ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardFlipped : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordJapanese,
                        children: currentWord.japanese
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordKana,
                        children: currentWord.kana
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    showAnswer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].answerArea,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordChinese,
                                children: currentWord.chinese
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 124,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordEnglish,
                                children: currentWord.english
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wordSource,
                                children: [
                                    "来源: ",
                                    currentWord.source
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hint,
                        children: "点击或按空格查看释义"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            showAnswer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].feedbackGroup,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleFeedback(false),
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonForgot}`,
                        children: "❌ 没记住 (Level 0)"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleFeedback(true),
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonRemember}`,
                        children: "✅ 记住了 (Level +1)"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 134,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonGroup,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: prevWord,
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonSecondary}`,
                        children: "← 上一个"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: nextWord,
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonPrimary}`,
                        children: "下一个 →"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 149,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].progress,
                children: [
                    "进度: ",
                    currentIndex + 1,
                    " / ",
                    __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$words$2e$json__$28$json$29$__["default"].length
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "掌握 5 个 Level 即视为“已掌握”。数据存储在本地浏览器中。"
                }, void 0, false, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 170,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 169,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s(Home, "tAp39XEU92bFP2Asa/Sb/DZJ8LM=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/index.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__675e24fc._.js.map