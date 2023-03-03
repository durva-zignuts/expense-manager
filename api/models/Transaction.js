/**
 * Transaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    types:{
      type: 'string',
      required: true,
    },

    amount:{
      type: 'number',
      required: true,
    },

    date:{
      type: 'string',
      required: true,
    },

    // one to many association (account & transaction)
    account: {
      model: 'account'
    },

    // one - way association (current admin)
    admin:{
      model: 'user'
    },
    

  },

};

