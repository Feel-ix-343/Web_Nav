import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './main-components/Header'
import SearchDisplay from './main-components/SearchDisplay'
import SublinkView from './main-components/SublinkView'
import PopupWasmObserver from './PopupWasmObserver'

export interface HistoryItemSublinkView {
  historyItem: HistoryItem
  sublinks: HistoryItem[]
}
export type HistoryItemSublinkViewer = (sublink: HistoryItemSublinkView) => void

interface AppProps {}
interface AppState {
  displayItems: HistoryItem[],
  activeSublinks: HistoryItemSublinkView,
  sublinkViewHidden: boolean
}

class App extends React.Component<AppProps, AppState> {
  wasmObserver: PopupWasmObserver

  // sublinksHistoryControl: {history: HistoryItemSublinkView[], activeIndex: number}
  sublinksHistoryControl: {past: HistoryItemSublinkView[], current: HistoryItemSublinkView, future: HistoryItemSublinkView[]}
  

  constructor(props: AppProps) {
    super(props)
    this.state = {
      // Will be defined at application start by the subscription in the header
      displayItems: [],
      activeSublinks: null,
      sublinkViewHidden: true
    }


    // Default values
    this.sublinksHistoryControl = {
      past: [],
      current: null,
      future: []
    }

    this.wasmObserver = new PopupWasmObserver()
  }

  loadSearch = async (filter: string) => {
    let response = await chrome.history.search({ text: filter, maxResults: 100, startTime: 987532627000 })

    this.setState({displayItems: response})
  }

  sublinkViewer: HistoryItemSublinkViewer = (sublinks: HistoryItemSublinkView) => {
    console.log(sublinks)

    if (this.sublinksHistoryControl.current == null) this.sublinksHistoryControl.current = sublinks
    else {
      this.sublinksHistoryControl.past.push(this.sublinksHistoryControl.current)
      this.sublinksHistoryControl.future = []
      this.sublinksHistoryControl.current = sublinks
    }

    this.setState({
      activeSublinks: sublinks,
      sublinkViewHidden: false,
    })
  }

  closeSublinkView = () => {
    this.sublinksHistoryControl = {past: [], current: null, future: []}

    this.setState({sublinkViewHidden: true})
  }

  back = () => {
    if (!this.sublinksHistoryControl.past.length) return
    console.log(this.sublinksHistoryControl.past.length)

    this.sublinksHistoryControl.future.push(this.sublinksHistoryControl.current)
    this.sublinksHistoryControl.current = this.sublinksHistoryControl.past.pop()

    let newActiveSublinks: HistoryItemSublinkView = this.sublinksHistoryControl.current

    this.setState({activeSublinks: newActiveSublinks})
  }

  forward = () => {
    if (!this.sublinksHistoryControl.future.length) return

    this.sublinksHistoryControl.past.push(this.sublinksHistoryControl.current)
    this.sublinksHistoryControl.current = this.sublinksHistoryControl.future.pop()

    let newActiveSublinks: HistoryItemSublinkView = this.sublinksHistoryControl.current


    this.setState({activeSublinks: newActiveSublinks})
  }
  


  render() {
    return(
      <div>
        <Header searchSubscription={this.loadSearch} wasmObserver={this.wasmObserver} />

        <SearchDisplay
          displayItems={this.state.displayItems} 

          outlinkSublinkNeeds={{sublinkViewer: this.sublinkViewer, wasmObserver: this.wasmObserver}}
        />

        <SublinkView 
          hidden={this.state.sublinkViewHidden} 
          onclose={this.closeSublinkView} 
          subLinksView={this.state.activeSublinks}

          outlinkSublinkNeeds={{wasmObserver: this.wasmObserver, sublinkViewer: this.sublinkViewer}}

          back={this.sublinksHistoryControl.past.length ? this.back : null}
          forward={this.sublinksHistoryControl.future.length ? this.forward : null}
        />

      </div>
    )
  }
}



const reactContainer = document.getElementById("container")
const root = ReactDOM.createRoot(reactContainer)
root.render(<App />)

