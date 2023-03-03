/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
var bcrypt = require('bcrypt');


module.exports = {

    // signup Page
    signupPage : function(req, res){
        res.view('user/signup', { err: null })
    },
    

    // signup concept
    signup: function(req, res){

        
        User.signup({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, async function(err, user){

            // error handling for signup
            if(err){
                if(err.code == 'E_UNIQUE' ){
                    console.log(err);
                    return res.view('user/signup', { err: 'Email already exsist' })
                }
                if(err.code == 'E_INVALID_NEW_RECORD'){
                    console.log(err);
                    return res.view('user/signup', { err: 'Create valid Password' })
                }
                console.log('err',err);
                return res.view('user/signup', { err: err })
            }

            console.log('user', user);
            
            // jwt authorisation for signup
            const token = jwt.sign({
                userId: user.id
            },
            'secret'
            );
            res.cookie("access_token", token, { // cookie used for signup and logout
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
            console.log('token',token);
            console.log(req.body.email);

            // after signup user gets the mail (nodemailer) - used helpers
            const greeting = await sails.helpers.welcomeMessage.with({email: req.body.email, password: req.body.password}); 
            console.log('greeting 1',greeting);

            user.otp = greeting;
            console.log('hgh97',user);

            // user id 
            let _id = user.id;
            User.find({_id}, async function(err, user){
                var updateUser = await User.update({ _id : _id})
                .set({
                    otp: greeting
                }).fetch();
                console.log('k989',updateUser);
            })

            // user id 
            // let _id = user.id;

            // find the current signup user and create default account when he gets signup
            User.find({_id}, function(err, user){

                console.log('user123',_id);
                if(err) return res.negotiate(err);
                
                const account = Account.create({
                    accountName: 'Default Account',
                    owner: _id,
                    admin: _id
                }).fetch().then(result=>{
                    console.log('result',result);
        
                    return res.redirect(`/viewAccounts`);
                })
        
            })
            return res.redirect('/verifyMail');
            // return res.redirect(`/dashboard/${_id}`);
           
        })

    },

    // login Page
    loginPage: function(req, res){
        res.view('pages/homepage', { err: null })
    },

    // login concept
    login: function(req, res){
    
        let successRedirect = '/';
        let invalidRedirect = '/login';
        console.log('qwer',req.body);

        User.attemptLogin({
            email: req.body.email,
            
        }, function(err, user){
            console.log('pioh',user);

            // without signup doing login error handling 
            if(user == '' || user.length == 0){
                res.view('pages/homepage', {err: 'User not exists'})
            }
            if(err) 
            { 
                return res.view('pages/homepage', { err: 'User not exists' })
            }

            if(!user){
                // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc., send a 200 response letting the user agent know the login was successful. (also do this if no `invalidRedirect` was provided)
                if(req.wantsJSON || !invalidRedirect){
                    return res.badRequest('Invalid username/password combination.');
                }
                // Otherwise if this is an HTML-wanting browser, redirect to /login.
                return res.redirect(invalidRedirect);
                
            }

            // encrypting password gets check using bcrypt
            bcrypt.compare(req.body.password, user[0].encryptedPassword, async function(err, result) {

                // if correct credentials are there then user can move to dashboard
                if(result) {
                    console.log('hfhfg',result);
                    let _id = user[0].id;
                    console.log('rtrt',_id);

                    // jwt authorisation for login
                    const token = jwt.sign({
                        userId: user[0].id
                    },
                    'secret'
                    );
                    res.cookie("access_token", token, { // cookie for login and logout
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                    })
                    
                	//password is a match - getting user id
                    console.log('rtrt',_id);

                    return res.redirect(`/dashboard/${_id}`);

                } else {
                	//password is not a match
                    return res.view('pages/homepage', { err: 'Email and password combination do not match' })
                }
            });
        });

    },

    // logout concept
    logout: function(req, res){
        // clear cookie for logout
         res.clearCookie('access_token');
         return res.redirect('/login');
        
    },

    verifyMail: function(req, res){
        res.view('user/verifyMail');
    },

    verify: async function(req, res){
        let _id = req.userData.userId;
        console.log('verify',_id);
        User.find({_id:_id}).then(async function(docs){
            console.log('jghjfgh',JSON.stringify(docs));
           
            if(req.body.otp==docs[0].otp){

                User.find({_id}, async function(err, user){
                    var updateUser = await User.update({ _id : _id})
                    .set({
                        otp: 0
                    }).fetch();
                    console.log('k989',updateUser);
                })

                console.log("You has been successfully registered");
                return res.redirect(`/dashboard/${_id}`);

            }
            else{
                console.log("otp is incorrect");
                // res.render('otp',{msg : 'otp is incorrect'});
            }
        })
    },

    // add user Page
    addUser: function(req, res) {
        // getting account id through params
        let _id = req.params._id;
        console.log('pgdf',_id);

        // getting user id through middleware
        let userId = req.userData.userId;

        // finding particular account in which user needs to add
        Account.find({_id}).then(function(docs){
            console.log('one account', docs[0]);
            
            res.view('user/addUser',{account: docs[0], userId: userId, message: '', err: null});
        });
       
    },

    // add user concept
    add: async function(req, res) {
        // data taken from admin
        let email = req.body.email;
        console.log('email',email);

        // getting account id through params
        let _id = req.params._id;
        console.log('pgdfgf',_id);

        var account = Account.find({_id}).then(async function(docs){
            const ele = User.find({email}).then(async function(docs){

                // finding user id through account 
                console.log('one user', docs);
                console.log('id of user',docs[0].id);
               
                let userid = docs[0].id;
                console.log('hhhd',userid);
            
                console.log('lfdsf', docs[0].id);
                
                // adding user in particular id of account using addtoCollection 
                var user = await Account.addToCollection(_id, 'owner').members(userid); // addToCollection - many to many method
                    
               
                res.view('user/addUser',{ userId: userid, message: 'User added successfully', err: '', account: docs[0]});
            })

        })
        
    },

    // viewing all users 
    viewUsers: async function(req, res){
        // getting account id through params
        let _id = req.params._id;
        console.log('view account id',_id);

        // getting user id through middleware
        let userId = req.userData.userId;

        // populating all the users in particular id of account
        var user = await Account.find({_id}).populate('owner');

        console.log('gdfg123',user);
        const result = user[0].owner;
        console.log('all owners',result);

        return res.status(200).view('user/viewUsers',{user: result, userId: userId});
    },

    viewProfile: function(req, res){
        let _id = req.userData.userId;
        console.log('user id', _id);
       User.findOne({_id}).then(function(docs){
            console.log('piuou',docs);
            res.status(200).view('user/viewProfile', {_id: _id, user:docs})
       })

    
    },

    updateProfile: function(req, res){
        let _id = req.userData.userId;
        console.log('user id', _id);
        User.findOne({_id: _id}).then(function(docs){
            console.log('lfghf',docs);
            res.view('user/updateProfile', {user: docs})
        })
    },

    updatePro: function(req, res){
        let _id = req.userData.userId;
        let name = req.body.name;
        let phoneNumber = req.body.phoneNumber;
        let country = req.body.country;
        console.log('iuuiy',req.body);
        console.log('gfdg',_id);
        User.find({_id}, async function(err, user){
            var updateUser = await User.update({ _id : _id})
            .set({
                name: name,
                phoneNumber: phoneNumber,
                country: country
            }).fetch();
            console.log('878k989',updateUser);
            return res.view('user/viewProfile', {user : updateUser, _id: _id})
        })
    }

};

