chrome.history.getVisits({ url: "https://barringtonschools.instructure.com/courses/3278" }).then(function (x) { return console.log(x.length); });
