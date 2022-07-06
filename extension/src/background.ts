import * as wasm from 'webnav_analysis'
chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }).then(r => {

  let searchProcess = new wasm.WebAnalyzation(r)
  // console.log(searchProcess.get_graph())

  console.log(searchProcess.get_edges("YouTube", "https://www.youtube.com/", 141))
  console.log(searchProcess.get_edges("YouTube", "https://www.youtube.com/", 141))
  console.log(searchProcess.get_edges("YouTube", "https://www.youtube.com/", 141))
  console.log(searchProcess.get_edges("YouTube", "https://www.youtube.com/", 141))
  console.log(searchProcess.get_edges("YouTube", "https://www.youtube.com/", 141))
  console.log(searchProcess.get_edges("YouTube", "https://www.youtube.com/", 141))
  console.log(searchProcess.get_edges("YouTube", "https://www.youtube.com/", 141))

})









