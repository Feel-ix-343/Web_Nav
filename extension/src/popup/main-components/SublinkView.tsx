import React from 'react'
import { HistoryItemSublinkView } from '../popup'
import OutLinkItem, { OutlinkSublinkNeeds } from './OutlinkItem'

interface SublinkViewProps {
  subLinksView: HistoryItemSublinkView,
  hidden: boolean
  onclose: () => void,
  back: (() => void) | null,
  forward: (() => void) | null,

  outlinkSublinkNeeds: OutlinkSublinkNeeds
}

const SublinkView = (props: SublinkViewProps) => {

  const ref = React.useRef(null)
  const topOfView = <a ref={ref}></a>

  // Composition with added functionality
  const openThenScroll = (h: HistoryItemSublinkView) => {
    props.outlinkSublinkNeeds.sublinkViewer(h)
    ref.current?.scrollIntoView({behavior: "smooth"})
  }

  const scrollingBack = () => {
    props.back()
    ref.current?.scrollIntoView({behavior: "smooth"})
  }

  const scrollingForward = () => {
    props.forward()
    ref.current?.scrollIntoView({behavior: "smooth"})
  }

  const updatedOutlinkSublinkNeeds: OutlinkSublinkNeeds = {sublinkViewer: openThenScroll, wasmObserver: props.outlinkSublinkNeeds.wasmObserver}



  

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
              onClick={scrollingBack}
              value='back'/> 

            : null }

          {props.forward ? 
            <input 
              type='button'
              className='button sublinkNav'
              onClick={scrollingForward}
              value='forward'/>

            : null }
        </div>


        <div id="children">
          {topOfView}
          {props.subLinksView?.sublinks.map(h => 
            <OutLinkItem key={h.url}
              historyItem={h} 
              sublinkNeeds={updatedOutlinkSublinkNeeds} 
          />)}
        </div>
      </div>
    </div>
  )
}


export default SublinkView


