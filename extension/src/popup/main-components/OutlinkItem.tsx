import PopupWasmObserver from "../PopupWasmObserver"
import React from 'react'
import { HistoryItemSublinkView, HistoryItemSublinkViewer } from "../popup"

interface OutlinkState {
  historyItemSublinks: HistoryItemSublinkView
}

interface OutlinkProps {
  historyItem: HistoryItem,
  wasmObserver: PopupWasmObserver,
  sublinkViewer: HistoryItemSublinkViewer
}

export default class OutLinkItem extends React.Component<OutlinkProps, OutlinkState> {
  constructor(props: OutlinkProps) {
    super(props)

    this.state = {
      historyItemSublinks: null
    }

    this.loadHistoryItemChildren()

  }

  loadHistoryItemChildren = () => {
    this.props.wasmObserver.initializationSubscription((worker) => {
      worker.getEdges(this.props.historyItem).then(edges => {
        if (edges == undefined) return
        this.setState({historyItemSublinks: {sublinks: edges}})
      })
    })
  }

  sublinksButton = () => {
    if (this.state.historyItemSublinks) {
      return (
        <input 
          className="button"
          type="button"
          onClick={() => this.props.sublinkViewer(this.state.historyItemSublinks)}
          value="View Sublinks" />
      )
    } else {
      return null
    }

  }

  render () {

    return (
      <div className='outLink' tabIndex={-1}>
        {this.props.historyItem.title}
        <div className='actionContainer'>
          <a className='button' href={this.props.historyItem.url} target="_blank">Open</a>
          {this.sublinksButton()}
        </div>
      </div>
    )
  } 

}

