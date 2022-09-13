import React from 'react'
import OutlinkItem, { OutlinkSublinkNeeds } from './OutlinkItem'

// TODO: FIx one display item stretch
interface SearchDisplayProps{
  displayItems: HistoryItem[],

  outlinkSublinkNeeds: OutlinkSublinkNeeds
}



const SearchDisplay = (props: SearchDisplayProps) => {

  let outLinkItems = props.displayItems.map(historyItem => 
    <OutlinkItem
      key={historyItem.id} 
      historyItem={historyItem} 
      sublinkNeeds={props.outlinkSublinkNeeds}
    />)
  
  return(
    <div id='data'>
      {outLinkItems}
    </div>
  )
}

export default SearchDisplay
