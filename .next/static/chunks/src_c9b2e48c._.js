(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/layers/GeoJsonLayer.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>GeoJsonLayer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/GeoJSON.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ToolContext.tsx [app-client] (ecmascript)"); // ⬅️ Gunakan context (atau ganti sesuai kebutuhan)
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const buoyIcon = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"]({
    iconUrl: "/icons/buoy.png",
    iconSize: [
        32,
        32
    ],
    iconAnchor: [
        16,
        32
    ],
    popupAnchor: [
        0,
        -32
    ]
});
function GeoJsonLayer({ url, popupField, color = "#ff0000", radius = 5, marker = false }) {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { setGeojsonData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"])(); // ⬅️ Ambil setter dari context
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GeoJsonLayer.useEffect": ()=>{
            fetch(url).then({
                "GeoJsonLayer.useEffect": (res)=>res.json()
            }["GeoJsonLayer.useEffect"]).then({
                "GeoJsonLayer.useEffect": (json)=>{
                    setData(json);
                    setGeojsonData(json); // ⬅️ Simpan ke context
                }
            }["GeoJsonLayer.useEffect"]).catch({
                "GeoJsonLayer.useEffect": (err)=>console.error("Gagal memuat GeoJSON:", err)
            }["GeoJsonLayer.useEffect"]);
        }
    }["GeoJsonLayer.useEffect"], [
        url,
        setGeojsonData
    ]);
    if (!data) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
        data: data,
        pointToLayer: (feature, latlng)=>marker ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marker"])(latlng, {
                icon: buoyIcon
            }).bindPopup(`<strong>${feature.properties[popupField]}</strong>`) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["circleMarker"])(latlng, {
                radius,
                fillColor: color,
                color,
                weight: 1,
                fillOpacity: 0.8
            }).bindPopup(`${popupField}: ${feature.properties[popupField]}`)
    }, void 0, false, {
        fileName: "[project]/src/components/layers/GeoJsonLayer.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(GeoJsonLayer, "l8SDf07vTjGXnssw2jIiccJtTqE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"]
    ];
});
_c = GeoJsonLayer;
var _c;
__turbopack_context__.k.register(_c, "GeoJsonLayer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/forms/ToponimiFormModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/forms/ToponimiFormModal.tsx
__turbopack_context__.s({
    "default": (()=>ToponimiFormModal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ToponimiFormModal({ latlng, onClose, onSubmit, onCancelMarker }) {
    _s();
    const [nama, setNama] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [deskripsi, setDeskripsi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ToponimiFormModal.useEffect": ()=>{
            if (latlng) {
                setNama("");
                setDeskripsi("");
            }
        }
    }["ToponimiFormModal.useEffect"], [
        latlng
    ]);
    if (!latlng) return null;
    const handleSubmit = ()=>{
        if (nama.trim()) {
            onSubmit({
                nama,
                deskripsi
            });
            onClose();
        }
    };
    const handleCancelAndClose = ()=>{
        onCancelMarker(); // hapus marker
        onClose();
    };
    return(// Gunakan z-index yang cukup tinggi, misalnya z-50
    // bg-black bg-opacity-30 membuat latar belakang hitam dengan opacity 30%
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-4 backdrop-blur-[2px]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white bg-opacity-90 rounded-2xl shadow-xl overflow-hidden w-full max-w-md transform transition-all border border-gray-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-white flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-6 w-6",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                        lineNumber: 47,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this),
                                "Tambah Toponimi"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-blue-100 text-xs mt-1",
                            children: [
                                "Koordinat: ",
                                latlng[0].toFixed(5),
                                ", ",
                                latlng[1].toFixed(5)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "nama-lokasi",
                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                    children: "Nama Lokasi"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "nama-lokasi",
                                    type: "text",
                                    value: nama,
                                    onChange: (e)=>setNama(e.target.value),
                                    placeholder: "Masukkan nama lokasi",
                                    className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 placeholder-gray-400 bg-white bg-opacity-80",
                                    onKeyDown: (e)=>{
                                        if (e.key === "Enter") handleSubmit();
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "deskripsi",
                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                    children: "Deskripsi"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    id: "deskripsi",
                                    value: deskripsi,
                                    onChange: (e)=>setDeskripsi(e.target.value),
                                    placeholder: "Deskripsikan lokasi ini...",
                                    rows: 3,
                                    className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 placeholder-gray-400 resize-none bg-white bg-opacity-80"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-50 bg-opacity-70 px-6 py-4 flex justify-between items-center border-t border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCancelAndClose,
                            className: "flex items-center gap-1 text-sm px-4 py-2 rounded-lg bg-red-500 bg-opacity-90 text-white hover:bg-opacity-100 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 shadow hover:shadow-md",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-4 w-4",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this),
                                "Hapus Marker"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "text-sm px-4 py-2 rounded-lg bg-gray-200 bg-opacity-80 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200",
                                    children: "Batal"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSubmit,
                                    disabled: !nama.trim(),
                                    className: `text-sm px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 shadow hover:shadow-md flex items-center gap-1 ${nama.trim() ? "bg-indigo-600 bg-opacity-90 hover:bg-opacity-100 hover:bg-indigo-700" : "bg-gray-400 bg-opacity-50 cursor-not-allowed"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "h-4 w-4",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M5 13l4 4L19 7"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                                lineNumber: 116,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                            lineNumber: 115,
                                            columnNumber: 15
                                        }, this),
                                        "Simpan"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/forms/ToponimiFormModal.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this));
}
_s(ToponimiFormModal, "CjfvZy6WZXEwfwZbwDGtxAS/wOc=");
_c = ToponimiFormModal;
var _c;
__turbopack_context__.k.register(_c, "ToponimiFormModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/panels/SimulasiPanel.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/panels/SimulasiPanel.tsx
__turbopack_context__.s({
    "default": (()=>SimulasiPanel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function SimulasiPanel({ onGenerate, onStartDrawing, isDrawing, hasLine, onDeleteLine, onClosePanel }) {
    _s();
    const [spasi, setSpasi] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(10);
    const [panjang, setPanjang] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(50);
    // Reset nilai saat mulai menggambar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SimulasiPanel.useEffect": ()=>{
            if (isDrawing) {
                setSpasi(10);
                setPanjang(50);
            }
        }
    }["SimulasiPanel.useEffect"], [
        isDrawing
    ]);
    const handleGenerate = ()=>{
        if (!hasLine) {
            alert("Garis sungai belum digambar.");
            return;
        }
        onGenerate(spasi, panjang);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-xl p-5 w-80 border border-gray-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-bold text-gray-800",
                        children: "Simulasi Transek"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClosePanel,
                        className: "text-gray-500 hover:text-red-500 transition-colors duration-200",
                        "aria-label": "Tutup Panel",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-6 w-6",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M6 18L18 6M6 6l12 12"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onStartDrawing,
                disabled: isDrawing,
                className: `w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
          ${isDrawing ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"}`,
                children: isDrawing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "animate-spin -ml-1 mr-2 h-4 w-4 text-current",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    className: "opacity-25",
                                    cx: "12",
                                    cy: "12",
                                    r: "10",
                                    stroke: "currentColor",
                                    strokeWidth: "4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                    lineNumber: 69,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    className: "opacity-75",
                                    fill: "currentColor",
                                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                    lineNumber: 70,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this),
                        "Sedang Menggambar..."
                    ]
                }, void 0, true) : "Gambar Garis Sungai"
            }, void 0, false, {
                fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            hasLine && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 pt-4 border-t border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 mb-4 italic",
                        children: "Atur parameter transek:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                children: "Spasi (meter)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: spasi,
                                        onChange: (e)=>setSpasi(Math.max(1, Number(e.target.value))),
                                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm text-gray-700 placeholder:text-gray-400",
                                        min: "1",
                                        placeholder: "Jarak antar transek"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-500 text-sm",
                                            children: "m"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                            lineNumber: 97,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                children: "Panjang Transek (meter)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: panjang,
                                        onChange: (e)=>setPanjang(Math.max(1, Number(e.target.value))),
                                        className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm text-gray-700 placeholder:text-gray-400",
                                        min: "1",
                                        placeholder: "Panjang setiap transek"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-500 text-sm",
                                            children: "m"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                            lineNumber: 115,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleGenerate,
                                className: "w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5 mr-2",
                                        viewBox: "0 0 20 20",
                                        fill: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z",
                                            clipRule: "evenodd"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                            lineNumber: 127,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, this),
                                    "Generate Transek"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onDeleteLine,
                                className: "w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5 mr-2",
                                        viewBox: "0 0 20 20",
                                        fill: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M9 2a1 1 0 00-.894.553L3.14 13.142a3 3 0 000 4.243l1.269 1.269c1.071 1.07 2.634 1.07 3.707 0l1.269-1.269a3 3 0 000-4.243L9.894.553A1 1 0 009 2zm-.436 9.8l2.16 2.16a.5.5 0 00.708-.707l-2.16-2.16a.5.5 0 00-.707 0z",
                                            clipRule: "evenodd"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                            lineNumber: 138,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this),
                                    "Hapus Garis"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
                lineNumber: 81,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/panels/SimulasiPanel.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(SimulasiPanel, "wbcYp1ZreUdazm9frB5zB4zqbm4=");
_c = SimulasiPanel;
var _c;
__turbopack_context__.k.register(_c, "SimulasiPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/geotools/generateTransek.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// === IMPORTS ===
__turbopack_context__.s({
    "generateTransek": (()=>generateTransek)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$length$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turf/length/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$along$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turf/along/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$bearing$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turf/bearing/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$destination$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turf/destination/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$helpers$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@turf/helpers/dist/esm/index.js [app-client] (ecmascript)");
;
function generateTransek(riverLine, // Hapus polygonFeature dari parameter karena tidak digunakan untuk generate
spasi, panjang, useAutoBuffer = false // Tetap terima, tapi abaikan untuk clipping
) {
    const allTransects = [];
    const samplingPoints = [];
    console.log("🚀 Memulai generateRawTransects (tanpa clipping)");
    console.log("PropertyParams:", {
        spasi,
        panjang,
        useAutoBuffer
    }); // Log tetap ada
    // --- VALIDASI INPUT DASAR ---
    if (!riverLine) {
        console.warn("❌ Input tidak valid: riverLine kosong");
        return null;
    }
    if (riverLine.geometry?.type !== "LineString") {
        console.error("❌ riverLine bukan LineString:", riverLine.geometry?.type);
        return null;
    }
    // --- HITUNG PANJANG SUNGAI & JUMLAH TRANSEK ---
    const totalLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$length$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["length"])(riverLine, {
        units: "meters"
    });
    const steps = Math.floor(totalLength / spasi);
    console.log(`📏 Total panjang sungai: ${totalLength.toFixed(2)} meter`);
    console.log(`🎯 Jumlah transek yang akan dibuat: ${steps + 1} (spasi: ${spasi}m)`);
    // --- LOOP UNTUK SETIAP TRANSEK ---
    for(let i = 0; i <= steps; i++){
        const dist = i * spasi;
        let center, prev, next;
        try {
            center = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$along$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["along"])(riverLine, dist, {
                units: "meters"
            });
        } catch (e) {
            console.warn(`❌ Gagal ambil titik center pada jarak ${dist}m`, e?.message);
            continue;
        }
        // --- OFFSET DINAMIS UNTUK PERHITUNGAN BEARING ---
        const offset = Math.max(1, Math.min(spasi / 2, 5)); // Antara 1m sampai 5m
        try {
            // Hindari jarak 0 untuk prev
            prev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$along$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["along"])(riverLine, Math.max(dist - offset, 0.001), {
                units: "meters"
            });
            // Hindari melebihi panjang total untuk next
            next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$along$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["along"])(riverLine, Math.min(dist + offset, totalLength), {
                units: "meters"
            });
        } catch (e) {
            console.warn(`❌ Gagal ambil titik prev/next di dist=${dist}`, e?.message);
            continue;
        }
        const bearing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$bearing$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bearing"])(prev, next);
        const normalBearing = bearing + 90;
        const normalizedNormalBearing = (normalBearing % 360 + 360) % 360;
        // --- GENERATE TRANSEK TEGAK LURUS ---
        const p1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$destination$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["destination"])(center, panjang / 2, normalizedNormalBearing, {
            units: "meters"
        });
        const p2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$destination$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["destination"])(center, panjang / 2, normalizedNormalBearing + 180, {
            units: "meters"
        });
        const transect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$helpers$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lineString"])([
            p1.geometry.coordinates,
            p2.geometry.coordinates
        ]);
        // --- TAMBAHKAN ID DAN INFO ---
        const id = `TR_RAW-${String(i + 1).padStart(3, "0")}`;
        const transectWithProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$turf$2f$helpers$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lineString"])(transect.geometry.coordinates, {
            id,
            index: i,
            distanceFromStart: parseFloat(dist.toFixed(2)),
            bearing: parseFloat(bearing.toFixed(2)),
            normalBearing: parseFloat(normalizedNormalBearing.toFixed(2)),
            center: center.geometry.coordinates,
            color: "#0000FF",
            // Tambahkan panjang teoritis transek
            theoreticalLength: panjang
        });
        allTransects.push(transectWithProps);
        // --- TAMBAHKAN SAMPLING POINT (CENTER) ---
        samplingPoints.push({
            type: "Feature",
            geometry: center.geometry,
            properties: {
                transectId: id,
                index: i,
                distanceFromStart: parseFloat(dist.toFixed(2)),
                color: "#FF0000"
            }
        });
        console.log(`🏗️  Transek mentah dibuat: ${id} (dist: ${dist.toFixed(2)}m)`);
    }
    // --- SIAPKAN OUTPUT ---
    const metadata = {
        totalLength,
        spasi,
        panjang,
        jumlahTransek: allTransects.length,
        timestamp: new Date().toISOString(),
        useAutoBuffer
    };
    console.log(`\n✅=== GENERATE TRANSEK MENTAH SELESAI ===✅`);
    console.log(`📊 Jumlah transek mentah: ${allTransects.length}`);
    console.log(`📊 Jumlah sampling points: ${samplingPoints.length}`);
    // --- INSTRUKSI VISUALISASI ---
    console.log("%c📋 SALIN DATA DI BAWAH KE https://geojson.io   ", "color: blue; font-weight: bold");
    console.log("👉 River Line:", JSON.stringify(riverLine));
    console.log("👉 Semua Transek Mentah:", JSON.stringify({
        type: "FeatureCollection",
        features: allTransects
    }));
    console.log("👉 Semua Sampling Points:", JSON.stringify({
        type: "FeatureCollection",
        features: samplingPoints
    }));
    console.log("✅ Selesai. Salin salah satu untuk lihat di peta.");
    return {
        allTransects,
        samplingPoints,
        metadata,
        riverLine
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/map/MapComponent.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/components/map/MapComponent.tsx
__turbopack_context__.s({
    "default": (()=>MapComponent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$ZoomControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/ZoomControl.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Marker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/GeoJSON.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Polyline.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layers$2f$GeoJsonLayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layers/GeoJsonLayer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ToolContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$forms$2f$ToponimiFormModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/forms/ToponimiFormModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$SimulasiPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/panels/SimulasiPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$geotools$2f$generateTransek$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/geotools/generateTransek.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
const buoyIcon = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"]({
    iconUrl: "/Pin.svg",
    iconSize: [
        32,
        32
    ],
    iconAnchor: [
        16,
        32
    ],
    popupAnchor: [
        0,
        -32
    ]
});
const userIcon = buoyIcon;
const startIcon = buoyIcon;
const endIcon = buoyIcon;
function MapRefSetter({ mapRef }) {
    _s();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapRefSetter.useEffect": ()=>{
            mapRef.current = map;
        }
    }["MapRefSetter.useEffect"], [
        map,
        mapRef
    ]);
    return null;
}
_s(MapRefSetter, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c = MapRefSetter;
function UserLocationMarker({ location }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
        position: location,
        icon: userIcon,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
            children: "📍 Kamu di sini"
        }, void 0, false, {
            fileName: "[project]/src/components/map/MapComponent.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/map/MapComponent.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c1 = UserLocationMarker;
function MapComponent({ setLatLng, basemapType, mapRef, userLocation }) {
    _s1();
    var _s = __turbopack_context__.k.signature();
    const tileLayers = {
        osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        terrain: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
    };
    const tileUrl = tileLayers[basemapType] || tileLayers["osm"];
    const [centerline, setCenterline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // --- STATE UNTUK TRANSEK DAN SAMPLING POINT (LOKAL) ---
    // State ini dikelola secara lokal karena hasil dari logika spesifik komponen ini.
    const [allTransects, setAllTransects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [samplingPoints, setSamplingPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const { activeTool, setActiveTool, formLatLng, setFormLatLng, showToponimiForm, setShowToponimiForm, routePoints, setRoutePoints, // --- STATE DARI TOOLCONTEXT ---
    // Hanya gunakan state tools/UI dari context.
    // State hasil perhitungan seperti samplingPoints di context diabaikan.
    layers } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"])();
    // --- STATE UNTUK DRAWLINE TOOL (LOKAL) ---
    // State ini tetap dikelola secara lokal karena spesifik untuk interaksi menggambar di komponen ini.
    const [drawnLine, setDrawnLine] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const isDrawing = activeTool === "drawline";
    const hasLine = drawnLine.length > 0;
    const addPointToDrawnLine = (latlng)=>{
        setDrawnLine((prev)=>[
                ...prev,
                latlng
            ]);
    };
    // --- FUNGSI UNTUK MENGHAPUS GARIS DAN RESET STATE TRANSEK LOKAL ---
    const clearDrawnLine = ()=>{
        setDrawnLine([]);
        // Reset state hasil generateTransek yang dikelola secara lokal
        setAllTransects([]);
        setSamplingPoints([]);
    // JANGAN panggil setActiveTool(null) di sini jika hanya ingin hapus garis
    // setActiveTool(null);
    // Fungsi ini sekarang hanya untuk membersihkan garis dan hasil generate lokal.
    };
    // --- FUNGSI UNTUK MENGHASILKAN TRANSEK MENTAH ---
    const handleGenerateTransek = (spasi, panjang)=>{
        console.log("handleGenerateTransek dipanggil dengan:", {
            spasi,
            panjang
        });
        if (!drawnLine || drawnLine.length < 2) {
            alert("Garis sungai belum digambar.");
            return;
        }
        // Buat Feature<LineString> dari drawnLine
        const lineCoords = drawnLine.map((latlng)=>[
                latlng.lng,
                latlng.lat
            ]);
        const riverLine = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: lineCoords
            },
            properties: {}
        };
        try {
            // Signature: generateTransek(riverLine, spasi, panjang, useAutoBuffer)
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$geotools$2f$generateTransek$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateTransek"])(riverLine, spasi, panjang, true); // useAutoBuffer = true
            if (result) {
                // Simpan hasil ke state lokal komponen
                setAllTransects(result.allTransects);
                setSamplingPoints(result.samplingPoints);
                console.log("Hasil generateTransek (mentah):", result);
            // Tetap di mode simulasi untuk menampilkan hasil
            } else {
                alert("Gagal menghasilkan transek. Silakan cek console untuk detail.");
                console.error("generateTransek mengembalikan null/undefined");
            }
        } catch (error) {
            console.error("Error saat memanggil generateTransek:", error);
            alert("Terjadi kesalahan saat menghasilkan transek.");
        }
    };
    // --- FUNGSI UNTUK MEMULAI MENGgambar GARIS ---
    const handleStartDrawing = ()=>{
        setDrawnLine([]);
        // Reset state hasil sebelumnya saat mulai menggambar baru
        setAllTransects([]);
        setSamplingPoints([]);
        setActiveTool("drawline");
    };
    const MapEvents = ()=>{
        _s();
        const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMapEvents"])({
            mousemove (e) {
                setLatLng([
                    e.latlng.lat,
                    e.latlng.lng
                ]);
            },
            click (e) {
                if (activeTool === "toponimi") {
                    setFormLatLng(e.latlng);
                    setShowToponimiForm(true);
                } else if (activeTool === "rute") {
                    if (routePoints.length < 2) {
                        const newPoints = [
                            ...routePoints,
                            e.latlng
                        ];
                        setRoutePoints(newPoints);
                        if (mapRef.current) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marker"])(e.latlng, {
                                icon: newPoints.length === 1 ? startIcon : endIcon
                            }).addTo(mapRef.current).bindPopup(newPoints.length === 1 ? "Titik Awal" : "Titik Akhir").openPopup();
                        }
                    }
                } else if (activeTool === "drawline") {
                    addPointToDrawnLine(e.latlng);
                }
            },
            contextmenu () {
                if (activeTool === "drawline" && drawnLine.length > 1) {
                    alert("Garis selesai digambar.");
                // Opsional: Otomatis hentikan drawing setelah selesai?
                // setActiveTool(null);
                }
            }
        });
        return null;
    };
    _s(MapEvents, "tmcOhplWkk/SgX5HNxHxB5dt97g=", false, function() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMapEvents"]
        ];
    });
    const handleAddToponimi = ({ nama, deskripsi })=>{
        if (!formLatLng || !mapRef.current) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marker"])(formLatLng, {
            icon: buoyIcon
        }).addTo(mapRef.current).bindPopup(`<strong>${nama}</strong><br/>${deskripsi}`);
        setFormLatLng(null);
        setShowToponimiForm(false);
    };
    const handleCancelMarker = ()=>{
        setFormLatLng(null);
        setShowToponimiForm(false);
    };
    // --- FETCH DATA STATIC (CENTERLINE) ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            fetch("/data/centerline.geojson").then({
                "MapComponent.useEffect": (res)=>res.json()
            }["MapComponent.useEffect"]).then({
                "MapComponent.useEffect": (data)=>{
                    setCenterline(data);
                }
            }["MapComponent.useEffect"]).catch({
                "MapComponent.useEffect": (err)=>console.error("Error fetching centerline:", err)
            }["MapComponent.useEffect"]);
        }
    }["MapComponent.useEffect"], []);
    // --- FETCH DATA POLYGON SUNGAI (DIKOMENTARI) ---
    // Komentari atau hapus fetch riverPolygons karena tidak digunakan lagi
    // untuk clipping di tahap generate
    /*
  useEffect(() => {
    fetch("/data/sungai.geojson")
      .then((res) => res.json())
      .then((data) => {
        // Logika pemrosesan polygon jika diperlukan untuk layer tampilan
        // atau untuk proses clipping terpisah nanti
      })
      .catch((err) => console.error("Error fetching river polygons:", err));
  }, [mapRef]);
  */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: [
                    -2.98,
                    104.76
                ],
                zoom: 13,
                zoomControl: false,
                style: {
                    height: "100%",
                    width: "100%"
                },
                className: "z-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                        attribution: "© contributors",
                        url: tileUrl
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapComponent.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$ZoomControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZoomControl"], {
                        position: "bottomright"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapComponent.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapEvents, {}, void 0, false, {
                        fileName: "[project]/src/components/map/MapComponent.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapRefSetter, {
                        mapRef: mapRef
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapComponent.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this),
                    userLocation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserLocationMarker, {
                        location: userLocation
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapComponent.tsx",
                        lineNumber: 227,
                        columnNumber: 26
                    }, this),
                    centerline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
                        data: centerline,
                        style: {
                            color: "blue",
                            weight: 3
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapComponent.tsx",
                        lineNumber: 228,
                        columnNumber: 24
                    }, this),
                    drawnLine.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Polyline"], {
                        positions: drawnLine,
                        color: "red",
                        weight: 4
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapComponent.tsx",
                        lineNumber: 231,
                        columnNumber: 34
                    }, this),
                    allTransects.map((transek)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$GeoJSON$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GeoJSON"], {
                            data: transek,
                            style: {
                                color: transek.properties?.color || "blue",
                                weight: 2
                            },
                            eventHandlers: {
                                click: ()=>{
                                    alert(`ID: ${transek.properties?.id}\n` + `Jarak: ${transek.properties?.distanceFromStart}m\n` + `Bearing: ${transek.properties?.bearing}\n` + `Panjang Teoritis: ${transek.properties?.theoreticalLength}m`);
                                }
                            }
                        }, transek.properties?.id || transek.properties?.index, false, {
                            fileName: "[project]/src/components/map/MapComponent.tsx",
                            lineNumber: 235,
                            columnNumber: 11
                        }, this)),
                    samplingPoints.map((pt, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
                            position: [
                                pt.geometry.coordinates[1],
                                pt.geometry.coordinates[0]
                            ],
                            icon: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["divIcon"])({
                                className: "sampling-icon",
                                html: `<div style="background:${pt.properties?.color || "#16a34a"};width:8px;height:8px;border-radius:50%;"></div>`
                            }),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                                children: [
                                    "Sampling Point ",
                                    pt.properties?.transectId || pt.properties?.index,
                                    " (Dist: ",
                                    pt.properties?.distanceFromStart,
                                    "m)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/map/MapComponent.tsx",
                                lineNumber: 260,
                                columnNumber: 13
                            }, this)
                        }, `sampling-${i}`, false, {
                            fileName: "[project]/src/components/map/MapComponent.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this)),
                    layers.batimetri && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layers$2f$GeoJsonLayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        url: "/data/toponimi.geojson",
                        popupField: "kedalaman",
                        color: "#9333ea",
                        radius: 6
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapComponent.tsx",
                        lineNumber: 267,
                        columnNumber: 30
                    }, this),
                    layers.toponimi && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layers$2f$GeoJsonLayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        url: "/data/toponimi.geojson",
                        popupField: "kedalaman",
                        marker: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapComponent.tsx",
                        lineNumber: 268,
                        columnNumber: 29
                    }, this),
                    layers.sungai && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layers$2f$GeoJsonLayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        url: "/data/sungai.geojson",
                        popupField: "nama",
                        color: "#0284c7"
                    }, void 0, false, {
                        fileName: "[project]/src/components/map/MapComponent.tsx",
                        lineNumber: 269,
                        columnNumber: 27
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/map/MapComponent.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this),
            showToponimiForm && formLatLng && activeTool !== "simulasi" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$forms$2f$ToponimiFormModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                latlng: [
                    formLatLng.lat,
                    formLatLng.lng
                ],
                onClose: ()=>setShowToponimiForm(false),
                onSubmit: handleAddToponimi,
                onCancelMarker: handleCancelMarker
            }, void 0, false, {
                fileName: "[project]/src/components/map/MapComponent.tsx",
                lineNumber: 274,
                columnNumber: 9
            }, this),
            (activeTool === "simulasi" || isDrawing) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$panels$2f$SimulasiPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onGenerate: handleGenerateTransek,
                onStartDrawing: handleStartDrawing,
                isDrawing: isDrawing,
                hasLine: hasLine,
                // --- PROPS UNTUK KONTROL TAMBAHAN ---
                onDeleteLine: clearDrawnLine,
                onClosePanel: ()=>{
                    // Logika tutup panel: keluar dari mode (ini yang menutup panel)
                    setActiveTool(null);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/map/MapComponent.tsx",
                lineNumber: 281,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s1(MapComponent, "83MsixWgDPk5VOGYJOWuI8vI5nw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ToolContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTool"]
    ];
});
_c2 = MapComponent;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "MapRefSetter");
__turbopack_context__.k.register(_c1, "UserLocationMarker");
__turbopack_context__.k.register(_c2, "MapComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/map/MapComponent.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/map/MapComponent.tsx [app-client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=src_c9b2e48c._.js.map