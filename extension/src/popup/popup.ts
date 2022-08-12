import ChildrenDisplay from './ChildrenDisplay'
import OutLinkFocus from './OutLinkFocus'
import OutLinkItem from './OutLinkItem'



window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("inputBox").focus()

  // Syncing the previous search on extension open
  chrome.storage.sync.get(['filter'], (r) => {
    console.log(r.filter)

    let prevFilter = r.filter
    if (prevFilter) getFilterElem().value = prevFilter;

    loadSearch() // TODO: Fix not loading
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



  // -----------------------------------
  // Loading the Search in the input box
  // -----------------------------------
  async function loadSearch() {
    const filter = getFilterElem().value
    const searchOutput = document.getElementById("searchOutput") as HTMLDivElement


    let response = await chrome.history.search({ text: filter, maxResults: 100, startTime: 987532627000 })
    console.log(response)

    searchOutput.innerHTML = ""
    response.forEach(historyItem => {
      searchOutput.appendChild(OutLinkItem(historyItem, childrenDisplay))
    })

    console.log("SEARCHED")
  }

})





