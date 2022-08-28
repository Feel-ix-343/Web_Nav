# Web Nav
*The command pallet for the web*


Analyses chrome history and suggests websites related to a search query to make repetitive (but specific) web navigation more efficient.

This extension does not provide an alternative to bookmarks, rather it is right between the repetitive use case of bookmarks and the specifics of a google search. 

It is for navigating to that one email or assignment on any website (in your history) in one click, rather than going through mutliple pages and sitting through annoying loading times to get there.




## Features
*Click through the drop downs for more information*

![image](https://user-images.githubusercontent.com/88951499/187056186-bd78142a-a58f-4410-a4d9-65b8358a526e.png)

<details>
  <summary>Searching through previously visited websites by webpage title</summary>
  A few examples:
  
  - Navigating directly to a classes grades (example search query: "chem grades" -> click) instead of logging into canvas, clicking on chemistry, and then finaly clicking on grades
  - Opening a specific folder on github (example seach query: "Web_nav readme" -> click) instead of loading onto github, opening Web_Nav, then clicking on readme
  
  Anything specific that you can think of, just try to search.

  If nothing comes up from your search history, you should use the feature below (sub-links!)
</details>

![image](https://user-images.githubusercontent.com/88951499/187056225-6cb7bc1e-e299-40dc-98bc-24f752d473db.png)

<details>
<summary>Navigating through the sub-links of a web-page (clickme!)</summary>

![image|width=400](https://user-images.githubusercontent.com/88951499/184465969-ab93efec-c560-41b0-b29f-0b3602b19aeb.png)


<img src="https://user-images.githubusercontent.com/88951499/184466044-975c54e0-837d-4fef-aa75-83236c62e6d4.png" width="500" height="auto" />
</details>

- Shortcuts for easy navigation

## Installation
To install and use:
1. Clone repo into a desired directory using `git clone https://github.com/Feel-ix-343/Web_Nav.git`
2. Navigate to the *webnav_analysis* directory, and run `wasm-pack build --release --target web` in the command prompt. This will build the rust wasm code and produce an npm package in the *webnav_analysis/pkg* directory
    - Note, you will need to have rust and [wasm-pack](https://github.com/rustwasm/wasm-pack) installed
3. Navigate to the *extension* directory, and run `npm install` to install dependencies. Then run `npm run build` to produce the extension files in the *extension/dist* directory
4. Open chrome://extensions and turn on developer mode
5. "Load Unpack" the *./extension/dist/* directory and open the extension


// TODO: Include graph pictures
