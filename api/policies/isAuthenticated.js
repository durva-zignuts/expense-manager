const jwt = require('jsonwebtoken');
// middleware
module.exports = function(req, res, proceed){

    try{

        const token = req.cookies.access_token;
        // if not token then redirect to login page
        if(!token){
            return res.redirect('/login')
        }

        console.log(token);
        // verify jwt authorisation
        const decoded = jwt.verify(token, 'secret'); 
        console.log("decoded",decoded);

        // userdata
        req.userData = decoded;
        proceed();

    } catch(error){
        // if not token then redirect to login page
        return res.redirect('/login');

    }

}