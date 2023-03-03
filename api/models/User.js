/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: 'string',
      required: true,
      custom: function(value) {
        // • be a string
        // • be at least 8 characters long
        // • contain at least one number
        // • contain at least one letter
        return _.isString(value) && value.length >= 8 && value.match(/[a-z]/i) && value.match(/[0-9]/);
      },
    },

    // many to many association (account & users - owner)
    accounts:{
      collection: 'account',
      via: 'owner'
    },

    otp:{
      type: 'number'
    }, 

    phoneNumber: {
      type: 'string'
    },

    country:{
      type: 'string'
    },
    
  },

  customToJSON: function() {
    return _.omit(this, ['password']); 
  },


  // before creating a password encrypting it
  beforeCreate: function(values, cb) {
   
      // Hash password
      bcrypt.hash(values.password, 10, function(err, hash) {

          if (err) return cb(err);

          console.log(hash);
          values.encryptedPassword = hash;

          //Delete the passwords so that they are not stored in the DB
          delete values.password;
          delete values.confirmation;

          //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
          cb();
      });
  },

  // signup create credentials
  signup: function(inputs, cb) {

    console.log('ghdh',inputs);

        User.create({
          name: inputs.name,
          email: inputs.email,
          password: inputs.password
        }).fetch().exec(cb)
    
  },

  // login credentials
  attemptLogin: function(inputs, cb) {

    // console.log(inputs);

    User.find({
      email: inputs.email,
    
    })
    .exec(cb)
    
  },

  

};

