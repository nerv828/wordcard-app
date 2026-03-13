module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[project]/data/words.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v([{"japanese":"しっとり","kana":"しっとり","chinese":"湿润、润泽","english":"Moist","source":"FamilyMart (2026-03-11)"},{"japanese":"やわらか","kana":"やわらか","chinese":"柔软、松软","english":"Soft","source":"FamilyMart (2026-03-11)"},{"japanese":"食パン","kana":"しょくぱん","chinese":"食面包","english":"Plain Bread","source":"FamilyMart (2026-03-11)"},{"japanese":"コク","kana":"こく","chinese":"浓郁、醇厚","english":"Richness / Body","source":"FamilyMart (2026-03-11)"},{"japanese":"旨み","kana":"うまみ","chinese":"鲜美、美味","english":"Savory / Umami","source":"FamilyMart (2026-03-11)"},{"japanese":"たまご","kana":"たまご","chinese":"鸡蛋","english":"Egg","source":"FamilyMart (2026-03-11)"}]);}),
"[project]/styles/Home.module.css [ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$words$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/data/words.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/Home.module.css [ssr] (css module)");
;
;
;
;
;
function Home() {
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [showAnswer, setShowAnswer] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [wordStats, setWordStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    // Load progress and stats from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
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
    }, []);
    // Sync stats to localStorage
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (isLoaded) {
            localStorage.setItem('wordcard-stats', JSON.stringify(wordStats));
        }
    }, [
        wordStats,
        isLoaded
    ]);
    // Sync index to localStorage
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (isLoaded) {
            localStorage.setItem('wordcard-index', currentIndex.toString());
        }
    }, [
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
            children: "暂无单词数据"
        }, void 0, false, {
            fileName: "[project]/pages/index.js",
            lineNumber: 85,
            columnNumber: 12
        }, this);
    }
    if (!isLoaded) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].title,
                children: "🧠 记忆曲线单词本"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            currentStat.level === 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].masteredBadge,
                children: "✨ 已掌握 (Level 5)"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 99,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].levelIndicator,
                children: [
                    1,
                    2,
                    3,
                    4,
                    5
                ].map((lvl)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].levelDot} ${currentStat.level >= lvl ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].levelDotActive : ''}`
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                role: "button",
                tabIndex: 0,
                "aria-label": `单词卡片: ${currentWord.japanese}. 点击或按空格键翻转`,
                onKeyDown: handleKeyDown,
                onClick: toggleFlip,
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].card} ${showAnswer ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardFlipped : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordJapanese,
                        children: currentWord.japanese
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordKana,
                        children: currentWord.kana
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    showAnswer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].answerArea,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordChinese,
                                children: currentWord.chinese
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 124,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordEnglish,
                                children: currentWord.english
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("small", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wordSource,
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
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hint,
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
            showAnswer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].feedbackGroup,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleFeedback(false),
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].buttonForgot}`,
                        children: "❌ 没记住 (Level 0)"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleFeedback(true),
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].buttonRemember}`,
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
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].buttonGroup,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: prevWord,
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].buttonSecondary}`,
                        children: "← 上一个"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: nextWord,
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].button} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].buttonPrimary}`,
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].progress,
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Home$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footer,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__84e5bdf0._.js.map