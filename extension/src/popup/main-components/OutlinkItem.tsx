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


  const viewSublinksButton = historyItemSublinks ?
    (
      <input 
        className="button"
        type="button"
        onClick={() => props.sublinkNeeds.sublinkViewer(historyItemSublinks)}
        value="View Sublinks" />
    ) : null

  return (
    <div className='outLink' tabIndex={-1}>
      {props.historyItem.title}
      <div className='actionContainer'>
        <a className='button' href={props.historyItem.url} target="_blank">Open</a>
        {viewSublinksButton}
      </div>
    </div>
  )

}

export default OutLinkItem

