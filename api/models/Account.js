/**
 * Account.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    accountName: {
      type: 'string',
      required: true,
    },

    // many to many associations (account & user)
    owner:{
      collection : 'user',
      via: 'accounts'
    },

    // one to many association (account & transaction)
    transactions: {
      collection: 'transaction',
      via: 'account'
    },

    // one - way association (current account admin)
    admin:{
      model: 'user'
    }

  },

};

