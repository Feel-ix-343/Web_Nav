window.onload = () => {
  chrome.storage.sync.get(['filter'], (r) => {
    getFilterElem().value = r.filter
    console.log(getFilterElem().value)
    loadSearch()
  })
}
document.getElementById("inputBox")!.addEventListener("keyup", () => {
  chrome.storage.sync.set({"filter": getFilterElem().value})
  loadSearch()
})

function loadSearch(): void {
  const filter = getFilterElem().value
  const searchOutput = document.getElementById("searchOutput") as HTMLDivElement
  chrome.history.search({ text: filter, maxResults: 100000, startTime: 987532627000 }).then(r => {
    searchOutput.innerHTML = ""
    r.forEach(h => {
      searchOutput.appendChild(outputItem(h.title!, h.url!))
    })
  })
}

function getFilterElem(): HTMLInputElement {
  return document.getElementById("inputBox") as HTMLInputElement
}

function outputItem(title: string, url: string): HTMLAnchorElement {
  const outLink = document.createElement("a") as HTMLAnchorElement
  outLink.target = "_blank"
  outLink.className = "outLink"
  outLink.innerText = title
  outLink.href = url

  return outLink
}
