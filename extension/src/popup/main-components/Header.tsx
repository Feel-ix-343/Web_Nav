

import { faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react'
import PopupWasmObserver from '../PopupWasmObserver'


const AppInfo = (props: {hidden: boolean, wasmObserver: PopupWasmObserver}) => {
  let [allHistoryItems, setHistoryItems] = useState([])
  let [initializationTiming, setInitializationTiming] = useState(null)

  useEffect(() => {
    chrome.history.search({ text: "", maxResults: 1000000, startTime: 987532627000 }).then( response => {
      setHistoryItems(response)
    })
  } , [])

  useEffect(() => {
      props.wasmObserver.initializationSubscription(async (worker) => {
          setInitializationTiming(await worker.getInitialiationTime())
        })
    }, [])
  return (
    <div id="info" className={props.hidden ? "hidden" : ""}>
      <p>History Size: {allHistoryItems?.length}, Initialization Time: {Math.round(initializationTiming)}ms</p>
    </div>
  )
}

interface HeaderProps {
  searchSubscription: (filter: string) => void,

  /**
    Used by the info section of the header
  */
  wasmObserver: PopupWasmObserver
}


const Header = (props: HeaderProps) =>  {

  const [value, setValue] = useState("")

  // Only want to run at initial render
  useEffect(() => {
    importPreviousSearch()
  }, [])

  const importPreviousSearch = () => {
    chrome.storage.sync.get(['filter'], (r) => {
      let prevSearch = r.filter
      if (prevSearch != undefined) {
        setValue(prevSearch)

        // Will update the display with the fetched value at the start of the App
        props.searchSubscription(prevSearch)
      } 
    })
  }

  const updateGoogleStorage = (newSearch: string) => {
    chrome.storage.sync.set({"filter": newSearch})
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let search = event.target.value

    setValue(search)
updateGoogleStorage(search)
    props.searchSubscription(search)
  }

  const [infoStatus, setInfoStatus] = useState(true)



  return(
    <div id='header'>
      <img id="logo" src={'./WebNavLogo.png'} />

      <h1 id='heading'>Web-Nav</h1>

      <FontAwesomeIcon id='infoButton' icon={infoStatus ? faCircleInfo : faCircleXmark} className='button' onClick={() => setInfoStatus(!infoStatus)} />
      <AppInfo hidden={infoStatus} wasmObserver={props.wasmObserver}/>
      <div>
        <input autoFocus id='inputBox'type='text' value={value} onChange={handleChange} placeholder='Search' />
      </div>
    </div>

  )
}


export default Header

