/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const UserController = require("../api/controllers/UserController");

module.exports.routes = {

  // User Controllers

  // login Page --> Home Page
  'GET /login' : UserController.loginPage,

  // signup Page
  'GET /signup': UserController.signupPage,

  // signup concept
  'POST /signup': 'UserController.signup',

  // login concept
  'POST /login': 'UserController.login',

  // logout concept
  '/logout': 'UserController.logout',

  // add user concept
  'POST /add/:_id': 'UserController.add',

  // add user Page
  'GET /addUser/:_id': 'UserController.addUser',

  // view user Page
  'GET /viewUsers/:_id': 'UserController.viewUsers',

  // verify Mail Page
  'GET /verifyMail': 'UserController.verifyMail',

  'POST /verify': 'UserController.verify',
  
  'GET /viewProfile/:_id': 'UserController.viewProfile',

  'GET /updateProfile/:_id': 'UserController.updateProfile',

  'PUT /updatePro/:_id' : 'UserController.updatePro',
  

  // Account Controller

  // dashboard Page
  'GET /dashboard/:_id': 'AccountController.dashboard',

  // add account concept
  'POST /createAccount' : 'AccountController.create',

  // add account Page
  'GET /addAccount': 'AccountController.addAccount',

  // delete account concept
  'DELETE /deleteAccount/:_id' : 'AccountController.deleteAccount',

  // update account Page
  'GET /updateAccount/:_id': 'AccountController.updateAccount',

  // update account concept
  'PUT /update/:_id' : 'AccountController.update',



  // Transaction Controller

  // add transaction Page
  'GET /addTransaction/:_id' : 'TransactionController.addTransaction',

  // view transaction Page
  'GET /viewTransaction/:_id' : 'TransactionController.viewTransaction',

  // add transaction concept
  'POST /addTransact/:_id' : 'TransactionController.addTransact',

  // delete transaction concept
  'DELETE /deleteTransaction/:_id' : 'TransactionController.deleteTransaction',

  // update transaction Page
  'GET /updateTransaction/:_id' : 'TransactionController.updateTransaction',

  // update transaction concept
  'PUT /updateTransact/:_id' : 'TransactionController.updateTransact',

 

};
