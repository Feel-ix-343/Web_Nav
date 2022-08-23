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

  sublinksHistoryControl: {history: HistoryItemSublinkView[], activeIndex: number}
  

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
      history: [],
      activeIndex: 0
    }

    this.wasmObserver = new PopupWasmObserver()
  }

  loadSearch = async (filter: string) => {
    let response = await chrome.history.search({ text: filter, maxResults: 100, startTime: 987532627000 })

    this.setState({displayItems: response})
  }

  sublinkViewer: HistoryItemSublinkViewer = (sublinks: HistoryItemSublinkView) => {
    console.log(sublinks)

    this.sublinksHistoryControl.activeIndex = this.sublinksHistoryControl.history.push(sublinks) - 1 // Pushes and assigns new length

    this.setState({
      activeSublinks: sublinks,
      sublinkViewHidden: false,
    })
  }

  closeSublinkView = () => {
    this.sublinksHistoryControl.history = []
    this.sublinksHistoryControl.activeIndex = 0

    this.setState({sublinkViewHidden: true})
  }

  back = () => {
    if (this.sublinksHistoryControl.activeIndex <= 0) return

    let newIndex: number = this.sublinksHistoryControl.activeIndex - 1
    this.sublinksHistoryControl.activeIndex = newIndex

    let newActiveSublinks: HistoryItemSublinkView = this.sublinksHistoryControl.history[newIndex]

    this.setState({activeSublinks: newActiveSublinks})

  }

  forward = () => {
    if (this.sublinksHistoryControl.activeIndex >= this.sublinksHistoryControl.history.length - 1) return

    let newIndex: number = this.sublinksHistoryControl.activeIndex + 1
    this.sublinksHistoryControl.activeIndex = newIndex

    let newActiveSublinks: HistoryItemSublinkView = this.sublinksHistoryControl.history[newIndex]

    this.setState({activeSublinks: newActiveSublinks})
  }
  


  // TODO: Add a settings and info section (with graph view)
  render() {
    return(
      <div>
        <Header searchSubscription={this.loadSearch} />

        <SearchDisplay
          displayItems={this.state.displayItems} 
          wasmObserver={this.wasmObserver} 
          sublinkViewer={this.sublinkViewer}
        />

        <SublinkView 
          hidden={this.state.sublinkViewHidden} 
          onclose={this.closeSublinkView} 
          subLinksView={this.state.activeSublinks}
          wasmObserver={this.wasmObserver}
          sublinksViewer={this.sublinkViewer}
          back={this.sublinksHistoryControl.activeIndex > 0 ? this.back : null}
          forward={this.sublinksHistoryControl.activeIndex < this.sublinksHistoryControl.history.length - 1 ? this.forward : null}
        />

      </div>
    )
  }
}



const reactContainer = document.getElementById("container")
const root = ReactDOM.createRoot(reactContainer)
root.render(<App />)

