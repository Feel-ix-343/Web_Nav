import OutLinkItem from './OutLinkItem'

import PopupWasmObserver from ".././PopupWasmObserver";

export default class ChildrenDisplay {

  constructor() {
    document.getElementById("closeCDButton").addEventListener('click', (ev) => {
      let childrenDisplay = document.getElementById("childrenDisplay")
      childrenDisplay.classList.add("hidden")
    })
  }


  // Each outLink has a button that will access this function
  async loadChildren(historyItem: HistoryItem, edges: HistoryItem[], worker: PopupWasmObserver) {
    let childrenDisplay = document.getElementById("childrenDisplay")
    let children = document.getElementById("children")

    let previousOutput = document.querySelectorAll("#children > .outLink")

    // Remove previous output children
    previousOutput.forEach((n) => children.removeChild(n))

    edges.forEach( (h: HistoryItem) => {
      children.appendChild(OutLinkItem(h, this, worker))
    })

    childrenDisplay.classList.remove("hidden")
  }

}



