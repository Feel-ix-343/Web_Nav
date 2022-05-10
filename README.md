# Web Nav
*The command pallet for the web*

Analyses chrome history and suggests websites related to a search query to make repetitive web navigation faster and easier. <br>

The master branch does not have the server code. Look at the (Server history analyzation brach)[https://github.com/Feel-ix-343/Web_Nav/tree/ServerHistoryAnalyzation]
## Example Use Case
For my school, we use canvas lms to keep track of assignments and grades. However, unlike more public websites, I am not able to get to a classes page simply by using the google search bar. One solution to this is to use bookmarks, however, with the many different classes and link they have, this feels cluttered. I want to be able to look up, for example, "US History Grades", and be displayed a link to the canvas page. That is where this extension comes in to play. 

This project is very early in development, there is only functionality for the google chrome extension and it pretty simply queries google chrome history and displays the results. However, I am working on more complex data analysis that will organize web history based on relavance and also parse the websites to display pages that have not been visited previously. 
## Usage
To install and use:
1. Clone repo into a desired directory using `git clone https://github.com/Feel-ix-343/Web_Nav.git`
2. Open chrome://extensions and turn on developer mode
3. "Load Unpack" the ./extension/dist/ directory and open the extension
To load changed, use `git pull`, and the extension will update automatically in google chrome
## Permissions
- History: Searches and filters to display (currently, more functionality will come)
- Storage: Used to pull the previous search back up after closing the extension
## TODO
- Connect the client to the server and set up more complex analysis using the scala backend.
