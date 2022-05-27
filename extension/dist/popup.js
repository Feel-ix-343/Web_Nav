window.addEventListener("DOMContentLoaded", function () {
    // TODO: Fix this for when the extension is first launched
    chrome.storage.sync.get(['filter'], function (r) {
        getFilterElem().value = r.filter;
        loadSearch();
    });
    document.getElementById("inputBox").focus();
});
// -----------------------------------
// Loading the Search in the input box
// -----------------------------------
document.getElementById("inputBox").addEventListener("keyup", function (ev) {
    if (ev.key == "ArrowDown") {
        OutputFocus.start();
        return;
    }
    chrome.storage.sync.get(['filter'], function (r) {
        console.log("Current val: " + getFilterElem().value);
        console.log(r);
        if (r.filter === getFilterElem().value)
            return;
        else {
            chrome.storage.sync.set({ "filter": getFilterElem().value });
            loadSearch();
        }
    });
});
function loadSearch() {
    var filter = getFilterElem().value;
    var searchOutput = document.getElementById("searchOutput");
    // TODO: Load the difference instead of reloading everything
    //
    searchOutput.innerHTML = "";
    chrome.history.search({ text: filter, maxResults: 100000, startTime: 987532627000 }).then(function (r) {
        r.forEach(function (h) {
            searchOutput.appendChild(outputItem(h.title, h.url));
        });
    });
}
function getFilterElem() {
    return document.getElementById("inputBox");
}
function outputItem(title, url) {
    var outLink = document.createElement("a");
    outLink.target = "_blank";
    outLink.className = "outLink";
    outLink.innerText = title;
    outLink.href = url;
    return outLink;
}
// -------------------
// Key Command Actions
// -------------------
// Used in the input box event listener
var OutputFocus = /** @class */ (function () {
    function OutputFocus() {
    }
    OutputFocus.start = function () {
        document.getElementsByClassName("outLink")[0].focus();
        // Starts listening for events. THere should not be any other event happening after start was called, so this should work
        this.activeOutlink = -1; // FIXME: Confusing; THe window listener gets called when declared. Need to make activeOutLink -1 to counter this
        window.addEventListener("keydown", OutputFocus.eventListener);
    };
    OutputFocus.eventListener = function (ev) {
        if (ev.key == "ArrowDown") {
            ev.preventDefault(); // Preventing default scrolling
            OutputFocus.changeFocus(1);
        }
        else if (ev.key == "ArrowUp") {
            ev.preventDefault(); // Preventing default scrolling
            OutputFocus.changeFocus(-1);
        }
    };
    OutputFocus.changeFocus = function (direction) {
        if (direction === -1) {
            this.activeOutlink += -1;
            if (this.activeOutlink == -1) {
                document.getElementById("inputBox").focus();
                window.removeEventListener("keyup", OutputFocus.eventListener);
                return;
            }
            document.getElementsByClassName("outLink")[this.activeOutlink].focus();
        }
        else if (direction === 1) {
            if (this.activeOutlink == document.getElementsByClassName("outLink").length - 1)
                return;
            this.activeOutlink += 1;
            document.getElementsByClassName("outLink")[this.activeOutlink].focus();
        }
    };
    return OutputFocus;
}());
