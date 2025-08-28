(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/HeaderBar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>HeaderBar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function HeaderBar() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderBar.useEffect": ()=>{
            const stored = localStorage.getItem("user");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setUser(parsed);
                } catch (error) {
                    console.error("Gagal parsing user dari localStorage:", error);
                    localStorage.removeItem("user");
                    localStorage.removeItem("authToken");
                    router.push("/login");
                }
            } else {
                // Jika tidak ada user, redirect ke login
                router.push("/login");
            }
        }
    }["HeaderBar.useEffect"], [
        router
    ]);
    const handleLogout = ()=>{
        if (confirm("Yakin ingin logout?")) {
            // Hapus data autentikasi
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            // Log aktivitas logout
            console.log("User logout");
            // Redirect
            router.push("/login");
        }
    };
    if (!user) {
        return null; // Atau loading spinner
    }
    const displayName = user.fullName || user.username || "Pengguna";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center space-x-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/Logo.svg",
                        alt: "Logo Jangkar",
                        className: "h-8 w-8"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeaderBar.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-lg font-semibold text-blue-800",
                        children: "Vision Traffic Suite"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeaderBar.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/HeaderBar.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center space-x-3 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/Active.svg",
                        alt: "User Active",
                        className: "h-4 w-4 animate-pulse",
                        title: "Pengguna aktif"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeaderBar.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-slate-800 font-medium",
                        children: displayName
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeaderBar.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    user.role === "admin" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-300",
                                children: "|"
                            }, void 0, false, {
                                fileName: "[project]/src/components/HeaderBar.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push("/admin"),
                                className: "text-blue-600 hover:underline font-medium",
                                title: "Masuk ke panel admin",
                                children: "🛠️ Admin Panel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/HeaderBar.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-gray-300",
                        children: "|"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeaderBar.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleLogout,
                        className: "text-red-500 hover:underline",
                        title: "Keluar dari sistem",
                        children: "Logout"
                    }, void 0, false, {
                        fileName: "[project]/src/components/HeaderBar.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/HeaderBar.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/HeaderBar.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(HeaderBar, "C1U3W1/GLXpNOs2elmI/sE+Rt18=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = HeaderBar;
var _c;
__turbopack_context__.k.register(_c, "HeaderBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/SidebarLeft.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/SidebarLeft.tsx
__turbopack_context__.s({
    "default": (()=>SidebarLeft)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ToolContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/DataContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MapIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/MapIcon.js [app-client] (ecmascript) <export default as MapIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BeakerIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BeakerIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/BeakerIcon.js [app-client] (ecmascript) <export default as BeakerIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CursorArrowRaysIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CursorArrowRaysIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/CursorArrowRaysIcon.js [app-client] (ecmascript) <export default as CursorArrowRaysIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$WrenchScrewdriverIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WrenchScrewdriverIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/WrenchScrewdriverIcon.js [app-client] (ecmascript) <export default as WrenchScrewdriverIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$RectangleStackIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RectangleStackIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/RectangleStackIcon.js [app-client] (ecmascript) <export default as RectangleStackIcon>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function SidebarLeft() {
    _s();
    const { activeTool, setActiveTool } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"])();
    const { layerDefinitions, layerVisibility, setLayerVisibility, loadingLayers, errorLayers } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"])();
    // 🔧 Tools (bisa dari backend nanti)
    const toolOptions = [
        {
            value: "toponimi",
            label: "Tambah Toponimi",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MapIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapIcon$3e$__["MapIcon"],
            tooltip: "Menambahkan nama tempat di sungai"
        },
        {
            value: "simulasi",
            label: "Simulasi Akuisisi Data",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CursorArrowRaysIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CursorArrowRaysIcon$3e$__["CursorArrowRaysIcon"],
            tooltip: "Membuat transek otomatis dari garis tengah sungai"
        },
        {
            value: "echosounder",
            label: "Visualisasi Echosounder",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BeakerIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BeakerIcon$3e$__["BeakerIcon"],
            tooltip: "Menampilkan data echosounder"
        }
    ];
    // ✅ Toggle visibilitas layer (per item)
    const handleLayerVisibilityChange = (layerId)=>{
        setLayerVisibility(layerId, !layerVisibility[layerId]);
        // ✅ Simpan ke localStorage
        try {
            const newVisibility = {
                ...layerVisibility,
                [layerId]: !layerVisibility[layerId]
            };
            localStorage.setItem("layerVisibility", JSON.stringify(newVisibility));
        } catch (err) {
            console.warn("Gagal simpan layerVisibility ke localStorage", err);
        }
    };
    // ✅ Reset semua layer visibility
    const handleResetLayers = ()=>{
        if (!Array.isArray(layerDefinitions)) return;
        const reset = layerDefinitions.reduce((acc, layer)=>{
            setLayerVisibility(layer.id, false); // Reset via context
            return {
                ...acc,
                [layer.id]: false
            };
        }, {});
        try {
            localStorage.setItem("layerVisibility", JSON.stringify(reset));
        } catch (err) {
            console.warn("Gagal reset localStorage", err);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full w-72 border-r bg-white text-sm text-gray-800 shadow-md flex flex-col",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 space-y-6 flex-1 overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "flex items-center gap-2 mb-3 font-semibold border-b pb-1 text-base",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$RectangleStackIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RectangleStackIcon$3e$__["RectangleStackIcon"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SidebarLeft.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this),
                                "Layer List"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SidebarLeft.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this),
                        loadingLayers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center py-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-500 text-sm",
                                children: "Memuat layer..."
                            }, void 0, false, {
                                fileName: "[project]/src/components/SidebarLeft.tsx",
                                lineNumber: 82,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/SidebarLeft.tsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this),
                        errorLayers && !loadingLayers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-red-500 text-sm",
                                    children: [
                                        "❌ ",
                                        errorLayers
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SidebarLeft.tsx",
                                    lineNumber: 89,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.location.reload(),
                                    className: "text-xs text-blue-500 hover:underline mt-1",
                                    children: "Coba lagi"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SidebarLeft.tsx",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SidebarLeft.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this),
                        !loadingLayers && !errorLayers && Array.isArray(layerDefinitions) && layerDefinitions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: layerDefinitions.map((layer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center justify-between hover:bg-gray-100 p-2 rounded-md transition cursor-pointer group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    className: "accent-cyan-600 w-4 h-4",
                                                    checked: layerVisibility[layer.id] ?? false,
                                                    onChange: ()=>handleLayerVisibilityChange(layer.id)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SidebarLeft.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium",
                                                    children: layer.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SidebarLeft.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SidebarLeft.tsx",
                                            lineNumber: 101,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-400 text-xs group-hover:text-gray-700",
                                            title: layer.description || "Tidak ada deskripsi",
                                            children: "ℹ️"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SidebarLeft.tsx",
                                            lineNumber: 105,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, layer.id, true, {
                                    fileName: "[project]/src/components/SidebarLeft.tsx",
                                    lineNumber: 100,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SidebarLeft.tsx",
                            lineNumber: 98,
                            columnNumber: 13
                        }, this),
                        !loadingLayers && !errorLayers && (!Array.isArray(layerDefinitions) || layerDefinitions.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 text-sm",
                                    children: "Tidak ada layer tersedia."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SidebarLeft.tsx",
                                    lineNumber: 116,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleResetLayers,
                                    className: "text-xs text-blue-500 hover:underline mt-1",
                                    children: "Reset visibilitas"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SidebarLeft.tsx",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SidebarLeft.tsx",
                            lineNumber: 115,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SidebarLeft.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "flex items-center gap-2 mb-3 font-semibold border-b pb-1 text-base",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$WrenchScrewdriverIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WrenchScrewdriverIcon$3e$__["WrenchScrewdriverIcon"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SidebarLeft.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this),
                                "Tools"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SidebarLeft.tsx",
                            lineNumber: 126,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: toolOptions.map(({ value, label, icon: Icon, tooltip })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    title: tooltip,
                                    onClick: ()=>setActiveTool(value),
                                    className: `flex items-center w-full gap-2 p-2 rounded-md transition text-left hover:bg-indigo-50 ${activeTool === value ? "bg-indigo-100 font-semibold text-indigo-700" : "text-gray-700"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SidebarLeft.tsx",
                                            lineNumber: 138,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SidebarLeft.tsx",
                                            lineNumber: 139,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, `tool-${value}`, true, {
                                    fileName: "[project]/src/components/SidebarLeft.tsx",
                                    lineNumber: 132,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SidebarLeft.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SidebarLeft.tsx",
                    lineNumber: 125,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SidebarLeft.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/SidebarLeft.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(SidebarLeft, "vXIIAnVj7cQW6Jsyil2lHhKi1cc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"]
    ];
});
_c = SidebarLeft;
var _c;
__turbopack_context__.k.register(_c, "SidebarLeft");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/SidebarRight.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/SidebarRight.tsx
__turbopack_context__.s({
    "default": (()=>SidebarRight)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-chartjs-2/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/dist/chart.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/DataContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CategoryScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LinearScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PointElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LineElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Legend"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Filler"]);
function SidebarRight() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("field");
    const [surveyGroups, setSurveyGroups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedSurveyIds, setSelectedSurveyIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [allData, setAllData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingPoints, setLoadingPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const { dataVersion, surveyListVersion } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"])(); // gunakan surveyListVersion
    const itemsPerPage = 5;
    // --- Helper: Ambil token ---
    const getAuthHeaders = ()=>{
        const token = localStorage.getItem("authToken");
        return {
            "Content-Type": "application/json",
            ...token ? {
                Authorization: `Bearer ${token}`
            } : {}
        };
    };
    // === 1. Tab "Data Lapangan": Ambil dari localStorage ===
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SidebarRight.useEffect": ()=>{
            if (activeTab === "field") {
                try {
                    const saved = localStorage.getItem("fieldSurveys");
                    const surveys = saved ? JSON.parse(saved) : [];
                    setSurveyGroups(surveys);
                } catch (err) {
                    console.error("❌ Gagal baca fieldSurveys dari localStorage:", err);
                    setSurveyGroups([]);
                } finally{
                    setLoading(false);
                }
            }
        }
    }["SidebarRight.useEffect"], [
        activeTab,
        surveyListVersion
    ]);
    // === 2. Tab "Simulasi": Ambil dari GraphQL (seperti sebelumnya) ===
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SidebarRight.useEffect": ()=>{
            if (activeTab === "simulated") {
                const fetchSurveyGroups = {
                    "SidebarRight.useEffect.fetchSurveyGroups": async ()=>{
                        setLoading(true);
                        try {
                            const res = await fetch("http://localhost:5000/graphql", {
                                method: "POST",
                                headers: getAuthHeaders(),
                                body: JSON.stringify({
                                    query: `
                query GetSimulatedSurveys {
                  spatialFeatures(layerType: "valid_sampling_point") {
                    meta
                    source
                  }
                }
              `
                                })
                            });
                            const data = await res.json();
                            if (data.errors) throw new Error(data.errors[0].message);
                            const features = data.data?.spatialFeatures || [];
                            const grouped = {};
                            features.forEach({
                                "SidebarRight.useEffect.fetchSurveyGroups": (item)=>{
                                    const meta = item.meta || {};
                                    const surveyId = meta.survey_id || meta.surveyId || meta.SURVEY_ID || item.surveyId;
                                    if (!surveyId || item.source === "import") return;
                                    if (!grouped[surveyId]) {
                                        grouped[surveyId] = {
                                            surveyId,
                                            date: meta.survey_date || "N/A",
                                            transects: [],
                                            source: item.source || "drawing"
                                        };
                                    }
                                }
                            }["SidebarRight.useEffect.fetchSurveyGroups"]);
                            setSurveyGroups(Object.values(grouped));
                        } catch (err) {
                            console.error("❌ Gagal muat simulasi:", err);
                            alert("Gagal muat data simulasi.");
                            setSurveyGroups([]);
                        } finally{
                            setLoading(false);
                        }
                    }
                }["SidebarRight.useEffect.fetchSurveyGroups"];
                fetchSurveyGroups();
            }
        }
    }["SidebarRight.useEffect"], [
        activeTab,
        dataVersion
    ]);
    // --- Reset saat ganti tab ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SidebarRight.useEffect": ()=>{
            setSelectedSurveyIds([]);
            setCurrentPage(1);
        }
    }["SidebarRight.useEffect"], [
        activeTab
    ]);
    // --- Ambil titik untuk chart ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SidebarRight.useEffect": ()=>{
            const fetchAllPoints = {
                "SidebarRight.useEffect.fetchAllPoints": async ()=>{
                    if (selectedSurveyIds.length === 0) {
                        setAllData({});
                        return;
                    }
                    setLoadingPoints(true);
                    const newData = {};
                    try {
                        for (const surveyId of selectedSurveyIds){
                            const survey = surveyGroups.find({
                                "SidebarRight.useEffect.fetchAllPoints.survey": (s)=>s.surveyId === surveyId
                            }["SidebarRight.useEffect.fetchAllPoints.survey"]);
                            if (!survey) continue;
                            const isFieldData = survey.source === "import";
                            const query = isFieldData ? `query GetFieldPoints($surveyId: String!) { fieldSurveyPointsBySurveyId(surveyId: $surveyId) { meta } }` : `query GetSimulatedPoints($surveyId: String!) { samplingPointsBySurveyId(surveyId: $surveyId) { meta } }`;
                            const res = await fetch("http://localhost:5000/graphql", {
                                method: "POST",
                                headers: getAuthHeaders(),
                                body: JSON.stringify({
                                    query,
                                    variables: {
                                        surveyId
                                    }
                                })
                            });
                            const result = await res.json();
                            if (result.errors) continue;
                            const points = result.data?.[Object.keys(result.data)[0]] || [];
                            const processedPoints = points.map({
                                "SidebarRight.useEffect.fetchAllPoints.processedPoints": (p)=>{
                                    const meta = p.meta || {};
                                    const depth = parseFloat(meta.kedalaman ?? meta.depth ?? meta.depth_value ?? 0);
                                    const distance = parseFloat(meta.jarak ?? meta.distance_m ?? meta.distance ?? 0);
                                    return isNaN(depth) || isNaN(distance) ? null : {
                                        surveyId,
                                        distance: Math.round(distance * 100) / 100,
                                        depth: Math.abs(depth)
                                    };
                                }
                            }["SidebarRight.useEffect.fetchAllPoints.processedPoints"]).filter(Boolean);
                            processedPoints.sort({
                                "SidebarRight.useEffect.fetchAllPoints": (a, b)=>a.distance - b.distance
                            }["SidebarRight.useEffect.fetchAllPoints"]);
                            newData[surveyId] = processedPoints;
                        }
                        setAllData(newData);
                    } catch (err) {
                        console.error("❌ Gagal muat titik:", err);
                    } finally{
                        setLoadingPoints(false);
                    }
                }
            }["SidebarRight.useEffect.fetchAllPoints"];
            fetchAllPoints();
        }
    }["SidebarRight.useEffect"], [
        selectedSurveyIds,
        surveyGroups
    ]);
    // --- Sumbu X ---
    const allDistances = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SidebarRight.useMemo[allDistances]": ()=>{
            const distances = new Set();
            Object.values(allData).forEach({
                "SidebarRight.useMemo[allDistances]": (points)=>points.forEach({
                        "SidebarRight.useMemo[allDistances]": (p)=>distances.add(p.distance)
                    }["SidebarRight.useMemo[allDistances]"])
            }["SidebarRight.useMemo[allDistances]"]);
            return Array.from(distances).sort({
                "SidebarRight.useMemo[allDistances]": (a, b)=>a - b
            }["SidebarRight.useMemo[allDistances]"]);
        }
    }["SidebarRight.useMemo[allDistances]"], [
        allData
    ]);
    // --- Data Chart ---
    const chartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SidebarRight.useMemo[chartData]": ()=>{
            const datasets = selectedSurveyIds.map({
                "SidebarRight.useMemo[chartData].datasets": (surveyId, idx)=>{
                    const points = allData[surveyId] || [];
                    const colorHue = idx * 130 % 360;
                    const borderColor = `hsl(${colorHue}, 70%, 50%)`;
                    const backgroundColor = `hsl(${colorHue}, 70%, 50%, 0.2)`;
                    const data = allDistances.map({
                        "SidebarRight.useMemo[chartData].datasets.data": (dist)=>{
                            const point = points.find({
                                "SidebarRight.useMemo[chartData].datasets.data.point": (p)=>Math.abs(p.distance - dist) < 0.5
                            }["SidebarRight.useMemo[chartData].datasets.data.point"]);
                            return point ? point.depth : null;
                        }
                    }["SidebarRight.useMemo[chartData].datasets.data"]);
                    return {
                        label: `Survey ${surveyId.slice(-6)}`,
                        data,
                        borderColor,
                        backgroundColor,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4
                    };
                }
            }["SidebarRight.useMemo[chartData].datasets"]);
            return {
                labels: allDistances.map({
                    "SidebarRight.useMemo[chartData]": (d)=>d.toFixed(0)
                }["SidebarRight.useMemo[chartData]"]),
                datasets
            };
        }
    }["SidebarRight.useMemo[chartData]"], [
        allDistances,
        allData,
        selectedSurveyIds
    ]);
    // --- Opsi Chart ---
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                    boxWidth: 6,
                    padding: 12,
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "rgba(0,0,0,0.8)",
                titleColor: "#fff",
                bodyColor: "#ccc",
                callbacks: {
                    label: (ctx)=>`${ctx.dataset?.label}: ${ctx.parsed.y} m`
                }
            }
        },
        scales: {
            y: {
                reverse: true,
                title: {
                    display: true,
                    text: "Kedalaman (m)"
                },
                ticks: {
                    stepSize: 1
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Jarak dari Awal Transek (m)"
                }
            }
        }
    };
    // === Filter dan Pagination ===
    const filteredSurveyGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SidebarRight.useMemo[filteredSurveyGroups]": ()=>{
            return surveyGroups.filter({
                "SidebarRight.useMemo[filteredSurveyGroups]": (s)=>activeTab === "field" ? s.source === "import" : s.source !== "import"
            }["SidebarRight.useMemo[filteredSurveyGroups]"]);
        }
    }["SidebarRight.useMemo[filteredSurveyGroups]"], [
        surveyGroups,
        activeTab
    ]);
    const totalPages = Math.ceil(filteredSurveyGroups.length / itemsPerPage);
    const currentSurveys = filteredSurveyGroups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // === Render UI ===
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 w-full space-y-6 bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-lg h-full overflow-y-auto border border-slate-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-bold text-xl text-slate-800 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-blue-600",
                                children: "📊"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SidebarRight.tsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, this),
                            "Perbandingan Penampang Transek"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-1 bg-slate-100 rounded-lg p-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("field"),
                                className: `px-3 py-1 text-sm font-medium rounded-md transition ${activeTab === "field" ? "bg-blue-500 text-white shadow" : "text-slate-600 hover:bg-slate-200"}`,
                                children: "📥 Data Lapangan"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SidebarRight.tsx",
                                lineNumber: 264,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("simulated"),
                                className: `px-3 py-1 text-sm font-medium rounded-md transition ${activeTab === "simulated" ? "bg-blue-500 text-white shadow" : "text-slate-600 hover:bg-slate-200"}`,
                                children: "🖌️ Simulasi"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SidebarRight.tsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SidebarRight.tsx",
                lineNumber: 258,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-semibold text-slate-700",
                        children: [
                            "Pilih Survey (",
                            activeTab === "field" ? "Lapangan" : "Simulasi",
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-500 italic",
                        children: "Memuat daftar..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this) : filteredSurveyGroups.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-400 italic",
                        children: activeTab === "field" ? "Belum ada data upload." : "Tidak ada data simulasi."
                    }, void 0, false, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 280,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "overflow-x-auto border rounded-lg bg-white shadow-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "min-w-full divide-y divide-slate-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            className: "bg-slate-50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: selectedSurveyIds.length > 0 && selectedSurveyIds.every((id)=>filteredSurveyGroups.some((s)=>s.surveyId === id)),
                                                            onChange: (e)=>setSelectedSurveyIds(e.target.checked ? filteredSurveyGroups.map((s)=>s.surveyId) : []),
                                                            className: "rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SidebarRight.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SidebarRight.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider",
                                                        children: "Survey ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SidebarRight.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider",
                                                        children: "Tanggal"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SidebarRight.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider",
                                                        children: "Titik"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SidebarRight.tsx",
                                                        lineNumber: 297,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SidebarRight.tsx",
                                                lineNumber: 286,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SidebarRight.tsx",
                                            lineNumber: 285,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            className: "divide-y divide-slate-200",
                                            children: currentSurveys.map((survey)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: `transition-all hover:bg-blue-50 cursor-pointer ${selectedSurveyIds.includes(survey.surveyId) ? "bg-blue-50 border-l-4 border-blue-400" : ""}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: selectedSurveyIds.includes(survey.surveyId),
                                                                onChange: ()=>setSelectedSurveyIds((prev)=>prev.includes(survey.surveyId) ? prev.filter((id)=>id !== survey.surveyId) : [
                                                                            ...prev,
                                                                            survey.surveyId
                                                                        ]),
                                                                className: "rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SidebarRight.tsx",
                                                                lineNumber: 304,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SidebarRight.tsx",
                                                            lineNumber: 303,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-3 font-mono text-sm text-slate-800",
                                                            children: [
                                                                "SURVEY...",
                                                                survey.surveyId.slice(-6)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SidebarRight.tsx",
                                                            lineNumber: 311,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-3 text-sm text-slate-500",
                                                            children: survey.date
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SidebarRight.tsx",
                                                            lineNumber: 312,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-3 text-sm text-slate-500",
                                                            children: allData[survey.surveyId]?.length || 0
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SidebarRight.tsx",
                                                            lineNumber: 313,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, survey.surveyId, true, {
                                                    fileName: "[project]/src/components/SidebarRight.tsx",
                                                    lineNumber: 302,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SidebarRight.tsx",
                                            lineNumber: 300,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SidebarRight.tsx",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/SidebarRight.tsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-sm text-slate-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "Menampilkan ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: currentSurveys.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SidebarRight.tsx",
                                                lineNumber: 323,
                                                columnNumber: 29
                                            }, this),
                                            " dari ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: filteredSurveyGroups.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SidebarRight.tsx",
                                                lineNumber: 323,
                                                columnNumber: 95
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SidebarRight.tsx",
                                        lineNumber: 322,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setCurrentPage((prev)=>Math.max(prev - 1, 1)),
                                                disabled: currentPage === 1,
                                                className: `px-3 py-1 rounded border ${currentPage === 1 ? "bg-slate-100 text-slate-400" : "bg-white text-slate-700 hover:bg-slate-50"}`,
                                                children: "Previous"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SidebarRight.tsx",
                                                lineNumber: 326,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    currentPage,
                                                    " / ",
                                                    totalPages
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SidebarRight.tsx",
                                                lineNumber: 333,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setCurrentPage((prev)=>Math.min(prev + 1, totalPages)),
                                                disabled: currentPage === totalPages,
                                                className: `px-3 py-1 rounded border ${currentPage === totalPages ? "bg-slate-100 text-slate-400" : "bg-white text-slate-700 hover:bg-slate-50"}`,
                                                children: "Next"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SidebarRight.tsx",
                                                lineNumber: 336,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SidebarRight.tsx",
                                        lineNumber: 325,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SidebarRight.tsx",
                                lineNumber: 321,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-500",
                        children: "Pilih survey untuk membandingkan profil dasar."
                    }, void 0, false, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 347,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SidebarRight.tsx",
                lineNumber: 274,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 h-80 bg-white p-4 rounded-lg shadow-inner",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold mb-3 text-slate-700",
                        children: "Grafik Profil Dasar"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 352,
                        columnNumber: 9
                    }, this),
                    loadingPoints ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center h-64",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-slate-500",
                            children: "📊 Memuat data..."
                        }, void 0, false, {
                            fileName: "[project]/src/components/SidebarRight.tsx",
                            lineNumber: 355,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 354,
                        columnNumber: 11
                    }, this) : selectedSurveyIds.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center h-64 text-slate-400",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "italic",
                            children: [
                                'Pilih survey dari tab "',
                                activeTab === "field" ? "Data Lapangan" : "Simulasi",
                                '".'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SidebarRight.tsx",
                            lineNumber: 359,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 358,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                        data: chartData,
                        options: chartOptions
                    }, void 0, false, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 362,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SidebarRight.tsx",
                lineNumber: 351,
                columnNumber: 7
            }, this),
            selectedSurveyIds.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-slate-600 space-y-1 border-t pt-3 border-slate-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "✅ Survey Dipilih:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SidebarRight.tsx",
                                lineNumber: 370,
                                columnNumber: 13
                            }, this),
                            " ",
                            selectedSurveyIds.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 369,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "📊 Total Titik:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SidebarRight.tsx",
                                lineNumber: 373,
                                columnNumber: 13
                            }, this),
                            " ",
                            Object.values(allData).flat().length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 372,
                        columnNumber: 11
                    }, this),
                    allDistances.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "📏 Jarak Maks:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SidebarRight.tsx",
                                lineNumber: 377,
                                columnNumber: 15
                            }, this),
                            " ",
                            Math.max(...allDistances),
                            " m"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SidebarRight.tsx",
                        lineNumber: 376,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SidebarRight.tsx",
                lineNumber: 368,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SidebarRight.tsx",
        lineNumber: 256,
        columnNumber: 5
    }, this);
}
_s(SidebarRight, "/QzJJVNWbMcZmziE3zKgeqHRcS8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"]
    ];
});
_c = SidebarRight;
var _c;
__turbopack_context__.k.register(_c, "SidebarRight");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/BottomPanel.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>AttributeTable)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$material$2d$react$2d$table$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/material-react-table/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Box/Box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/IconButton/IconButton.js [app-client] (ecmascript) <export default as IconButton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Tooltip/Tooltip.js [app-client] (ecmascript) <export default as Tooltip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircularProgress$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/CircularProgress/CircularProgress.js [app-client] (ecmascript) <export default as CircularProgress>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Refresh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/icons-material/esm/Refresh.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/DataContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// --- Utility: Flatten feature ---
function flattenFeature(feature, layerName) {
    const { properties = {}, geometry } = feature;
    return {
        layer: layerName,
        geomType: geometry?.type || "Unknown",
        ...properties
    };
}
// --- GraphQL Fetch Function ---
async function fetchFreshAttributes(visibleLayerTypes) {
    try {
        const response = await fetch("http://localhost:5000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: `
          query GetFeaturesByLayerTypes($layerTypes: [String!]!) {
            featuresByLayerTypes(layerTypes: $layerTypes) {
              type
              geometry
              properties
            }
          }
        `,
                variables: {
                    layerTypes: visibleLayerTypes
                }
            })
        });
        const result = await response.json();
        return result.data?.featuresByLayerTypes || [];
    } catch (error) {
        console.error("❌ Gagal fetch dari server:", error);
        return [];
    }
}
function AttributeTable() {
    _s();
    const { layerDefinitions, layerVisibility, features: allFeatures, refreshData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"])();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [columns, setColumns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSyncing, setIsSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // --- Format header kolom ---
    const formatHeader = (key)=>key.replace(/([A-Z])/g, " $1") // camelCase ke spasi
        .replace(/^_+/, "") // hapus underscore di awal
        .replace("geomType", "Tipe Geometri").replace("layer", "Layer").trim();
    // --- Ambil data dari context (frontend) ---
    const getLocalData = ()=>{
        // Cek null safety
        if (!allFeatures?.features || !layerDefinitions || !layerVisibility) {
            setData([]);
            setColumns([]);
            return [];
        }
        // Filter layer yang visible
        const visibleLayers = layerDefinitions.filter((layer)=>layer && (layerVisibility[layer.id] ?? false));
        const result = [];
        const fieldSet = new Set([
            "layer",
            "geomType"
        ]); // minimal kolom
        visibleLayers.forEach((layer)=>{
            if (!layer?.layerType) return;
            // Filter feature berdasarkan layerType
            const features = allFeatures.features.filter((f)=>f.properties?.layerType === layer.layerType);
            features.forEach((feature)=>{
                const flattened = flattenFeature(feature, layer.name || layer.layerType);
                result.push(flattened);
                Object.keys(flattened).forEach((key)=>fieldSet.add(key));
            });
        });
        // Generate kolom dinamis
        const dynamicColumns = Array.from(fieldSet).sort((a, b)=>{
            if (a === "layer") return -1;
            if (b === "layer") return 1;
            return a.localeCompare(b);
        }).map((key)=>({
                accessorKey: key,
                header: formatHeader(key),
                size: key === "layer" ? 140 : key === "geomType" ? 120 : 160
            }));
        setColumns(dynamicColumns);
        return result;
    };
    // --- ✅ Auto-sync saat layerVisibility atau data berubah ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AttributeTable.useEffect": ()=>{
            const localData = getLocalData();
            setData(localData);
        }
    }["AttributeTable.useEffect"], [
        layerVisibility,
        allFeatures
    ]);
    // --- Handler: Refresh dari server (opsional) ---
    const handleForceRefresh = async ()=>{
        setIsSyncing(true);
        // Ambil layerType dari layer yang visible
        const visibleLayerTypes = layerDefinitions?.filter((layer)=>layer && (layerVisibility[layer.id] ?? false)).map((layer)=>layer.layerType).filter(Boolean);
        if (!visibleLayerTypes?.length) {
            setIsSyncing(false);
            return;
        }
        try {
            const freshFeatures = await fetchFreshAttributes(visibleLayerTypes);
            if (freshFeatures.length === 0) return;
            const freshData = freshFeatures.map((f)=>flattenFeature(f, layerDefinitions.find((l)=>l?.layerType === f.properties?.layerType)?.name || f.properties?.layerType || "Unknown"));
            setData(freshData);
        } catch (err) {
            console.warn("Gagal fetch dari server, tetap gunakan data lokal", err);
        } finally{
            setIsSyncing(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-lg shadow overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$material$2d$react$2d$table$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MaterialReactTable"], {
                columns: columns,
                data: data,
                enableColumnResizing: true,
                enableColumnOrdering: true,
                enablePinning: true,
                enableRowNumbers: true,
                enablePagination: true,
                enableGlobalFilter: true,
                enableColumnFilters: true,
                initialState: {
                    density: "compact",
                    pagination: {
                        pageSize: 10,
                        pageIndex: 0
                    }
                },
                muiTableContainerProps: {
                    sx: {
                        maxHeight: "400px"
                    }
                },
                renderTopToolbarCustomActions: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                        sx: {
                            display: "flex",
                            gap: "1rem",
                            alignItems: "center"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold",
                                children: "📋 Attribute Table"
                            }, void 0, false, {
                                fileName: "[project]/src/components/BottomPanel.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, void 0),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
                                title: "Sinkron ulang dari server",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$IconButton$2f$IconButton$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IconButton$3e$__["IconButton"], {
                                        onClick: handleForceRefresh,
                                        disabled: isSyncing,
                                        size: "small",
                                        color: "primary",
                                        children: isSyncing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircularProgress$3e$__["CircularProgress"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/BottomPanel.tsx",
                                            lineNumber: 170,
                                            columnNumber: 32
                                        }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$icons$2d$material$2f$esm$2f$Refresh$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/BottomPanel.tsx",
                                            lineNumber: 170,
                                            columnNumber: 65
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/BottomPanel.tsx",
                                        lineNumber: 169,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/BottomPanel.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/src/components/BottomPanel.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, void 0),
                            isSyncing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                sx: {
                                    fontSize: "0.875rem",
                                    color: "text.secondary"
                                },
                                children: "Memuat data terbaru..."
                            }, void 0, false, {
                                fileName: "[project]/src/components/BottomPanel.tsx",
                                lineNumber: 175,
                                columnNumber: 27
                            }, void 0)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/BottomPanel.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, void 0),
                muiTablePaperProps: {
                    elevation: 0,
                    sx: {
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0"
                    }
                },
                state: {
                    showProgressBars: isSyncing
                }
            }, void 0, false, {
                fileName: "[project]/src/components/BottomPanel.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            data.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Box$2f$Box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                sx: {
                    p: 2,
                    color: "text.secondary",
                    textAlign: "center",
                    fontSize: "0.9rem"
                },
                children: "📭 Tidak ada layer yang ditampilkan. Aktifkan layer dari peta untuk melihat atribut."
            }, void 0, false, {
                fileName: "[project]/src/components/BottomPanel.tsx",
                lineNumber: 191,
                columnNumber: 29
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/BottomPanel.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
_s(AttributeTable, "jdy6Dw14yiSIfwi9Kbq9HdYcTio=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"]
    ];
});
_c = AttributeTable;
var _c;
__turbopack_context__.k.register(_c, "AttributeTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/panels/FeaturePanel.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/panels/FeaturePanel.tsx
__turbopack_context__.s({
    "default": (()=>FeaturePanel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/DataContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ToolContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// ✅ Fungsi bantu: Ambil headers otentikasi
const getAuthHeaders = ()=>{
    const token = localStorage.getItem("authToken");
    return {
        ...token ? {
            Authorization: `Bearer ${token}`
        } : {}
    };
};
function FeaturePanel({ activePanel, close }) {
    _s();
    const { echosounderData, setEchosounderData, refreshData, refreshSurveyList } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"])();
    const { setShowSidebarRight, setShowSurface3D } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"])();
    const [manualJarak, setManualJarak] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [manualKedalaman, setManualKedalaman] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [uploadStatus, setUploadStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // --- Input manual ---
    const handleSubmit = (e)=>{
        e.preventDefault();
        const jarak = parseFloat(manualJarak);
        const kedalaman = parseFloat(manualKedalaman);
        if (isNaN(jarak) || isNaN(kedalaman)) {
            alert("❌ Jarak dan kedalaman harus angka.");
            return;
        }
        setEchosounderData((prev)=>[
                ...Array.isArray(prev) ? prev : [],
                {
                    jarak,
                    kedalaman
                }
            ]);
        setManualJarak("");
        setManualKedalaman("");
    };
    // --- Upload CSV ---
    const handleCSVUpload = (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadStatus({
            loading: true,
            type: "unknown",
            count: 0
        });
        const formData = new FormData();
        formData.append("file", file);
        fetch("http://localhost:5000/api/upload/echosounder", {
            method: "POST",
            body: formData,
            headers: getAuthHeaders()
        }).then((res)=>{
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            return res.json();
        }).then((result)=>{
            console.log("✅ Upload sukses:", result);
            if (result.success) {
                // ✅ 1. Simpan ke localStorage sebagai riwayat upload
                const savedSurveys = JSON.parse(localStorage.getItem("fieldSurveys") || "[]");
                const newSurvey = {
                    surveyId: result.surveyId,
                    date: new Date().toLocaleDateString("id-ID"),
                    count: result.count,
                    source: "import",
                    uploadedAt: new Date().toISOString()
                };
                // Hindari duplikat
                const filtered = savedSurveys.filter((s)=>s.surveyId !== result.surveyId);
                localStorage.setItem("fieldSurveys", JSON.stringify([
                    ...filtered,
                    newSurvey
                ]));
                // ✅ 2. Trigger refresh di SidebarRight
                refreshSurveyList(); // ← Hanya untuk list di tab "Data Lapangan"
                refreshData(); // ← Untuk sinkron data utama (opsional)
                alert(`✅ ${result.count} titik berhasil diimpor sebagai ${result.surveyId}`);
            } else {
                alert(`❌ Upload gagal: ${result.error}`);
            }
        }).catch((err)=>{
            console.error("❌ Gagal upload:", err);
            alert(`❌ Gagal upload: ${err.message}`);
        }).finally(()=>{
            setUploadStatus(null);
            e.target.value = "";
        });
    };
    // --- Sinkronisasi ke localStorage ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FeaturePanel.useEffect": ()=>{
            if (Array.isArray(echosounderData)) {
                try {
                    localStorage.setItem("echosounderData", JSON.stringify(echosounderData));
                } catch (err) {
                    console.warn("Gagal simpan ke localStorage:", err);
                }
            }
        }
    }["FeaturePanel.useEffect"], [
        echosounderData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FeaturePanel.useEffect": ()=>({
                "FeaturePanel.useEffect": ()=>setUploadStatus(null)
            })["FeaturePanel.useEffect"]
    }["FeaturePanel.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute top-4 left-1/2 -translate-x-1/2 w-[480px] bg-white rounded-xl shadow-2xl p-5 z-50 overflow-auto max-h-[90vh] border border-gray-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-4 pb-3 border-b border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-bold text-slate-800 flex items-center gap-2",
                        children: [
                            activePanel === "echosounder" && "📊",
                            " ",
                            panelTitle[activePanel]
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: close,
                        className: "text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-all",
                        "aria-label": "Tutup",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            activePanel === "echosounder" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600",
                        children: "Masukkan data kedalaman manual atau unggah file CSV."
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "space-y-3 bg-gray-50 p-4 rounded-lg border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-medium text-slate-700",
                                children: "➕ Input Manual"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs text-slate-600",
                                                children: "Jarak (m)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                step: "any",
                                                value: manualJarak,
                                                onChange: (e)=>setManualJarak(e.target.value),
                                                required: true,
                                                className: "w-full border rounded px-3 py-2 text-sm",
                                                placeholder: "50.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                                lineNumber: 146,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs text-slate-600",
                                                children: "Kedalaman (m)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                step: "any",
                                                value: manualKedalaman,
                                                onChange: (e)=>setManualKedalaman(e.target.value),
                                                required: true,
                                                className: "w-full border rounded px-3 py-2 text-sm",
                                                placeholder: "2.3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 text-sm font-medium",
                                children: "Tambah Titik"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-blue-50 p-4 rounded-lg border border-blue-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-medium text-slate-700 mb-1",
                                children: "📁 Unggah CSV"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: ".csv",
                                onChange: handleCSVUpload,
                                className: "text-sm block w-full"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this),
                            uploadStatus?.loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-blue-600 mt-2",
                                children: "🔄 Memproses file..."
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                lineNumber: 161,
                                columnNumber: 39
                            }, this),
                            uploadStatus && !uploadStatus.loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xs text-green-600",
                                children: [
                                    "✅ ",
                                    uploadStatus.count,
                                    " titik dimuat sebagai ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: uploadStatus.type.toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                        lineNumber: 164,
                                        columnNumber: 61
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                lineNumber: 163,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/template_echosounder.csv",
                                download: true,
                                className: "text-xs text-blue-600 hover:underline block mt-2",
                                children: "📥 Download Template CSV"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                        lineNumber: 158,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 pt-3 border-t",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setShowSidebarRight(true);
                                    close();
                                },
                                className: "flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-500 text-sm font-medium",
                                children: "📈 Tampilkan 2D"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setShowSurface3D(true);
                                    close();
                                },
                                className: "flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-500 text-sm font-medium",
                                children: "🌐 Buka 3D"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                        lineNumber: 172,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/FeaturePanel.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/panels/FeaturePanel.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_s(FeaturePanel, "FwBQnLxcriZuj+MOyIjPO0GAkWM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$DataContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"]
    ];
});
_c = FeaturePanel;
// --- Helper Judul Panel ---
const panelTitle = {
    rute: "Input Data Rute Survey",
    interpolasi: "Interpolasi Data Batimetri",
    sbn: "Sarana Bantu Navigasi",
    echosounder: "Visualisasi Echosounder"
};
var _c;
__turbopack_context__.k.register(_c, "FeaturePanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/utils/BasemapSwitcher.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>BasemapSwitcher)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function BasemapSwitcher({ onChange, current, defaultPosition }) {
    _s();
    const basemaps = [
        {
            id: "osm",
            label: "OSM",
            icon: "/icons/map1.png"
        },
        {
            id: "satellite",
            label: "Satellite",
            icon: "/icons/map2.png"
        },
        {
            id: "terrain",
            label: "Terrain",
            icon: "/icons/map3.png"
        }
    ];
    const active = basemaps.find((b)=>b.id === current) || basemaps[0];
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dragRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isDragging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const offset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "BasemapSwitcher.useState": ()=>{
            if (defaultPosition) return defaultPosition;
            if ("TURBOPACK compile-time truthy", 1) {
                const bottomPadding = 100; // default offset above location button
                return {
                    x: 20,
                    y: window.innerHeight - bottomPadding
                };
            }
            "TURBOPACK unreachable";
        }
    }["BasemapSwitcher.useState"]);
    // Click outside to close
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BasemapSwitcher.useEffect": ()=>{
            function handleClickOutside(event) {
                if (panelRef.current && !panelRef.current.contains(event.target)) {
                    setOpen(false);
                }
            }
            if (open) {
                document.addEventListener("mousedown", handleClickOutside);
            }
            return ({
                "BasemapSwitcher.useEffect": ()=>{
                    document.removeEventListener("mousedown", handleClickOutside);
                }
            })["BasemapSwitcher.useEffect"];
        }
    }["BasemapSwitcher.useEffect"], [
        open
    ]);
    // Drag logic
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BasemapSwitcher.useEffect": ()=>{
            function handleMouseMove(e) {
                if (!isDragging.current) return;
                setPosition({
                    x: e.clientX - offset.current.x,
                    y: e.clientY - offset.current.y
                });
            }
            function handleMouseUp() {
                isDragging.current = false;
            }
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            return ({
                "BasemapSwitcher.useEffect": ()=>{
                    window.removeEventListener("mousemove", handleMouseMove);
                    window.removeEventListener("mouseup", handleMouseUp);
                }
            })["BasemapSwitcher.useEffect"];
        }
    }["BasemapSwitcher.useEffect"], []);
    function handleMouseDown(e) {
        if (!dragRef.current) return;
        isDragging.current = true;
        const rect = dragRef.current.getBoundingClientRect();
        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: dragRef,
        className: "fixed z-[999] cursor-grab",
        style: {
            top: position.y,
            left: position.x
        },
        onMouseDown: handleMouseDown,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: panelRef,
            className: "relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setOpen(!open),
                    className: "bg-white/90 p-1 rounded-full border shadow hover:scale-105 transition",
                    title: "Pilih Basemap",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: active.icon,
                        alt: active.label,
                        width: 40,
                        height: 40
                    }, void 0, false, {
                        fileName: "[project]/src/components/utils/BasemapSwitcher.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/utils/BasemapSwitcher.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            scale: 0.8,
                            x: -30,
                            y: -10
                        },
                        animate: {
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            scale: 0.8,
                            x: -30,
                            y: -10
                        },
                        transition: {
                            duration: 0.2
                        },
                        className: "absolute right-0 top-0 mt-3 mr-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg ring-1 ring-black/5 p-1 flex flex-row gap-1",
                        children: basemaps.map((base)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    onChange(base.id);
                                    setOpen(false);
                                },
                                className: `flex flex-col items-center justify-center px-2 py-1.5 rounded-xl hover:bg-cyan-50 transition-all duration-200 ${current === base.id ? "bg-cyan-100 font-semibold" : ""}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-6 h-6 relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: base.icon,
                                            alt: base.label,
                                            fill: true,
                                            className: "object-contain"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/utils/BasemapSwitcher.tsx",
                                            lineNumber: 112,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/utils/BasemapSwitcher.tsx",
                                        lineNumber: 111,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-700 mt-1 leading-none",
                                        children: base.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/utils/BasemapSwitcher.tsx",
                                        lineNumber: 114,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, base.id, true, {
                                fileName: "[project]/src/components/utils/BasemapSwitcher.tsx",
                                lineNumber: 103,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/utils/BasemapSwitcher.tsx",
                        lineNumber: 95,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/utils/BasemapSwitcher.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/utils/BasemapSwitcher.tsx",
            lineNumber: 88,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/utils/BasemapSwitcher.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_s(BasemapSwitcher, "aTAlRjYupMK1rOLWTqEJNUAMWvg=");
_c = BasemapSwitcher;
var _c;
__turbopack_context__.k.register(_c, "BasemapSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/PanelToggler.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>PanelToggler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$panel$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutPanelLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-panel-left.js [app-client] (ecmascript) <export default as LayoutPanelLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$panel$2d$top$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutPanelTop$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-panel-top.js [app-client] (ecmascript) <export default as LayoutPanelTop>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/md/index.mjs [app-client] (ecmascript)");
;
;
;
function PanelToggler({ onToggleLeft, onToggleRight, onToggleBottom }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute top-4 right-4 z-30 flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggleLeft,
                className: "bg-white/70 backdrop-blur border border-gray-300 rounded-lg shadow p-2 hover:bg-white transition",
                title: "Toggle Sidebar Kiri",
                "aria-label": "Toggle Sidebar Kiri",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$panel$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutPanelLeft$3e$__["LayoutPanelLeft"], {
                    className: "w-5 h-5 text-gray-700"
                }, void 0, false, {
                    fileName: "[project]/src/components/PanelToggler.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/PanelToggler.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggleRight,
                className: "bg-white/70 backdrop-blur border border-gray-300 rounded-lg shadow p-2 hover:bg-white transition",
                title: "Toggle Sidebar Kanan",
                "aria-label": "Toggle Sidebar Kanan",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdViewSidebar"], {
                    className: "w-5 h-5 text-gray-700 rotate-180"
                }, void 0, false, {
                    fileName: "[project]/src/components/PanelToggler.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/PanelToggler.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggleBottom,
                className: "bg-white/70 backdrop-blur border border-gray-300 rounded-lg shadow p-2 hover:bg-white transition",
                title: "Toggle Panel Bawah",
                "aria-label": "Toggle Panel Bawah",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$panel$2d$top$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutPanelTop$3e$__["LayoutPanelTop"], {
                    className: "w-5 h-5 text-gray-700 rotate-180"
                }, void 0, false, {
                    fileName: "[project]/src/components/PanelToggler.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/PanelToggler.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/PanelToggler.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = PanelToggler;
var _c;
__turbopack_context__.k.register(_c, "PanelToggler");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/SamplingBottomSidebar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SamplingBottomSidebar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ToolContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function SamplingBottomSidebar({ visible, onClose }) {
    _s();
    const { samplingPoints = [], samplingSummary, samplingUpdatedAt } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"])();
    const [showSuccess, setShowSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SamplingBottomSidebar.useEffect": ()=>{
            if (visible && samplingUpdatedAt) {
                setShowSuccess(true);
                const timer = setTimeout({
                    "SamplingBottomSidebar.useEffect.timer": ()=>setShowSuccess(false)
                }["SamplingBottomSidebar.useEffect.timer"], 3000);
                return ({
                    "SamplingBottomSidebar.useEffect": ()=>clearTimeout(timer)
                })["SamplingBottomSidebar.useEffect"];
            }
        }
    }["SamplingBottomSidebar.useEffect"], [
        samplingUpdatedAt,
        visible
    ]);
    if (!visible || !samplingSummary) return null;
    const { panjang, kedalamanAvg, lebarAvg, jumlahTitik } = samplingSummary;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 p-4 z-[999] shadow-lg text-gray-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-5xl mx-auto text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-semibold text-base text-gray-900",
                            children: "🧪 Informasi Sampling"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this),
                        onClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "text-sm text-red-600 hover:underline",
                            onClick: onClose,
                            children: "❌ Tutup"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                            lineNumber: 33,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                showSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-3 text-green-800 bg-green-100 border border-green-300 px-4 py-2 rounded-md animate-fade-in",
                    children: "✅ Sampling berhasil dibuat!"
                }, void 0, false, {
                    fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                    lineNumber: 39,
                    columnNumber: 25
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                "📏 Panjang Sungai: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "text-black",
                                    children: Number.isFinite(panjang) ? panjang.toFixed(2) : "-"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                                    lineNumber: 43,
                                    columnNumber: 32
                                }, this),
                                " m"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                "🌊 Kedalaman Rata-rata: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "text-black",
                                    children: Number.isFinite(kedalamanAvg) ? kedalamanAvg.toFixed(1) : "-"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                                    lineNumber: 46,
                                    columnNumber: 37
                                }, this),
                                " m"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                "📐 Lebar Rata-rata: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "text-black",
                                    children: Number.isFinite(lebarAvg) ? lebarAvg.toFixed(1) : "-"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                                    lineNumber: 49,
                                    columnNumber: 33
                                }, this),
                                " m"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                "🎯 Jumlah Titik: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "text-black",
                                    children: jumlahTitik ?? "-"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                                    lineNumber: 52,
                                    columnNumber: 30
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                Array.isArray(samplingPoints) && samplingPoints.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                    className: "mt-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                            className: "cursor-pointer text-blue-700 hover:underline",
                            children: "🔘 Lihat 5 koordinat pertama"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                            className: "list-decimal list-inside mt-2 max-h-32 overflow-y-auto text-xs bg-gray-100 p-2 rounded text-gray-800",
                            children: samplingPoints.slice(0, 5).map((pt, i)=>{
                                const [lng, lat] = pt?.geometry?.coordinates ?? [
                                    null,
                                    null
                                ];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: lat != null && lng != null ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : "Koordinat tidak tersedia"
                                }, i, false, {
                                    fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                                    lineNumber: 62,
                                    columnNumber: 24
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/SamplingBottomSidebar.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(SamplingBottomSidebar, "UCrWAXs2ORpq2ROkBD7oTNveJOI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"]
    ];
});
_c = SamplingBottomSidebar;
var _c;
__turbopack_context__.k.register(_c, "SamplingBottomSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/map/page-inner.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/app/map/page-inner.tsx
__turbopack_context__.s({
    "default": (()=>MapPageInner)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$HeaderBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/HeaderBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SidebarLeft$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SidebarLeft.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SidebarRight$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SidebarRight.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BottomPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/BottomPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$FeaturePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/panels/FeaturePanel.tsx [app-client] (ecmascript)");
// 2. Perbaiki path import BasemapSwitcher jika diperlukan
//    (jika file dipindah ke folder components/utils/)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$utils$2f$BasemapSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/utils/BasemapSwitcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PanelToggler$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PanelToggler.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SamplingBottomSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SamplingBottomSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ToolContext.tsx [app-client] (ecmascript)"); // 3. Gunakan ToolContext untuk state tools/UI
;
;
var _s = __turbopack_context__.k.signature();
"use client"; // 1. Pastikan ini adalah Client Component
;
;
;
;
;
;
;
;
;
;
;
// 5. HAPUS import SimulasiPanel dan ToponimiFormModal dari sini karena akan dihandle MapComponent
// import SimulasiPanel from "@/components/panels/SimulasiPanel";
// import ToponimiFormModal from "@/components/forms/ToponimiFormModal";
// import type { Tool } from "@/context/ToolContext"; // Tidak digunakan secara langsung di sini
// 6. Impor MapComponent secara dinamis untuk menghindari masalah SSR dengan Leaflet
const MapComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.r("[project]/src/components/map/MapComponent.tsx [app-client] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/map/MapComponent.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = MapComponent;
function MapPageInner() {
    _s();
    const [latlng, setLatLng] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        0,
        0
    ]);
    const [userLocation, setUserLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [basemapType, setBasemapType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("osm");
    const [leftVisible, setLeftVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [bottomVisible, setBottomVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bottomHeight, setBottomHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(300);
    const [rightWidth, setRightWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(384);
    const [showSamplingInfo, setShowSamplingInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 7. Gunakan state dan fungsi dari ToolContext
    const { showSidebarRight, setShowSidebarRight, samplingUpdatedAt, activeTool, setActiveTool } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"])();
    // 8. Gunakan state dan fungsi dari DataContext jika diperlukan di level ini
    // const { features, loading, error } = useData();
    // 9. Efek untuk menampilkan SamplingBottomSidebar saat sampling selesai
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapPageInner.useEffect": ()=>{
            if (samplingUpdatedAt) {
                setShowSamplingInfo(true);
            }
        }
    }["MapPageInner.useEffect"], [
        samplingUpdatedAt
    ]);
    // 10. Efek untuk memperbarui ukuran peta saat panel diubah
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapPageInner.useEffect": ()=>{
            if (mapRef.current) {
                // Timeout kecil untuk memastikan DOM sudah diperbarui
                setTimeout({
                    "MapPageInner.useEffect": ()=>{
                        mapRef.current?.invalidateSize();
                    }
                }["MapPageInner.useEffect"], 300);
            }
        }
    }["MapPageInner.useEffect"], [
        leftVisible,
        showSidebarRight,
        bottomVisible,
        bottomHeight,
        rightWidth
    ]);
    // 11. Fungsi untuk mendapatkan lokasi pengguna
    const handleLocateMe = ()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                const { latitude, longitude } = position.coords;
                setUserLocation([
                    latitude,
                    longitude
                ]);
                // 12. Fokuskan peta ke lokasi pengguna
                mapRef.current?.setView([
                    latitude,
                    longitude
                ], 14);
            }, (error)=>{
                alert("Gagal mendapatkan lokasi: " + error.message);
            });
        } else {
            alert("Geolocation tidak didukung di browser ini.");
        }
    };
    // 13. Fungsi untuk menangani proses echosounder (membuka sidebar kanan)
    //     Fungsi ini dikirim ke FeaturePanel sebagai prop 'onEchosounderProses'.
    //     Namun, karena FeaturePanel sekarang bisa langsung menggunakan useData
    //     dan memanggil setShowSidebarRight, prop ini mungkin tidak terlalu diperlukan lagi.
    //     Tapi kita tetap pertahankan untuk kompatibilitas atau jika ada logika tambahan.
    const handleEchosounderProses = ()=>{
        // 14. Buka sidebar kanan untuk menampilkan hasil echosounder
        //     (Tidak perlu menutup tool, karena FeaturePanel bisa melakukannya sendiri jika perlu)
        // setActiveTool(null); // Opsional, tergantung desain UX
        setShowSidebarRight(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex flex-col h-screen overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$HeaderBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/map/page-inner.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 relative overflow-hidden bg-gray-200",
                children: [
                    leftVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-72 bg-white border-r border-gray-200 z-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SidebarLeft$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/src/app/map/page-inner.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/map/page-inner.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 relative h-full overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 z-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapComponent, {
                                    setLatLng: setLatLng,
                                    basemapType: basemapType,
                                    mapRef: mapRef,
                                    userLocation: userLocation
                                }, void 0, false, {
                                    fileName: "[project]/src/app/map/page-inner.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/map/page-inner.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SamplingBottomSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                visible: showSamplingInfo,
                                onClose: ()=>setShowSamplingInfo(false)
                            }, void 0, false, {
                                fileName: "[project]/src/app/map/page-inner.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-2 left-2 bg-blue-500 text-xs px-3 py-1 rounded shadow text-white z-10",
                                children: [
                                    "Lat: ",
                                    latlng[0].toFixed(5),
                                    ", Lng: ",
                                    latlng[1].toFixed(5)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/map/page-inner.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-32 right-2 z-10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleLocateMe,
                                    className: "bg-blue-600 text-white p-3 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 relative",
                                    title: "Lokasi Saya",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/map/page-inner.tsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative z-10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                className: "h-5 w-5",
                                                viewBox: "0 0 20 20",
                                                fill: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    fillRule: "evenodd",
                                                    d: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z",
                                                    clipRule: "evenodd"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/map/page-inner.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/map/page-inner.tsx",
                                                lineNumber: 134,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/map/page-inner.tsx",
                                            lineNumber: 133,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/map/page-inner.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/map/page-inner.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$utils$2f$BasemapSwitcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onChange: setBasemapType,
                                current: basemapType,
                                defaultPosition: {
                                    x: 1810,
                                    y: 210
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/map/page-inner.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            activeTool === "echosounder" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$FeaturePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                activePanel: "echosounder",
                                close: ()=>setActiveTool(null)
                            }, void 0, false, {
                                fileName: "[project]/src/app/map/page-inner.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PanelToggler$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onToggleLeft: ()=>setLeftVisible(!leftVisible),
                                onToggleRight: ()=>setShowSidebarRight((prev)=>!prev),
                                onToggleBottom: ()=>setBottomVisible(!bottomVisible)
                            }, void 0, false, {
                                fileName: "[project]/src/app/map/page-inner.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/map/page-inner.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    showSidebarRight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onMouseDown: (e)=>{
                                    const startX = e.clientX;
                                    const startWidth = rightWidth;
                                    const handleMouseMove = (moveEvent)=>{
                                        const newWidth = Math.max(240, startWidth - (moveEvent.clientX - startX));
                                        setRightWidth(newWidth);
                                    };
                                    const handleMouseUp = ()=>{
                                        window.removeEventListener("mousemove", handleMouseMove);
                                        window.removeEventListener("mouseup", handleMouseUp);
                                    };
                                    window.addEventListener("mousemove", handleMouseMove);
                                    window.addEventListener("mouseup", handleMouseUp);
                                },
                                className: "w-2 cursor-col-resize bg-gray-300 z-30"
                            }, void 0, false, {
                                fileName: "[project]/src/app/map/page-inner.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white border-l border-gray-200 z-20 h-full overflow-hidden",
                                style: {
                                    width: `${rightWidth}px`
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SidebarRight$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/src/app/map/page-inner.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/map/page-inner.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/map/page-inner.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            bottomVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onMouseDown: (e)=>{
                            const startY = e.clientY;
                            const startHeight = bottomHeight;
                            const handleMouseMove = (moveEvent)=>{
                                const newHeight = Math.max(120, startHeight + (startY - moveEvent.clientY));
                                setBottomHeight(newHeight);
                            };
                            const handleMouseUp = ()=>{
                                window.removeEventListener("mousemove", handleMouseMove);
                                window.removeEventListener("mouseup", handleMouseUp);
                            };
                            window.addEventListener("mousemove", handleMouseMove);
                            window.addEventListener("mouseup", handleMouseUp);
                        },
                        className: "h-2 cursor-row-resize bg-gray-300 z-30"
                    }, void 0, false, {
                        fileName: "[project]/src/app/map/page-inner.tsx",
                        lineNumber: 216,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white border-t border-gray-300 z-20 overflow-hidden",
                        style: {
                            height: `${bottomHeight}px`
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$BottomPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/src/app/map/page-inner.tsx",
                            lineNumber: 237,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/map/page-inner.tsx",
                        lineNumber: 236,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/map/page-inner.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s(MapPageInner, "xRYe5JbtfVab4Rea2qvkvHKI+cM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"]
    ];
});
_c1 = MapPageInner;
var _c, _c1;
__turbopack_context__.k.register(_c, "MapComponent");
__turbopack_context__.k.register(_c1, "MapPageInner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_a086976c._.js.map