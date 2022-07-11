import * as wasm from 'webnav_analysis'
// chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }).then(r => {
// 
//   let searchProcess = new wasm.WebAnalyzation(r)
//   // console.log(searchProcess.get_graph())
// 
//   console.log(searchProcess.get_edges("YouTube", "https://www.youtube.com/", 141))
// 
//   let result = searchProcess.get_search_results("American Literature")
// 
//   console.log(result)
// })

// Thread pool initialization with the given number of threads
// (pass `navigator.hardwareConcurrency` if you want to use all cores).
// await initThreadPool(navigator.hardwareConcurrency);

class searchProcessJS {
  private static searchProcessPromise = chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }).then(r => {
    return new wasm.WebAnalyzation(r);
  })

  private static searchProcess: wasm.WebAnalyzation = null;

  static async getSearchProcess() {
    if (searchProcessJS.searchProcess === null) searchProcessJS.searchProcess = await searchProcessJS.searchProcessPromise
    return searchProcessJS.searchProcess
  }
}

chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }).then(r => {
  return new wasm.WebAnalyzation(r);
})



window.addEventListener("DOMContentLoaded", () => {
	// TODO: Fix this for when the extension is first launched
  chrome.storage.sync.get(['filter'], (r) => {
    searchProcessJS.getSearchProcess().then((s) => loadSearch(s))
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
    if (r.filter === getFilterElem().value) return 
    else {
      chrome.storage.sync.set({ "filter": getFilterElem().value })
      searchProcessJS.getSearchProcess().then((s) => loadSearch(s))
    }
  })
})

function loadSearch(searchProcess: wasm.WebAnalyzation): void {
  const filter = getFilterElem().value
  const searchOutput = document.getElementById("searchOutput") as HTMLDivElement

  // TODO: Load the difference instead of reloading everything
  //
  searchOutput.innerHTML = ""

  chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }).then(r => {
    let result = searchProcess.get_search_results(filter)

    result.forEach(h => {
      searchOutput.appendChild(outputItem(h.history_item.title!, h.history_item.url!))
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





