import * as Comlink from 'comlink'
// importScripts("../../../dist/umd/comlink.js");

import * as wasm from 'webnav_analysis'

import {HistoryItem} from './popup'

// Set up the wasm with rayon multi threading
await wasm.default()
await wasm.initThreadPool(navigator.hardwareConcurrency)




// Initializing the search process; Only need to do this on the window open: it is only called on the window open
var searchProcess: wasm.WebAnalyzation= null

// Should be of chrome.history.HistoryItem


async function init(history: HistoryItem[]) {
  searchProcess = new wasm.WebAnalyzation(history)
}



async function search(filter: string) {
  console.log("Searching")
  // Time this function call
  const start = performance.now()
  const result = searchProcess.get_search_results(filter)
  const end = performance.now()
  console.log(`Search took ${end - start} milliseconds.`)
  return result as any[]
}

// TODO: Implement a better identifier
async function getEdges(title: string, url: string, visitCount: number){
  return searchProcess.get_edges(title, url, visitCount)
}

const worker = {
  init,
  search,
  getEdges
};

export type Worker = typeof worker

Comlink.expose(worker);
