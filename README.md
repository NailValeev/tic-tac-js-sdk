![npm](https://img.shields.io/badge/npm-1.2.0-green.svg)
# tic-tac-js-sdk
The Tic-Tac Mobile Software Development Kit for JavaScript designed to provide an easy interface to communicate with [Tic-Tac Mobile REST API](https://www.tictacmobile.com/api) in order to develop integrations with [Tic-Tac Mobile](https://www.tictacmobile.com). SDK relies on Promises to simplify handling of the asynchronous requests to the API endpoints.

# Features
* Make http requests from node.js
* Supports the Promise API
* Automatic converts response data from XML to JSON
* Descriptive error messages with status codes

# Installation
To use Tic-Tac Mobile JavaScript SDK, you need Node.js v6.4.0 or above.

`npm install tic-tac-js-sdk`

# Usage

To authorize the API calls, create the instance of APIConsumer. Pass you Tic-Tac Mobile API access token as parameter. You can use token saved as environment variable or pass it as argument on **npm start** :

`const token = process.env.API_TOKEN || args`

`const consumer = new APIConsumer(token)`

Then use any of available methods to call the API endpoints. SDK are Promise-based, so, it is easy to handle successful and failed requests:

`consumer.getUsers().then( // Handle data).catch( // Expose error)`

# Methods available
List of 27 methods available, grouped by endpoints they making calls to:
## users
* getUsers()
* getUser()
* addUser()
## projects
* getProjects()
* getProjectsWithBudget()
* getProjectsWithMembers()
* getProjectsWithBudgetAndMembers()
* addProject()
## utilizations
* getUtilizations()
## pricelists
* getPriceLists()
## invoices
* getInvoices()
* getInvoicesForProject()
## normaltimes
* getNormalTimes()
* getNormalTime()
## userreports
* getUsersReports()
* getOneUserReports()
## projectreports
* getProjectReports()
## timeplans
* getTimePlans()
* getTimePlansForProject()
* getUserTimePlans()
* getUserTimePlansForProject()
* getTimePlansSelected()
## entries
* getEntries()
* getEntriesWithBudget()
* getProjectEntries()
* getProjectEntriesWithBudget()
* addEntry()

# Sample app with Tic-tac Mobile JavaScript SDK, React.js, Next.js and Express.js
## Live demo:
https://cscloud153.lnu.se/

