import React from 'react'
import { HistoryItemSublinkView, HistoryItemSublinkViewer } from '../popup'
import PopupWasmObserver from '../PopupWasmObserver'
import OutLinkItem from './OutlinkItem'

interface SublinkViewProps {
  subLinksView: HistoryItemSublinkView,
  hidden: boolean
  onclose: () => void,
  wasmObserver: PopupWasmObserver,
  sublinksViewer: HistoryItemSublinkViewer
}

export default class SublinkView extends React.Component<SublinkViewProps> {
  render() {
    return (
      <div id='childrenDisplay' className={this.props.hidden ? "hidden" : ""}> 
        <input
          id="closeCDButton" 
          type="button" 
          className='button' 
          onClick={this.props.onclose} value="close" />
        <div id="children">
          {this.props.subLinksView?.sublinks.map(h => <OutLinkItem historyItem={h} wasmObserver={this.props.wasmObserver} sublinkViewer={this.props.sublinksViewer} />)}
        </div>
      </div>
    )
  }
}





