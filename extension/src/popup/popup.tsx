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
  sublinksHistory: HistoryItemSublinkView[],
  activeSublinkHistoryIndex: number,
  sublinkViewHidden: boolean
}
class App extends React.Component<AppProps, AppState> {
  wasmObserver: PopupWasmObserver
  

  constructor(props: AppProps) {
    super(props)
    this.state = {
      // Will be defined at application start by the subscription in the header
      displayItems: [],
      activeSublinks: null,
      sublinksHistory: [],
      activeSublinkHistoryIndex: 0,
      sublinkViewHidden: true
    }
    this.loadSearch("") // Will load the search on a blank startup // TODO: Fix this
    this.wasmObserver = new PopupWasmObserver()
  }

  loadSearch = async (filter: string) => {
    let response = await chrome.history.search({ text: filter, maxResults: 100, startTime: 987532627000 })

    this.setState({displayItems: response})
  }

  sublinkViewer: HistoryItemSublinkViewer = (sublinks: HistoryItemSublinkView) => {
    console.log(sublinks)

    let sublinksHistory = this.state.sublinksHistory?.slice()
    let activeIndex = sublinksHistory?.push(sublinks) - 1

    this.setState({
      activeSublinks: sublinks,
      sublinkViewHidden: false,
      sublinksHistory: sublinksHistory,
      activeSublinkHistoryIndex: activeIndex
    })
  }

  closeSublinkView = () => {
    this.setState({sublinksHistory: [], activeSublinkHistoryIndex: 0, sublinkViewHidden: true})
  }

  back = () => {
    if (this.state.activeSublinkHistoryIndex == 0) return

    let newIndex: number = this.state.activeSublinkHistoryIndex - 1
    let newActiveSublinks: HistoryItemSublinkView = this.state.sublinksHistory[newIndex]

    this.setState({activeSublinkHistoryIndex: newIndex, activeSublinks: newActiveSublinks})

  }

  forward = () => {
    if (this.state.activeSublinkHistoryIndex >= this.state.sublinksHistory.length - 1) return

    let newIndex: number = this.state.activeSublinkHistoryIndex + 1
    let newActiveSublinks: HistoryItemSublinkView = this.state.sublinksHistory[newIndex]

    this.setState({activeSublinkHistoryIndex: newIndex, activeSublinks: newActiveSublinks})
  }
  


  // TODO: Add a back/undo button
  // TODO: Add a settings and info section (with graph view)
  // TODO: Add the outlink focus
  // TODO: Fix not showing all sublinks/wrong sublinks; I think it has to do with ids
  render() {
    return(
      <div>
        <Header searchSubscription={this.loadSearch} />
        <SearchDisplay displayItems={this.state.displayItems} wasmObserver={this.wasmObserver} sublinkViewer={this.sublinkViewer} />

        <SublinkView 
          hidden={this.state.sublinkViewHidden} 
          onclose={this.closeSublinkView} 
          subLinksView={this.state.activeSublinks}
          wasmObserver={this.wasmObserver}
          sublinksViewer={this.sublinkViewer}
          back={this.state.activeSublinkHistoryIndex > 0 ? this.back : null}
          forward={this.state.activeSublinkHistoryIndex < this.state.sublinksHistory?.length - 1 ? this.forward : null}
        />

      </div>
    )
  }
}



const reactContainer = document.getElementById("container")
const root = ReactDOM.createRoot(reactContainer)
root.render(<App />)



