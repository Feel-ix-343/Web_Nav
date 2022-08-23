
import React, { useState, useEffect } from 'react'

interface HeaderState {
  value: string
}
interface HeaderProps {
// Turn this into a Rxjs observer
  searchSubscription: (filter: string) => void
}


class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props)

    this.state = {
      value: ""
    }

    this.importPreviousSearch()
  }

  importPreviousSearch = () => {
    chrome.storage.sync.get(['filter'], (r) => {
      let prevSearch = r.filter
      if (prevSearch) {
        this.setState({value: prevSearch})

        // Will need to update the display at the start of the App
        this.props.searchSubscription(prevSearch)
      } 
    })
  }

  updateGoogleStorage = (newSearch: string) => {
    chrome.storage.sync.set({"filter": newSearch})
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let search = event.target.value

    this.setState({value: search})

    this.updateGoogleStorage(search)
    this.props.searchSubscription(search)
  }

  render() {
    return(
      <div id='header'>
        <h1 id='heading'>Web-Nav</h1>
        <input autoFocus id='inputBox'type='text' value={this.state.value} onChange={this.handleChange} placeholder='Search' />
      </div>
    )
  }
}



const Header1 = (props: HeaderProps) =>  {

  const [value, setValue] = useState("")

  // Only want to run at initial render
  useEffect(() => {
    importPreviousSearch()
  }, [])

  const importPreviousSearch = () => {
    console.log("Importing")
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



  return(
    <div id='header'>
      <h1 id='heading'>Web-Nav</h1>
      <input autoFocus id='inputBox'type='text' value={value} onChange={handleChange} placeholder='Search' />
    </div>
  )
}

export default Header1

