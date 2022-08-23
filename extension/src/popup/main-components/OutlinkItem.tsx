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

  }

  loadHistoryItemChildren = () => {
    this.props.wasmObserver.initializationSubscription((worker) => {
      worker.getEdges(this.props.historyItem).then(edges => {
        if (edges == undefined) return
        this.setState({historyItemSublinks: {historyItem: this.props.historyItem, sublinks: edges}})
      })
    })
  }

  componentDidMount(): void {
    this.loadHistoryItemChildren()
  }

  render () {

    const viewSublinksButton = this.state.historyItemSublinks ?
      (
        <input 
          className="button"
          type="button"
          onClick={() => this.props.sublinkViewer(this.state.historyItemSublinks)}
          value="View Sublinks" />
      ) : null

    return (
      <div className='outLink' tabIndex={-1}>
        {this.props.historyItem.title}
        <div className='actionContainer'>
          <a className='button' href={this.props.historyItem.url} target="_blank">Open</a>
          {viewSublinksButton}
        </div>
      </div>
    )
  } 

}

