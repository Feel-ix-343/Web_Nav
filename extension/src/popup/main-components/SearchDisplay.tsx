import React from 'react'
import { HistoryItemSublinkViewer } from '../popup'
import PopupWasmObserver from '../PopupWasmObserver'
import OutlinkItem from './OutlinkItem'

interface SearchDisplayProps{
  displayItems: HistoryItem[],

  wasmObserver: PopupWasmObserver,
  sublinkViewer: HistoryItemSublinkViewer
}


const SearchDisplay = (props: SearchDisplayProps) => {

  let outLinkItems = props.displayItems.map(historyItem => <OutlinkItem key={historyItem.id} historyItem={historyItem} wasmObserver={props.wasmObserver} sublinkViewer={props.sublinkViewer}/>)
  
  return(
    <div id='data'>
      {outLinkItems}
    </div>
  )
}

export default SearchDisplay
