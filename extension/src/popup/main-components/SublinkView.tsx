import React from 'react'
import { HistoryItemSublinkView, HistoryItemSublinkViewer } from '../popup'
import PopupWasmObserver from '../PopupWasmObserver'
import OutLinkItem from './OutlinkItem'

interface SublinkViewProps {
  subLinksView: HistoryItemSublinkView,
  hidden: boolean
  onclose: () => void,
  back: (() => void) | null,
  forward: (() => void) | null,
  wasmObserver: PopupWasmObserver,
  sublinksViewer: HistoryItemSublinkViewer
}

export default class SublinkView extends React.Component<SublinkViewProps> {
  render() { 
    return (
      <div id='childrenDisplay' className={this.props.hidden ? "hidden" : ""}> 
        <div className='sublinkNavContainer'>
          <input
            id="closeSublinkView" 
            type="button" 
            className='button' 
            onClick={this.props.onclose} 
            value="close" />


          {this.props.back ? 
            <input
              type='button' 
              className='button sublinkNav' 
              onClick={this.props.back}
              value='back'/> 

            : null }

          {this.props.forward ? 
            <input 
              type='button'
              className='button sublinkNav'
              onClick={this.props.forward}
              value='forward'/>

            : null }
        </div>

        <div id="children">
          {this.props.subLinksView?.sublinks.map(h => <OutLinkItem key={Math.random()}historyItem={h} wasmObserver={this.props.wasmObserver} sublinkViewer={this.props.sublinksViewer} />)}
        </div>
      </div>
    )
  }
}





