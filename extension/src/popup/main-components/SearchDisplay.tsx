import React from 'react'
import { HistoryItemSublinkView, HistoryItemSublinkViewer } from '../popup'
import PopupWasmObserver from '../PopupWasmObserver'
import OutlinkItem from './OutlinkItem'

interface SearchDisplayState{}

interface SearchDisplayProps{
  displayItems: HistoryItem[],
  wasmObserver: PopupWasmObserver,
  sublinkViewer: HistoryItemSublinkViewer
}


export default class SearchDisplay extends React.Component<SearchDisplayProps, SearchDisplayState> {
  constructor(props: SearchDisplayProps) {
    super(props)
  }

  render() {
    
    let outLinkItems = this.props.displayItems.map(historyItem => <OutlinkItem historyItem={historyItem} wasmObserver={this.props.wasmObserver} sublinkViewer={this.props.sublinkViewer}/>)
    
    return(
      <div id='data'>
        {outLinkItems}
      </div>
    )
  }
}


