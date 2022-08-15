import * as Comlink from 'comlink'

import {WasmSearchProcessType} from '../WasmWorker'

export default class PopupWasmObserver {
  private worker: Promise<WasmSearchProcessType>

  constructor () {
    this.worker = this.initializeGraph()
  }

  // Setting up the graph at window open
  private async initializeGraph()  {
    // Initialize webworker. This should load before anything else
    const wasmWorker = new Worker(new URL('../WasmWorker.ts', import.meta.url), {
      type: "module"
    })
    const workerAPI = Comlink.wrap<import('../WasmWorker').Worker>(wasmWorker)

    const wasmSearchProcess = new workerAPI.WasmSearchProcess(
      await chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 })
    )

    // await workerAPI.init(await chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 }))

    return wasmSearchProcess
  }

  public async initializationSubscription(onInitialization: (worker: WasmSearchProcessType) => void) {
    let worker = await this.worker
    onInitialization(worker)
  }
}


