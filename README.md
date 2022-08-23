# Web Nav
*The command pallet for the web*

Analyses chrome history and suggests websites related to a search query to make repetitive (yet specific) web navigation more efficient.

## Features
- Searching through previously visited websites by webpage title (sort of like searching through chrome history)
- Finding the sub-links of a web-page.
![image|width=400](https://user-images.githubusercontent.com/88951499/184465969-ab93efec-c560-41b0-b29f-0b3602b19aeb.png)
![image](https://user-images.githubusercontent.com/88951499/184466044-975c54e0-837d-4fef-aa75-83236c62e6d4.png)


- Shortcuts for easy navigation

## Installation
To install and use:
1. Clone repo into a desired directory using `git clone https://github.com/Feel-ix-343/Web_Nav.git`
2. Navigate to the *webnav_analysis* directory, and run `wasm-pack build --release --target web` in the command prompt. This will build the rust wasm code and produce an npm package in the *webnav_analysis/pkg* directory
    - Note, you will need to have rust and [wasm-pack](https://github.com/rustwasm/wasm-pack) installed
3. Navigate to the *extension* directory, and run `npm install` to install dependencies. Then run `npm run build` to produce the extension files in the *extension/dist* directory
4. Open chrome://extensions and turn on developer mode
5. "Load Unpack" the *./extension/dist/* directory and open the extension
To load updates, use `git pull`, and the extension will update automatically in google chrome

## Usage
For school, we use canvas lms to keep track of assignments and grades. However, because canvas is password protected, I am not able to get to a classes page simply by using the google search bar. One solution to this is to use bookmarks, however, with the many different classes and link they have, this feels cluttered. I want to be able to look up, for example, "US History Grades", and be displayed a link to the canvas page. That is where this extension comes in to play. 

// TODO: Include graph pictures
