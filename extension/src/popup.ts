import * as Comlink from "comlink";


export type HistoryItem = chrome.history.HistoryItem




async function initiateGraph() {
  // Initialize webworker. This should load before anything else
  const worker = new Worker(new URL('./worker.ts', import.meta.url), {
    type: "module"
  })
  const workerAPI = Comlink.wrap<import('./worker').Worker>(worker)

  await workerAPI.init(await chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }))

  return workerAPI
}

const worker = initiateGraph()



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

  document.getElementById("closeCButton")!.addEventListener('click', (ev) => {
    let childrenDisplay = document.getElementById("childrenDisplay")
    childrenDisplay.classList.add("hidden")
  })
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



function getFilterElem(): HTMLInputElement {
  return document.getElementById("inputBox") as HTMLInputElement
}

async function loadSearch() {
  const filter = getFilterElem().value
  const searchOutput = document.getElementById("searchOutput") as HTMLDivElement


  let response = await chrome.history.search({ text: filter, maxResults: 100, startTime: 987532627000 })
  console.log(response)

  searchOutput.innerHTML = ""
  response.forEach(h => {
    searchOutput.appendChild(outputItem(h))
  })

  console.log("SEARCHED")

}


function outputItem(historyItem: HistoryItem): HTMLDivElement {
  let title = historyItem.title
  let url = historyItem.url


  const outLink = document.createElement("div") as HTMLDivElement
  // outLink.target = "_blank"
  outLink.className = "outLink"
  outLink.innerText = title
  // outLink.href = url

  let actionContainer = document.createElement("div") as HTMLDivElement
  actionContainer.className = "actionContainer"

  outLink.appendChild(actionContainer)

  let openButton = document.createElement("a") as HTMLAnchorElement
  openButton.className = "button"
  openButton.href = url
  openButton.target = "_blank"
  openButton.textContent = "Open"

  actionContainer.appendChild(openButton)


  worker.then(async (w) => {
    let edges = await w.getEdges(historyItem)

    if (!edges) return

    let edges_history_item = edges.map(e => {
      return {title: e.title, url: e.url, visitCount: e.visit_count} as HistoryItem
    })

    let expandButton = document.createElement('input')
    expandButton.className = "button"
    expandButton.type = "button"
    expandButton.value = "View Children"
    expandButton.onclick = () => {
      let childrenDisplay = document.getElementById("childrenDisplay")
      let children = document.getElementById("children")

      let previousOutput = document.querySelectorAll("#children > .outLink")

      // Remove previous output children
      previousOutput.forEach((n) => children.removeChild(n))

      edges_history_item.forEach(e => {
        children.appendChild(outputItem(e))
      })

      childrenDisplay.classList.remove("hidden")

    }

    actionContainer.appendChild(expandButton)
  })

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





