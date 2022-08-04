import * as Comlink from 'comlink'
// importScripts("../../../dist/umd/comlink.js");

import * as wasm from 'webnav_analysis'

import {HistoryItem} from './popup'





// Initializing the search process; Only need to do this on the window open: it is only called on the window open
var searchProcess: wasm.WebAnalyzation;

// Should be of chrome.history.HistoryItem


async function init(history: HistoryItem[]) {
  // Set up the wasm with rayon multi threading
  await wasm.default()
  await wasm.initThreadPool(navigator.hardwareConcurrency)

  // TIme this funtion call
  const start = performance.now()
  searchProcess = await wasm.WebAnalyzation.new(history)
  const end = performance.now()
  console.log(`Initialization took ${end - start} milliseconds.`)
}



// TODO: Implement a better identifier
function getEdges(historyItem: HistoryItem) {
  return searchProcess.get_edges(historyItem.title, historyItem.url, historyItem.visitCount) as any[]
}



const worker = {
  init,
  getEdges,
};

export type Worker = typeof worker

Comlink.expose(worker);
