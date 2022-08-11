import * as Comlink from 'comlink'
// importScripts("../../../dist/umd/comlink.js");

import * as wasm from 'webnav_analysis'


class WasmSearchProcess {

  // Initializing the search process; Only need to do this on the window open: it is only called on the window open
  // type is a promise because I do not want anything using this to use it before the this.init() function has been called (and executed sequentially)
  private searchProcess: Promise<wasm.WebAnalyzation>;

  // Singleton class to represent the wasm search process. Search process has mutable, so I wanted make wrap it. 
  constructor(history: HistoryItem[]) {
    this.init(history)
  }

  // I made this into its own function as to make sure that wasm.default, wasm.initThreatPool, and trackWasmInit are executed sequentially
  private async init(history: HistoryItem[]) {
    await wasm.default()
    await wasm.initThreadPool(navigator.hardwareConcurrency)

    this.searchProcess = this.trackWasmInit(history)
  }

  // Times the wasm request and return the wasm object
  private async trackWasmInit(history: HistoryItem[]): Promise<wasm.WebAnalyzation> {
    await wasm.WebAnalyzation.new(history)

    const start = performance.now()
    let testSearchProcess = await wasm.WebAnalyzation.new(history)
    const end = performance.now()
    console.log(`Initialization took ${end - start} milliseconds.`)

    return testSearchProcess
  }


  async getEdges(historyItem: HistoryItem): Promise<HistoryItem[]> {
    return ((await this.searchProcess).get_edges(historyItem.title, historyItem.url, historyItem.visitCount) as any[])?.map((edge) => {
      return {title: edge.title, url: edge.url, visitCount: edge.visit_count} as HistoryItem
    })
  }
}

// Used by some webworker type references
export type WasmSearchProcessType = WasmSearchProcess


const worker = {
  // init,
  // getEdges,
  WasmSearchProcess
};

export type Worker = typeof worker

Comlink.expose(worker);
