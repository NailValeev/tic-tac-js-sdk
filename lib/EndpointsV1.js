/**
 * Module for handling of Tic-Tac API v1 endpoints
 * @author Nail Valeev
 * @version 1.0.0
 */
function EndpointsV1 () {
  let baseURL = 'https://www.tictacmobile.com/api/rest/v1/'

  /*
  * Methods allowed: GET & POST
  */
  this.users = baseURL + 'users'
  /*
  * Methods allowed: GET, additional path parameter 'userid' should be specified
  */
  this.user = baseURL + 'users/'

  /*
  * Methods allowed: GET & POST
  * GET QUERY parameters, OPTIONAL: number & includeBudget & includeMembers
  */
  this.projects = baseURL + 'projects'

  /*
  * Methods allowed: GET & POST
  * GET QUERY parameters, MANDATORY: startdate & enddate, OPTIONAL: daysChangedWithin & userId & includeBudget
  */
  this.entries = baseURL + 'entries'
  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate, OPTIONAL: daysChangedWithin & userId & includeBudget
  */
  this.entry = baseURL + 'entries/' // additional path parameter 'projectid' should be specified

  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate, OPTIONAL: projectId & forWorkgroup & forCostcenter & forDepartment
  */
  this.timeplans = baseURL + 'timeplans'
  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate, OPTIONAL: projectId
  */
  this.timeplan = baseURL + 'timeplans/'

  /*
  * Methods allowed: GET
  * Parameters : none, all parameters will be ignored
  */
  this.pricelists = baseURL + 'pricelists'

  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate, OPTIONAL: groupBy
  */
  this.projectreports = baseURL + 'projectreports'

  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate
  */
  this.userreports = baseURL + 'userreports'
  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate, MANDATORY PATH parameter: userid
  */
  this.userreport = baseURL + 'userreports/'

  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate
  */
  this.normaltimes = baseURL + 'normaltimes'
  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate, MANDATORY PATH parameter: listnumber (0-6)
  */
  this.normaltime = baseURL + 'normaltimes/'

  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate
  */
  this.invoices = baseURL + 'invoices'

  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate, MANDATORY PATH parameter: projectid
  */
  this.invoice = baseURL + 'invoices/'

  /*
  * Methods allowed: GET
  * GET QUERY parameters, MANDATORY: startdate & enddate
  */
  this.utilizations = baseURL + 'utilizations'
}
// Exports
module.exports = EndpointsV1
