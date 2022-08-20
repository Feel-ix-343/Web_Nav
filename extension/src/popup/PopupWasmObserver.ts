import * as Comlink from 'comlink'


export default class PopupWasmObserver {
  private worker = this.initializeGraph()

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

    await workerAPI.initialize(
      await chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 })
    )

    return workerAPI
  }

  public async initializationSubscription(onInitialization: (worker) => void) {
    let worker = await this.worker
    onInitialization(worker)
  }
}


