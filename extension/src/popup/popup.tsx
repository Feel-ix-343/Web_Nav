import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './main-components/Header'
import SearchDisplay from './main-components/SearchDisplay'
import SublinkView from './main-components/SublinkView'
import PopupWasmObserver from './PopupWasmObserver'

export interface HistoryItemSublinkView {
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
  

  constructor(props: AppProps) {
    super(props)
    this.state = {
      // Will be defined at application start by the subscription in the header
      displayItems: [],
      activeSublinks: null,
      sublinkViewHidden: true
    }

    this.wasmObserver = new PopupWasmObserver()
  }

  loadSearch = async (filter: string) => {
    let response = await chrome.history.search({ text: filter, maxResults: 100, startTime: 987532627000 })

    this.setState({displayItems: response})
  }

  sublinkViewer: HistoryItemSublinkViewer = (sublinks: HistoryItemSublinkView) => {
    this.setState({activeSublinks: sublinks, sublinkViewHidden: false})
  }


  // TODO: Add a back/undo button
  render() {
    return(
      <div>
        <Header searchSubscription={this.loadSearch} />
        <SearchDisplay displayItems={this.state.displayItems} wasmObserver={this.wasmObserver} sublinkViewer={this.sublinkViewer} />

        <SublinkView 
          hidden={this.state.sublinkViewHidden} 
          onclose={() => this.setState({sublinkViewHidden: true})} 
          subLinksView={this.state.activeSublinks}
          wasmObserver={this.wasmObserver}
          sublinksViewer={this.sublinkViewer}
        />

      </div>
    )
  }
}



const reactContainer = document.getElementById("container")
const root = ReactDOM.createRoot(reactContainer)
root.render(<App />)



