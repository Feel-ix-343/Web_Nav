window.onload = function () {
    chrome.storage.sync.get(['filter'], function (r) {
        getFilterElem().value = r.filter;
        loadSearch();
    });
};
document.getElementById("inputBox").addEventListener("keyup", function () {
    chrome.storage.sync.set({ "filter": getFilterElem().value });
    loadSearch();
});
function loadSearch() {
    var filter = getFilterElem().value;
    var searchOutput = document.getElementById("searchOutput");
    var defaultDisplay = document.getElementById("default");
    searchOutput.innerHTML = "";
    if (filter === "") {
        defaultDisplay.hidden = false;
        return;
    }
    defaultDisplay.hidden = true;
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
