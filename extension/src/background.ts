// TODO: Use the chrome.storage.sync to store the user id

// let id: string
// chrome.storage.sync.get(['id'], (r) => {
//   if (r.id) id = r.id
//   else {
//     fetch("http://localhost:9000/newUser")
//       .then(r => r.json())
//       .then(d => {
//         id = d
//         chrome.storage.sync.set({"id": d})
//       })
//   }
// })

// TODO: Implement a sync loop
let id: string = "test"


let time = Date.now()
let lastSyncedTime: string

fetch("http://localhost:9000/getLastSynced?id="+id)
  .then(r => r.json())
  .then(d => {
    let lastSynced = parseInt(d)
    sync(lastSynced)
  })

function sync(lastSynced: number) {
  chrome.history.search({text: "", maxResults: 100000, startTime: lastSynced}).then(r => {
    const data = {
      id: id,
      history: r,
      time: Date.now()
    }
    console.log(JSON.stringify(data))
    fetch("http://localhost:9000/debugSyncHistory", {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(d => console.log(d))
  })
}


 
