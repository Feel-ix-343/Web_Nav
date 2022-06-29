import * as wasm from 'webnav_analysis'
chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }).then(r => {
  console.log(r)

  wasm.test()
  wasm.test()

  let searchProcess = new wasm.SearchProcess(r)
  console.log(searchProcess.get_graph())

  console.log(searchProcess.get_edges("Courses", "https://barringtonschools.instructure.com/courses"))

  for (let i = 0; i < 10; i++) console.log(searchProcess.get_edges("Courses", "https://barringtonschools.instructure.com/courses"))
})









