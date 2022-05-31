var id = "test";
var time = Date.now();
var lastSyncedTime;
fetch("http://localhost:9000/getLastSynced?id=" + id)
    .then(function (r) { return r.json(); })
    .then(function (d) {
    var lastSynced = parseInt(d);
    sync(lastSynced);
});
function sync(lastSynced) {
    chrome.history.search({ text: "", maxResults: 100000, startTime: lastSynced }).then(function (r) {
        var data = {
            id: id,
            history: r,
            time: Date.now()
        };
        console.log(JSON.stringify(data));
        fetch("http://localhost:9000/syncUser", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(function (r) { return r.json(); })
            .then(function (d) { return console.log(d); });
    });
}
