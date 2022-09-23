# Web Nav
*The command pallet for the web*


Analyses chrome history and suggests webpages related to a search query to make repetitive (but specific) web navigation more efficient.

This extension does not provide an alternative to bookmarks, rather it is right between the repetitive use case of bookmarks and the specificity of a google search. 

It is for navigating to that one email or assignment on any website (in your history) in one click, rather than going through mutliple pages and sitting through annoying loading times to get there.




## Features
*Click through the drop downs for more information*

<details>
  <summary>Searching through previously visited websites by webpage title</summary>
  A few examples:
  
  - Navigating directly to a class's grades (example search query: "chem grades" -> click) instead of logging into canvas, clicking on chemistry, and then clicking on grades
  - Opening a specific folder on github (example seach query: "Web_nav readme" -> click) instead of logging into github, opening Web_Nav, then clicking on readme
  
  For anything specific that you can think of, just try to search for it in the Web_Nav!
</details>

![image](https://user-images.githubusercontent.com/88951499/187074301-e7e87562-5f46-4701-ac55-e3190c5845f9.png)

<details>
<summary>Navigating through the sub-links of a web-page (clickme!)</summary>

When the title of a main webpage is known, you can easily get to all of its sub pages. 

This is extremely helpful when, for example, you know that you want to go to a specific assignment for a class, but you don't know the assingment's name. Do this:
- Search [classname]
- Click "view sublinks"
- Then scroll to find the assignment!

Here are the sublink graphs of a few websites I use daily. The first is instructure (canvas) for highschool and the second is Github!

![image|width=400](https://user-images.githubusercontent.com/88951499/184465969-ab93efec-c560-41b0-b29f-0b3602b19aeb.png)


<img src="https://user-images.githubusercontent.com/88951499/184466044-975c54e0-837d-4fef-aa75-83236c62e6d4.png" width="500" height="auto" />

The example displayed below shows a typical github (web_nav)igation. 
- Search "Web_Nav"
- "View Sublinks"
- Find a specific folder or go to issues and click "open"

This example also shows the sub-sub-link functionality for nested sublinks. There are back and forward buttons to help with this type of navigation.

</details>
Click above to read about this feature ^^^^^

![image](https://user-images.githubusercontent.com/88951499/187056327-ed6e2e3e-51f8-4f4b-b452-2a18498b84f1.png)
![image](https://user-images.githubusercontent.com/88951499/187056355-5f699697-4fb4-430a-ac23-1f17c2fe02fc.png)


## Installation
To install and use:
1. Clone repo into a desired directory using `git clone https://github.com/Feel-ix-343/Web_Nav.git`
2. Navigate to the *webnav_analysis* directory, and run `wasm-pack build --release --target web` in the command prompt. This will build the rust wasm code and produce an npm package in the *webnav_analysis/pkg* directory
    - Note, you will need to have rust and [wasm-pack](https://github.com/rustwasm/wasm-pack) installed
3. Navigate to the *extension* directory, and run `npm install` to install dependencies. Then run `npm run build` to produce the extension files in the *extension/dist* directory
4. Open chrome://extensions and turn on developer mode
5. "Load Unpack" the *./extension/dist/* directory and open the extension
