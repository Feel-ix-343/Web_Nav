import ChildrenDisplay from './ChildrenDisplay'
import OutLinkFocus from './OutLinkFocus'
import OutLinkItem from './OutLinkItem'
import PopupWasmObserver from './PopupWasmObserver'



window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("inputBox").focus()

  // Syncing the previous search on extension open
  chrome.storage.sync.get(['filter'], (r) => {
    let prevFilter = r.filter
    if (prevFilter) getFilterElem().value = prevFilter;

    loadSearch()
  })


  function getFilterElem(): HTMLInputElement {
    return document.getElementById("inputBox") as HTMLInputElement
  }

  // Adding search functionality
  document.getElementById("inputBox").addEventListener("keyup", (ev) => {
    // Navigating previous results through arrow keys
    if (ev.key == "ArrowDown") {
      OutLinkFocus()
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



  const childrenDisplay = new ChildrenDisplay()
  const wasmObserver = new PopupWasmObserver()


  // -----------------------------------
  // Loading the Search in the input box
  // -----------------------------------
  async function loadSearch() {
    const filter = getFilterElem().value
    const searchOutput = document.getElementById("searchOutput") as HTMLDivElement


    let response = await chrome.history.search({ text: filter, maxResults: 100, startTime: 987532627000 })

    searchOutput.innerHTML = ""
    response.forEach(historyItem => {
      searchOutput.appendChild(OutLinkItem(historyItem, childrenDisplay, wasmObserver))
    })

  }

})





