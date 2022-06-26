import * as wasm from 'webnav_analysis'
chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }).then(r => wasm.get(r))







