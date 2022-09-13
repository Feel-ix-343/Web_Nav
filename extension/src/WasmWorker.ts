import * as Comlink from 'comlink'
// importScripts("../../../dist/umd/comlink.js");

import * as wasm from 'webnav_analysis'



let searchProcess: wasm.WebAnalyzation
let initializationTime: number

async function getInitialiationTime() {
  return initializationTime
}

// I made this into its own function as to make sure that wasm.default, and trackWasmInit are executed sequentially
async function initialize(history: HistoryItem[]) {
  await wasm.default()

  let r = await trackWasmInit(history)
  searchProcess = r.searchProcess
  initializationTime = r.initializationTime
  console.log(initializationTime);
}


// Time the wasm request and return the wasm object
async function trackWasmInit(history: HistoryItem[]) {
  const start = performance.now()
  let testSearchProcess = new wasm.WebAnalyzation(history);
  const end = performance.now()
  console.log(`Initialization took ${end - start} milliseconds.`)

  return { searchProcess: testSearchProcess, initializationTime: end - start }
}


async function getEdges(historyItem: HistoryItem): Promise<HistoryItem[]> {
  let edges = searchProcess.get_edges(historyItem.title, historyItem.url, historyItem.visitCount) as any[]

  let edgesHistoryItems = edges?.map(edge => {
    return {title: edge.title, url: edge.url, visitCount: edge.visit_count} as HistoryItem
  })

  return edgesHistoryItems
}


const worker = {
  initialize,
  getEdges,
  getInitialiationTime
};

export type Worker = typeof worker

Comlink.expose(worker);
