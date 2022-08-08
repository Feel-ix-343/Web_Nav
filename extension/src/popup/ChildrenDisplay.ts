import * as Comlink from "comlink";
import OutLinkItem from './OutLinkItem'

import {WasmSearchProcessType} from '../WasmWorker'

export default class ChildrenDisplay {

  private worker: Promise<Comlink.Remote<WasmSearchProcessType>>

  constructor() {

    document.getElementById("closeCDButton").addEventListener('click', (ev) => {
      let childrenDisplay = document.getElementById("childrenDisplay")
      childrenDisplay.classList.add("hidden")
    })

    this.worker = this.initializeGraph()


  }

  // Setting up the graph at window open
  private async initializeGraph()  {
    // Initialize webworker. This should load before anything else
    const wasmWorker = new Worker(new URL('../WasmWorker.ts', import.meta.url), {
      type: "module"
    })
    const workerAPI = Comlink.wrap<import('../WasmWorker').Worker>(wasmWorker)

    const wasmSearchProcess = await new workerAPI.WasmSearchProcess(
      await chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 })
    )

    // await workerAPI.init(await chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }))

    return wasmSearchProcess
  }

  // Each outLink has a button that will access this function
  async loadChildren(historyItem: HistoryItem) {
    let edges = await (await this.worker).getEdges(historyItem)

    if (!edges) return

    let childrenDisplay = document.getElementById("childrenDisplay")
    let children = document.getElementById("children")

    let previousOutput = document.querySelectorAll("#children > .outLink")

    // Remove previous output children
    previousOutput.forEach((n) => children.removeChild(n))

    edges.forEach( (h: HistoryItem) => {
      children.appendChild(OutLinkItem(h, this))
    })

    childrenDisplay.classList.remove("hidden")
  }

}



