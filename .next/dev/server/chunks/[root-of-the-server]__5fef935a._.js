module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/lib/db.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "openDb",
    ()=>openDb
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$sqlite3__$5b$external$5d$__$28$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sqlite3$29$__ = __turbopack_context__.i("[externals]/sqlite3 [external] (sqlite3, cjs, [project]/node_modules/sqlite3)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sqlite__$5b$external$5d$__$28$sqlite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sqlite$29$__ = __turbopack_context__.i("[externals]/sqlite [external] (sqlite, esm_import, [project]/node_modules/sqlite)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$sqlite__$5b$external$5d$__$28$sqlite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sqlite$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$sqlite__$5b$external$5d$__$28$sqlite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sqlite$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function openDb() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$sqlite__$5b$external$5d$__$28$sqlite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sqlite$29$__["open"])({
        filename: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'database.sqlite'),
        driver: __TURBOPACK__imported__module__$5b$externals$5d2f$sqlite3__$5b$external$5d$__$28$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sqlite3$29$__["default"].Database
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/api/words.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function handler(req, res) {
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__["openDb"])();
    if (req.method === 'GET') {
        const words = await db.all('SELECT * FROM words');
        res.status(200).json(words);
    } else if (req.method === 'POST') {
        const { id, remembered } = req.body;
        const word = await db.get('SELECT * FROM words WHERE id = ?', [
            id
        ]);
        if (!word) {
            return res.status(404).json({
                error: 'Word not found'
            });
        }
        const newLearningCount = word.learning_count + 1;
        const newLevel = remembered ? Math.min(word.level + 1, 5) : 0;
        const isMemorized = newLevel === 5 ? 1 : 0;
        await db.run('UPDATE words SET learning_count = ?, level = ?, is_memorized = ? WHERE id = ?', [
            newLearningCount,
            newLevel,
            isMemorized,
            id
        ]);
        const updatedWord = await db.get('SELECT * FROM words WHERE id = ?', [
            id
        ]);
        res.status(200).json(updatedWord);
    } else {
        res.setHeader('Allow', [
            'GET',
            'POST'
        ]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5fef935a._.js.map