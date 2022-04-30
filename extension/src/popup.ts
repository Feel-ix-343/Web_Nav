window.onload = () => {
	// TODO Fix this for when the extension is first launched
  chrome.storage.sync.get(['filter'], (r) => {
    getFilterElem().value = r.filter
    loadSearch()
  })

  document.getElementById("inputBox").focus()
}
document.getElementById("inputBox")!.addEventListener("keyup", () => {
  chrome.storage.sync.set({ "filter": getFilterElem().value })
  loadSearch()
})

function loadSearch(): void {
  const filter = getFilterElem().value
  const searchOutput = document.getElementById("searchOutput") as HTMLDivElement
  const defaultDisplay = document.getElementById("default") as HTMLDivElement

  searchOutput.innerHTML = ""

  if (filter === "") {
    defaultDisplay.hidden = false
    return
  }

  defaultDisplay.hidden = true
  chrome.history.search({ text: filter, maxResults: 100000, startTime: 987532627000 }).then(r => {
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
