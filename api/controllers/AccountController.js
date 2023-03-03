/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

    // dashboard Page
    dashboard: async function(req, res){
        // account id
        let _id = req.params._id;
        console.log('hjvgvgv', _id);

        // getting account from user model using populate 
        var account = await User.find({_id}).populate('accounts');
        console.log('gdfg',account);

        // getting object from array
        const result = account[0].accounts;
        console.log('all accounts',result);

        res.view(`user/dashboard`,{account: result, _id: _id})
    },


    // adding account concept
    create: function(req, res){
        // getting all account name which user need to add
        let accountName = req.body.accountName;
        console.log('body',req.body);

        // getting user id from middleware 
        let _id = req.userData.userId;
        console.log('hhhd',_id);
        
        // finding user - so to create account for particular user
        User.find({_id}, function(err, user){

            console.log('user123',_id);

            if(err) return res.negotiate(err);

            // creating account
            const account = Account.create({
                accountName: accountName,
                owner: _id, // owner : all the users in this current account 
                admin: _id  // admin : account admin which can do edit and delete
            }).fetch().then(result=>{

                console.log('result',result);

                // create array and push the object in it
                var createAccount = [];
                createAccount.push(result);
                console.log('gfdgfd', createAccount);

                return res.view('user/addAccount', {message: 'Account added successfully', err: '', userId: _id});
            })
    
        })
        
    },

    // add account Page
    addAccount: function(req, res) {
        // account id get through params
        let _id = req.params._id;

        // user id get through middleware
        let userId = req.userData.userId;

        res.view('user/addAccount',{_id:_id, userId:userId, message: '', err: null})
    },

    // delete a account concept
    deleteAccount : async function(req, res){
        try {
            // user id through middleware
            let loggedInUserId = req.userData.userId;
            console.log('ioui',loggedInUserId);

            // account id through params
            let _id = req.params._id;
            console.log('delete account id',_id);

            // find the account admin 
            Account.find({_id}).then(async function(docs){
                console.log('uytry',docs[0].admin);
                
                // if current logged-in user is same as admin user then perform this operation 
                if(loggedInUserId == docs[0].admin){

                    // finding all users in which this current account is added 
                    var user = await Account.find({_id}).populate('owner');
                    console.log('delete gdfg123',user);
                    const result = user[0].owner;
                    console.log('delete all owners',result);

                    // extracting all the users Id from users
                    const userid = []; 
                    for(let i=0; i < result.length; i++){
                        userid.push(result[i].id);
                    }
                    console.log('all ids of users', userid);

                    // performing delete operations using removeFromCollection
                    for(let i=0; i < userid.length; i++){

                        // removeFromCollection - which comes under many to many to association
                        await User.removeFromCollection(userid[i], 'accounts',_id ).exec(function(err) {
                            if (err) {
                            res.send(500, { error: "Database Error" });
                            }
                            console.log('deleted successfully');
                        });
                    
                    }

                    console.log("Deleted");

                    return res.status(200).json({
                        message: 'Deleted'

                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    },


    // update account Page
    updateAccount : function(req, res){

        // user id using middleware
        let loggedInUserId = req.userData.userId;
        console.log('ioui7868',loggedInUserId);

        // account id through params
        let _id = req.params._id;
        console.log('232pgdf',_id);

        // finding admin from account id
        Account.find({_id}).then(function(docs){
            console.log('6565 one account', docs[0]);
            console.log('uytry',docs[0].admin);
            
            // if current logged-in user is same as admin user then perform this operation 
            if(loggedInUserId == docs[0].admin){
                return res.view('user/updateAccount',{account: docs[0], loggedInUserId:loggedInUserId});
            }else{
                // otherwise update button got disabled
                console.log('not allowed');
                return res.view('user/accountNot',{account: docs[0], loggedInUserId:loggedInUserId});

            }
        });
      
    },

    // update account concept
    update : async function(req, res){

        // account id using params
        let _id = req.params._id;
        console.log('update account id',_id);
        // update data
        let data = req.body.accountName;
        console.log('data need to update as',data);

        // current logged in user id
        let loggedInUserId = req.userData.userId;
       
        // updating data of account 
        var updatedAccount = await Account.update({_id: _id})
        .set({
            accountName: data
        }).fetch();
      
        console.log("Updated succesfully", updatedAccount);
        return res.view('user/updateAccount', {account: updatedAccount, loggedInUserId:loggedInUserId});
       
    }

};

