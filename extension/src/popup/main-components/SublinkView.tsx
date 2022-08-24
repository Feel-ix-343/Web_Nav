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

const SublinkView = (props: SublinkViewProps) => {

  return (
    <div id='childrenDisplay' className={props.hidden ? "hidden" : ""}>

      <div id='activeHistoryItemStatus'>
        <div>{props.subLinksView?.historyItem.title}</div>
      </div>

      <div id='childrenDisplaySub' > 
        <div className='sublinkNavContainer'>
          <input
            id="closeSublinkView" 
            type="button" 
            className='button' 
            onClick={props.onclose} 
            value="close" />


          {props.back ? 
            <input
              type='button' 
              className='button sublinkNav' 
              onClick={props.back}
              value='back'/> 

            : null }

          {props.forward ? 
            <input 
              type='button'
              className='button sublinkNav'
              onClick={props.forward}
              value='forward'/>

            : null }
        </div>


        <div id="children">
          {props.subLinksView?.sublinks.map(h => 
            <OutLinkItem key={h.url} historyItem={h} wasmObserver={props.wasmObserver} sublinkViewer={props.sublinksViewer}
          />)}
        </div>
      </div>
    </div>
  )
}


export default SublinkView


