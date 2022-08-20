


// window.addEventListener("DOMContentLoaded", async () => {
//   document.getElementById("inputBox").focus()
// 
//   // Syncing the previous search on extension open
//   chrome.storage.sync.get(['filter'], (r) => {
//     let prevFilter = r.filter
//     if (prevFilter) getFilterElem().value = prevFilter;
// 
//     loadSearch()
//   })
// 
// 
//   function getFilterElem(): HTMLInputElement {
//     return document.getElementById("inputBox") as HTMLInputElement
//   }
// 
//   // Adding search functionality
//   document.getElementById("inputBox").addEventListener("keyup", (ev) => {
//     // Navigating previous results through arrow keys
//     if (ev.key == "ArrowDown") {
//       OutLinkFocus()
//       return
//     }
//     // Normal search functionality
//     chrome.storage.sync.get(['filter'], (r) => {
//       if (r.filter === getFilterElem().value) return 
//       else {
//         chrome.storage.sync.set({ "filter": getFilterElem().value })
//         loadSearch()
//       }
//     })
//   })
// 
// 
// 
//   const childrenDisplay = new ChildrenDisplay()
//   const wasmObserver = new PopupWasmObserver()
// 
// 
//   // -----------------------------------
//   // Loading the Search in the input box
//   // -----------------------------------
//   async function loadSearch() {
//     const filter = getFilterElem().value
//     const searchOutput = document.getElementById("searchOutput") as HTMLDivElement
// 
// 
//     let response = await chrome.history.search({ text: filter, maxResults: 100, startTime: 987532627000 })
// 
//     searchOutput.innerHTML = ""
//     response.forEach(historyItem => {
//       searchOutput.appendChild(OutLinkItem(historyItem, childrenDisplay, wasmObserver))
//     })
// 
//   }
// 
// })





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
  wasmObserver = new PopupWasmObserver()
  

  constructor(props: AppProps) {
    super(props)
    this.state = {
      // Will be defined at application start by the subscription in the header
      displayItems: [],
      activeSublinks: null,
      sublinkViewHidden: true
    }
  }

  loadSearch = async (filter: string) => {
    let response = await chrome.history.search({ text: filter, maxResults: 100, startTime: 987532627000 })

    this.setState({displayItems: response})
  }

  sublinkViewer: HistoryItemSublinkViewer = (sublinks: HistoryItemSublinkView) => {
    this.setState({activeSublinks: sublinks, sublinkViewHidden: false})
  }


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



