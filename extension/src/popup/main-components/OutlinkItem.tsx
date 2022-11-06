import PopupWasmObserver from "../PopupWasmObserver"
import React, { useState, useEffect } from 'react'
import { HistoryItemSublinkView, HistoryItemSublinkViewer } from "../popup"


export interface OutlinkSublinkNeeds {
  wasmObserver: PopupWasmObserver,
  sublinkViewer: HistoryItemSublinkViewer
}

interface OutlinkProps {
  historyItem: HistoryItem,
  sublinkNeeds: OutlinkSublinkNeeds
}

const OutLinkItem = (props: OutlinkProps) => {
  const [historyItemSublinks, setHistoryItemSublinks] = useState<HistoryItemSublinkView>(null)

  const loadHistoryItemChildren = () => {
    props.sublinkNeeds.wasmObserver.initializationSubscription((worker) => {
      worker.getEdges(props.historyItem).then(edges => {
        if (edges == undefined) return
        setHistoryItemSublinks({historyItem: props.historyItem, sublinks: edges})
      })
    })
  }

  useEffect(() => {
    loadHistoryItemChildren()
  }, [])


  const viewSublinksButton = 
    <input 
      className={`button ${historyItemSublinks == null ? "hidden" : ""}`}
      type="button"
      onClick={() => props.sublinkNeeds.sublinkViewer(historyItemSublinks)}
      value="View Sublinks"
    />

  const shortenTitle = (title: string) => {
    let titleMaxlength = 80
    if (title.length > titleMaxlength) {
      return title.slice(0, titleMaxlength) + "..."
    } else {
      return title
    }
  }

  const urlPreview = (url: string) => {
    let urlMaxlength = 40
    if (url.length > urlMaxlength) {
      return url.slice(0, urlMaxlength) + "..."
    } else {
      return url
    }
  }

  return (
    <div className='outLink' tabIndex={-1}>
      {shortenTitle(props.historyItem.title)} | {urlPreview(props.historyItem.url)}
      <div className='actionContainer'>
        <a className='button' href={props.historyItem.url} target="_blank">Open</a>
        {viewSublinksButton}
      </div>
    </div>
  )

}

export default OutLinkItem

