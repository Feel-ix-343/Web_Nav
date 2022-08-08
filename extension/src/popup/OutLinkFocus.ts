
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
  } else if ((ev.key == " " || ev.key == "Enter") && activeOutlinkIndex != -1) {
    ev.preventDefault()

    console.log("open")


    // TODO: Fix this uglyness
    let activeElement = document.querySelectorAll("#searchOutput > .outLink")[activeOutlinkIndex] as HTMLDivElement
    let outLinkOpenButton = (() => {
      console.log(activeElement.children)
      for (let childElement of activeElement.children) {
        if (childElement.className === "actionContainer") {
          for (let childAction of childElement.children) {
            if (childAction.className === "button" && childAction.textContent === "Open") {
              return childAction
            }
          }
        }
      }
      return null
    })()

    console.log(outLinkOpenButton)

    if (outLinkOpenButton) {
      console.log("click");
      (outLinkOpenButton as HTMLAnchorElement).click()
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
