import * as Comlink from "comlink";

import * as wasm from 'webnav_analysis'

export type HistoryItem = chrome.history.HistoryItem






// Start of the application: Create the graph of user history and previos load any searches from chrome memory
window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("inputBox").focus()
  // TODO: need to initialize first
	// // TODO: Fix this for when the extension is first launched
  // chrome.storage.sync.get(['filter'], (r) => {
  //   // TODO: FIX
  //   document.getElementById("inputBox").textContent = r.filter

  //   loadSearch()
  // })

})





// -----------------------------------
// Loading the Search in the input box
// -----------------------------------
document.getElementById("inputBox")!.addEventListener("keyup", (ev) => {
  // Navigating previous results through arrow keys
  if (ev.key == "ArrowDown") {
    OutputFocus.start()
    return
  }
  // Normal search functionality
  chrome.storage.sync.get(['filter'], (r) => {
    if (r.filter === getFilterElem().value) return 
    else {
      chrome.storage.sync.set({ "filter": getFilterElem().value })

      loadSearch()
    }
  })
})



async function loadSearch() {

  // Initialize webworker. This should load before anything else
  const worker = new Worker(new URL('./worker.ts', import.meta.url), {
    type: "module"
  })
  const workerAPI = Comlink.wrap<import('./worker').Worker>(worker)
  workerAPI.init(await chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }))

  const filter = getFilterElem().value
  const searchOutput = document.getElementById("searchOutput") as HTMLDivElement


  let response = await workerAPI.search(filter)
  console.log(response)

  searchOutput.innerHTML = ""
  response.forEach(h => {
    searchOutput.appendChild(outputItem(h.history_item.title!, h.history_item.url!))
  })

  console.log("SEARCHED")


  worker.terminate()
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





