import PopupWasmObserver from "../PopupWasmObserver"
import React from 'react'

interface OutlinkState {
  historyItemSublinks: HistoryItem[]
}

interface OutlinkProps {
  historyItem: HistoryItem,
}

export default class OutLinkItem extends React.Component<OutlinkProps, OutlinkState> {
  constructor(props: OutlinkProps) {
    super(props)
  }


  render () {
    return (
      <div className='outLink' tabIndex={-1}>
        {this.props.historyItem.title}
        <div className='actionContainer'>
          <a className='button' href={this.props.historyItem.url} target="_blank">Open</a>
        </div>
      </div>
    )
  } 
}

