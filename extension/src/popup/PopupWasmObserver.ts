import * as Comlink from 'comlink'


export default class PopupWasmObserver {
  private wasmWorker = new Worker(new URL('../WasmWorker.ts', import.meta.url), {
    type: "module"
  })
  private workerAPI = Comlink.wrap<import('../WasmWorker').Worker>(this.wasmWorker)
  
  private worker: Promise<typeof this.workerAPI>

  constructor () {
    this.worker = this.initializeGraph()
  }

  // Setting up the graph at window open
  private async initializeGraph()  {
    // Initialize webworker. This should load before anything else

    await this.workerAPI.initialize(
      await chrome.history.search({ text: "", maxResults: 100000, startTime: 987532627000 })
    )

    return this.workerAPI
  }

  public async initializationSubscription(onInitialization: (worker: typeof this.workerAPI) => void) {
    let worker = await this.worker
    onInitialization(worker)
  }
}


