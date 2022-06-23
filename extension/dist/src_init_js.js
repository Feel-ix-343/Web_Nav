"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkWeb_nav_Extension"] = self["webpackChunkWeb_nav_Extension"] || []).push([["src_init_js"],{

/***/ "./src/init.js":
/*!*********************!*\
  !*** ./src/init.js ***!
  \*********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _webnav_analysis_pkg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../webnav_analysis/pkg */ \"../webnav_analysis/pkg/webnav_analysis_bg.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_webnav_analysis_pkg__WEBPACK_IMPORTED_MODULE_0__]);\n_webnav_analysis_pkg__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nlet result = _webnav_analysis_pkg__WEBPACK_IMPORTED_MODULE_0__.add(1, 2)\n\nconsole.log(result)\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://Web-nav_Extension/./src/init.js?");

/***/ }),

/***/ "../webnav_analysis/pkg/webnav_analysis_bg.js":
/*!****************************************************!*\
  !*** ../webnav_analysis/pkg/webnav_analysis_bg.js ***!
  \****************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"add\": () => (/* binding */ add)\n/* harmony export */ });\n/* harmony import */ var _webnav_analysis_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./webnav_analysis_bg.wasm */ \"../webnav_analysis/pkg/webnav_analysis_bg.wasm\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_webnav_analysis_bg_wasm__WEBPACK_IMPORTED_MODULE_0__]);\n_webnav_analysis_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n/**\n* @param {number} x\n* @param {number} y\n* @returns {number}\n*/\nfunction add(x, y) {\n    const ret = _webnav_analysis_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.add(x, y);\n    return ret;\n}\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://Web-nav_Extension/../webnav_analysis/pkg/webnav_analysis_bg.js?");

/***/ }),

/***/ "../webnav_analysis/pkg/webnav_analysis_bg.wasm":
/*!******************************************************!*\
  !*** ../webnav_analysis/pkg/webnav_analysis_bg.wasm ***!
  \******************************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.v(exports, module.id, \"cd47dbaf0947c38ca293\");\n\n//# sourceURL=webpack://Web-nav_Extension/../webnav_analysis/pkg/webnav_analysis_bg.wasm?");

/***/ })

}]);