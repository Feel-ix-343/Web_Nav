import React from 'react'
import PopupWasmObserver from '../PopupWasmObserver'
import OutlinkItem from './OutlinkItem'

interface SearchDisplayState{}

interface SearchDisplayProps{
  displayItems: HistoryItem[],
}


export default class SearchDisplay extends React.Component<SearchDisplayProps, SearchDisplayState> {
  constructor(props: SearchDisplayProps) {
    super(props)

    this.state = {

    }
  }

  render() {
    
    let outLinkItems = this.props.displayItems.map(historyItem => <OutlinkItem historyItem={historyItem} />)
    
    return(
      <div id='data'>
        {outLinkItems}
      </div>
    )
  }
}


