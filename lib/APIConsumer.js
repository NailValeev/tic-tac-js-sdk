'use strict'

const axios = require('axios')
const Endpoints = require('./EndpointsV1.js')
const objectAssign = require('object-assign')
const parseString = require('xml2js').parseString

const endpoints = new Endpoints()

/**
 * Create an API consumer to make API calls
 * @param {string} token - JSON Web Token
 */
function APIConsumer (token) {
  if (token === null) throw new Error('JWT is not provided!')

  this.token = 'Bearer ' + token

  // Advanced error handling
  // https://medium.com/@senanayake.kalpa/controlling-axios-error-handling-and-test-it-using-nock-jest-1dcd40cb4560

  var axiosInstance = axios.create({
    headers: { 'Authorization': this.token, 'Accept': 'application/json' },
    validateStatus: function (status) {
      return status >= 200 && status <= 503
    }
  })
  var axiosPostInstance = axios.create({
    headers: { 'Authorization': this.token, 'Accept': 'application/json', 'Content-Type': 'application/json' },
    validateStatus: function (status) {
      return status >= 200 && status <= 503
    }
  })
  var axiosXMLInstance = axios.create({
    headers: { 'Authorization': this.token, 'Accept': 'application/xml' },
    validateStatus: function (status) {
      return status >= 200 && status <= 503
    }
  })

  /*
  * Function to reuse on get calls
  */
  const doGet = function (options) {
    let url = options.url
    let queryParams = options.qParams
    return axiosInstance.get(url, { params: queryParams })
      .then((response) => {
        if (response.status >= 200 && response.status <= 300) { // Standard axios validation
          return response.data
        } else { // Throw rejected Promise with object instead of Error
          let message = response.data.errormessage || response.data
          return Promise.reject(new Error(response.status + '_' + message))
        }
      })
  }

  /*
  * Function to reuse on get calls to XML-only endpoints
  */
  const doGetXML = function (options) {
    let url = options.url
    let queryParams = options.qParams
    return axiosXMLInstance.get(url, { params: queryParams })
      .then(async (response) => {
        if (response.status >= 200 && response.status <= 300) { // Standard axios validation
          return xmlToJSON(response.data)
        } else { // Throw rejected Promise with object instead of Error
          let converted = await xmlToJSON(response.data)
          let message = converted.ticTacApiError.errormessage || converted
          return Promise.reject(new Error(response.status + '_' + message))
        }
      })
  }

  /*
  * Function to reuse on post calls
  */
  const doPost = function (options) {
    let url = options.url
    let dataSet = options.jsonData
    return axiosPostInstance.post(url, dataSet)
      .then((response) => {
        if (response.status >= 200 && response.status <= 300) { // Standard axios validation
          return response.data
        } else { // Throw rejected Promise with object instead of Error
          let message = response.data.errormessage || response.data
          return Promise.reject(new Error(response.status + '_' + message))
        }
      })
  }

  /**
  * Convert raw XML data to JSON.
  */
  const xmlToJSON = function (xmlData, xml2JsOptions) {
    xml2JsOptions = objectAssign({}, xml2JsOptions)

    return new Promise(function (resolve, reject) {
      parseString(xmlData, xml2JsOptions, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  /*
  * Returns a list of all users, sorted by name.
  */
  this.getUsers = function () {
    return doGet({ url: endpoints.users, qParams: {} })
  }
  /*
  * Returns an user, specified by id as path parameter.
  */
  this.getUser = function (userid) {
    return doGet({ url: endpoints.user + userid, qParams: {} })
  }
  /*
  * Adds an user.
  */
  this.addUser = function (jsonData) {
    return doPost({ url: endpoints.users, jsonData })
  }

  /*
  * Returns projects
  */
  this.getProjects = function (numberOfProjects) {
    return doGet({ url: endpoints.projects, qParams: { number: numberOfProjects } })
  }
  /*
  * Returns projects with budget
  */
  this.getProjectsWithBudget = function (numberOfProjects) {
    return doGet({ url: endpoints.projects, qParams: { number: numberOfProjects, includeBudget: true } })
  }
  /*
  * Returns projects with project members
  */
  this.getProjectsWithMembers = function (numberOfProjects) {
    return doGet({ url: endpoints.projects, qParams: { number: numberOfProjects, includeMembers: true } })
  }
  /*
  * Returns projects with project members
  */
  this.getProjectsWithBudgetAndMembers = function (numberOfProjects) {
    return doGet({ url: endpoints.projects, qParams: { number: numberOfProjects, includeBudget: true, includeMembers: true } })
  }
  /*
  * Adds an entry.
  */
  this.addProject = function (jsonData) {
    return doPost({ url: endpoints.projects, jsonData })
  }

  /*
  * Returns a list of all utilizations
  */
  this.getUtilizations = function (from, to) {
    return doGet({ url: endpoints.utilizations, qParams: { startdate: from, enddate: to } })
  }

  /*
  * Returns a list of all pricelists
  */
  this.getPriceLists = function () {
    return doGet({ url: endpoints.pricelists, qParams: {} })
  }

  /*
  * Returns a list of all invoices
  */
  this.getInvoices = function (from, to) {
    return doGetXML({ url: endpoints.invoices, qParams: { startdate: from, enddate: to } })
  }
  /*
  * Returns a list of all invoices for selected project
  */
  this.getInvoicesForProject = function (from, to, projectid) {
    return doGetXML({ url: endpoints.invoice + projectid, qParams: { startdate: from, enddate: to } })
  }

  /*
  * Returns a list of all normal times
  */
  this.getNormalTimes = function (from, to) {
    return doGetXML({ url: endpoints.normaltimes, qParams: { startdate: from, enddate: to } })
  }
  /*
  * Returns a normal time specified by list number
  */
  this.getNormalTime = function (from, to, listnumber) {
    return doGetXML({ url: endpoints.normaltime + listnumber, qParams: { startdate: from, enddate: to } })
  }

  /*
  * Returns a list of all user reports
  */
  this.getUsersReports = function (from, to) {
    return doGetXML({ url: endpoints.userreports, qParams: { startdate: from, enddate: to } })
  }
  /*
  * Returns reports for user specified by user id
  */
  this.getOneUserReports = function (from, to, userid) {
    return doGetXML({ url: endpoints.userreport + userid, qParams: { startdate: from, enddate: to } })
  }

  /*
  * Returns a list project reports, groupped by:
  * 1 - no grouping; 2 - Customer; 3 - Account; 4 - Category; 5 - ResultArea; 6 - Projectlead.
  */
  this.getProjectReports = function (from, to, groupingCriteria) {
    return doGetXML({ url: endpoints.projectreports, qParams: { startdate: from, enddate: to, groupBy: groupingCriteria } })
  }

  /*
  * Returns a list of all timeplans
  */
  this.getTimePlans = function (from, to) {
    return doGet({ url: endpoints.timeplans, qParams: { startdate: from, enddate: to } })
  }
  /*
  * Returns a list of all timeplans for one porject
  */
  this.getTimePlansForProject = function (from, to, projectId) {
    return doGet({ url: endpoints.timeplans, qParams: { startdate: from, enddate: to, projectid: projectId } })
  }
  /*
  * Returns a list of all timeplans for one user
  */
  this.getUserTimePlans = function (userId, from, to) {
    return doGetXML({ url: endpoints.timeplan + userId, qParams: { startdate: from, enddate: to } })
  }
  /*
  * Returns a list of all timeplans for one user
  */
  this.getUserTimePlansForProject = function (userId, from, to, projectId) {
    return doGetXML({ url: endpoints.timeplan + userId, qParams: { startdate: from, enddate: to, projectid: projectId } })
  }
  /*
  * Returns a list of timeplans for specific project, workroup,costcenter, department
  */
  this.getTimePlansSelected = function (from, to, optsJSON) {
    try {
      let options = JSON.parse(optsJSON)
      return doGet({
        url: endpoints.timeplans,
        qParams: {
          startdate: from,
          enddate: to,
          projectId: options.projectId,
          forWorkgroup: options.forWorkgroup,
          forCostcenter: options.forCostcenter,
          forDepartment: options.forDepartment
        }
      })
    } catch (Exception) {
      return Promise.reject(new Error('400_Invalid optsJSON parameter'))
    }
  }

  /*
  * Returns a list of all entries
  */
  this.getEntries = function (from, to, optsJSON) {
    try {
      let options = {}
      if (optsJSON) {
        options = JSON.parse(optsJSON)
      }
      return doGet({
        url: endpoints.entries,
        qParams: {
          startdate: from,
          enddate: to,
          daysChangedWithin: options.daysChangedWithin,
          userId: options.userId
        }
      })
    } catch (Exception) {
      return Promise.reject(new Error('400_Invalid optsJSON parameter'))
    }
  }
  /*
  * Returns a list of all entries with budget
  */
  this.getEntriesWithBudget = function (from, to, optsJSON) {
    try {
      let options = {}
      if (optsJSON) {
        options = JSON.parse(optsJSON)
      }
      return doGet({
        url: endpoints.entries,
        qParams: {
          startdate: from,
          enddate: to,
          includeBudget: true,
          daysChangedWithin: options.daysChangedWithin,
          userId: options.userId
        }
      })
    } catch (Exception) {
      return Promise.reject(new Error('400_Invalid optsJSON parameter'))
    }
  }
  /*
  * Returns a list of entries for project
  */
  this.getProjectEntries = function (from, to, projectId, optsJSON) {
    try {
      let options = {}
      if (optsJSON) {
        options = JSON.parse(optsJSON)
      }
      return doGet({
        url: endpoints.entry + projectId,
        qParams: {
          startdate: from,
          enddate: to,
          daysChangedWithin: options.daysChangedWithin,
          userId: options.userId
        }
      })
    } catch (Exception) {
      return Promise.reject(new Error('400_Invalid optsJSON parameter'))
    }
  }
  /*
  * Returns a list of entries with budget for project
  */
  this.getProjectEntriesWithBudget = function (from, to, projectId, optsJSON) {
    try {
      let options = {}
      if (optsJSON) {
        options = JSON.parse(optsJSON)
      }
      return doGet({
        url: endpoints.entry + projectId,
        qParams: {
          startdate: from,
          enddate: to,
          includeBudget: true,
          daysChangedWithin: options.daysChangedWithin,
          userId: options.userId
        }
      })
    } catch (Exception) {
      return Promise.reject(new Error('400_Invalid optsJSON parameter'))
    }
  }
  /*
  * Adds an entry.
  */
  this.addEntry = function (jsonData) {
    return doPost({ url: endpoints.entries, jsonData })
  }
}
// Exports
module.exports = APIConsumer
