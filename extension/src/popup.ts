import * as wasm from 'webnav_analysis'
chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }).then(r => {

  let searchProcess = new wasm.WebAnalyzation(r)
  // console.log(searchProcess.get_graph())

  console.log(searchProcess.get_edges("YouTube", "https://www.youtube.com/", 141))

  let result = searchProcess.get_search_results("American Literature")

  console.log(result)
})


window.addEventListener("DOMContentLoaded", () => {
	// TODO: Fix this for when the extension is first launched
  chrome.storage.sync.get(['filter'], (r) => {
    getFilterElem().value = r.filter
    loadSearch()
  })

  document.getElementById("inputBox").focus()
})


// -----------------------------------
// Loading the Search in the input box
// -----------------------------------
document.getElementById("inputBox")!.addEventListener("keyup", (ev) => {
  if (ev.key == "ArrowDown") {
    OutputFocus.start()
    return
  }
  chrome.storage.sync.get(['filter'], (r) => {
    console.log("Current val: " + getFilterElem().value)
    console.log(r)
    if (r.filter === getFilterElem().value) return 
    else {
      chrome.storage.sync.set({ "filter": getFilterElem().value })
      loadSearch()
    }
  })
})

function loadSearch(): void {
  const filter = getFilterElem().value
  const searchOutput = document.getElementById("searchOutput") as HTMLDivElement

  // TODO: Load the difference instead of reloading everything
  //
  searchOutput.innerHTML = ""

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

// -------------------
// Key Command Actions
// -------------------

// Used in the input box event listener
class OutputFocus {
  private static activeOutlink: number

  static start(): void {
    (document.getElementsByClassName("outLink")[0] as HTMLAnchorElement).focus()
    // Starts listening for events. THere should not be any other event happening after start was called, so this should work
    this.activeOutlink = -1 // FIXME: Confusing; THe window listener gets called when declared. Need to make activeOutLink -1 to counter this
    window.addEventListener("keydown", OutputFocus.eventListener)
  }
  static eventListener(ev: KeyboardEvent): void {
    if (ev.key == "ArrowDown"){
      ev.preventDefault() // Preventing default scrolling
      OutputFocus.changeFocus(1)
    } else if (ev.key == "ArrowUp") {
      ev.preventDefault() // Preventing default scrolling
      OutputFocus.changeFocus(-1)
    }
  }
  static changeFocus(direction: number): void {
    if (direction === -1) {
      this.activeOutlink += -1;
      if (this.activeOutlink == -1) {
        document.getElementById("inputBox").focus()
        window.removeEventListener("keyup", OutputFocus.eventListener)
        return
      }
      (document.getElementsByClassName("outLink")[this.activeOutlink] as HTMLAnchorElement).focus()
    } else if (direction === 1) {

      if (this.activeOutlink == document.getElementsByClassName("outLink").length - 1) return 

      this.activeOutlink += 1;
      (document.getElementsByClassName("outLink")[this.activeOutlink] as HTMLAnchorElement).focus()
    }
  }
}





