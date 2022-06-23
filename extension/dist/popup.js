/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup.ts":
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
/***/ (() => {

eval("window.addEventListener(\"DOMContentLoaded\", function () {\n    chrome.storage.sync.get(['filter'], function (r) {\n        getFilterElem().value = r.filter;\n        loadSearch();\n    });\n    document.getElementById(\"inputBox\").focus();\n});\ndocument.getElementById(\"inputBox\").addEventListener(\"keyup\", function (ev) {\n    if (ev.key == \"ArrowDown\") {\n        OutputFocus.start();\n        return;\n    }\n    chrome.storage.sync.get(['filter'], function (r) {\n        console.log(\"Current val: \" + getFilterElem().value);\n        console.log(r);\n        if (r.filter === getFilterElem().value)\n            return;\n        else {\n            chrome.storage.sync.set({ \"filter\": getFilterElem().value });\n            loadSearch();\n        }\n    });\n});\nfunction loadSearch() {\n    var filter = getFilterElem().value;\n    var searchOutput = document.getElementById(\"searchOutput\");\n    searchOutput.innerHTML = \"\";\n    chrome.history.search({ text: filter, maxResults: 100000, startTime: 987532627000 }).then(function (r) {\n        r.forEach(function (h) {\n            searchOutput.appendChild(outputItem(h.title, h.url));\n        });\n    });\n}\nfunction getFilterElem() {\n    return document.getElementById(\"inputBox\");\n}\nfunction outputItem(title, url) {\n    var outLink = document.createElement(\"a\");\n    outLink.target = \"_blank\";\n    outLink.className = \"outLink\";\n    outLink.innerText = title;\n    outLink.href = url;\n    return outLink;\n}\nvar OutputFocus = (function () {\n    function OutputFocus() {\n    }\n    OutputFocus.start = function () {\n        document.getElementsByClassName(\"outLink\")[0].focus();\n        this.activeOutlink = -1;\n        window.addEventListener(\"keydown\", OutputFocus.eventListener);\n    };\n    OutputFocus.eventListener = function (ev) {\n        if (ev.key == \"ArrowDown\") {\n            ev.preventDefault();\n            OutputFocus.changeFocus(1);\n        }\n        else if (ev.key == \"ArrowUp\") {\n            ev.preventDefault();\n            OutputFocus.changeFocus(-1);\n        }\n    };\n    OutputFocus.changeFocus = function (direction) {\n        if (direction === -1) {\n            this.activeOutlink += -1;\n            if (this.activeOutlink == -1) {\n                document.getElementById(\"inputBox\").focus();\n                window.removeEventListener(\"keyup\", OutputFocus.eventListener);\n                return;\n            }\n            document.getElementsByClassName(\"outLink\")[this.activeOutlink].focus();\n        }\n        else if (direction === 1) {\n            if (this.activeOutlink == document.getElementsByClassName(\"outLink\").length - 1)\n                return;\n            this.activeOutlink += 1;\n            document.getElementsByClassName(\"outLink\")[this.activeOutlink].focus();\n        }\n    };\n    return OutputFocus;\n}());\n\n\n//# sourceURL=webpack://Web-nav_Extension/./src/popup.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/popup.ts"]();
/******/ 	
/******/ })()
;