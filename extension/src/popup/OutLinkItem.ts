import ChildrenDisplay from './ChildrenDisplay'
import PopupWasmObserver from './PopupWasmObserver'

export default function outLinkItem(historyItem: HistoryItem, childrenDisplay: ChildrenDisplay, wasmObserver: PopupWasmObserver): HTMLDivElement {
  let title = historyItem.title
  let url = historyItem.url


  // Creating the linking div; Will have the title, link, and possibly link to the children
  const outLink = document.createElement("div") as HTMLDivElement
  outLink.className = "outLink"
  outLink.innerText = title
  // Allowing the div to be focusable
  outLink.tabIndex = -1

  // The collection of buttons for each outlink item
  let actionButtonContainer = document.createElement("div") as HTMLDivElement
  actionButtonContainer.className = "actionContainer"
  outLink.appendChild(actionButtonContainer)

  // BUtton to open the link from the outlink
  let openButton = document.createElement("a") as HTMLAnchorElement
  openButton.className = "button"
  openButton.href = url
  openButton.target = "_blank"
  openButton.textContent = "Open"
  actionButtonContainer.appendChild(openButton)

  // While waiting for the graph to initialize, return the button. But, when it is initialized, add [below] to the button
  wasmObserver.initializationSubscription(async (worker) => {
    let edges = await worker.getEdges(historyItem)

    if (!edges) return;

    // The button to view the outLinks children in a new pane below (Children Display uses Rust Wasm)
    let expandButton = document.createElement('input')
    expandButton.className = "button"
    expandButton.type = "button"
    // TODO: Change naming
    expandButton.value = "View Children"
    expandButton.onclick = () => childrenDisplay.loadChildren(historyItem, edges, wasmObserver)
    actionButtonContainer.appendChild(expandButton)
  })

  return outLink
}

