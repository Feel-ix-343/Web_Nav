
// Used in the input box event listener

let activeOutlinkIndex: number

export default function start(): void {

  (document.querySelectorAll("#searchOutput > .outLink")[0] as HTMLDivElement).focus()
  // Starts listening for events. THere should not be any other event happening after start was called, so this should work
  activeOutlinkIndex = 0 // FIXME: Confusing; THe window listener gets called when declared. Need to make activeOutLink -1 to counter this
  window.addEventListener("keydown", eventListener)

  console.log("focusing")
}

function eventListener(ev: KeyboardEvent): void {
  if (ev.key == "ArrowDown"){
    console.log("ArrowDown", activeOutlinkIndex)
    ev.preventDefault() // Preventing default scrolling
    changeFocus(1)
    
  } else if (ev.key == "ArrowUp") {
    console.log("ArrowUp", activeOutlinkIndex)
    ev.preventDefault() // Preventing default scrolling

    // It it is 0, and up is being pressed, focus on the input box
    if (activeOutlinkIndex === 0) {
      document.getElementById("inputBox").focus()
      window.removeEventListener("keydown", eventListener)
      return
    } else {
      changeFocus(-1)
    }
  }
}

function changeFocus(direction: number): void {
  let outLinks = document.querySelectorAll("#searchOutput > .outLink")

  console.log(activeOutlinkIndex)

  if (direction === -1) {
    activeOutlinkIndex += -1;

    (outLinks[activeOutlinkIndex] as HTMLDivElement).focus()

  } else if (direction === 1) {

    if (activeOutlinkIndex == outLinks.length - 1) return 

    activeOutlinkIndex += 1;

    (outLinks[activeOutlinkIndex] as HTMLDivElement).focus()
  }
}
