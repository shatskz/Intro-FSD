const { User } = require("../models/User"); //imported user file to use findByToken()


let auth = function(req, res, next) {
    //Step 1: Get the token
    var token = req.cookies.x_auth;

    //decrypt ID that was encrypted in createToken method
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) res.json({ isAuth : false }); //if user is empty

        req.token = token;
        req.user = user; //get user info of whoever is logged in right now
        next(); //if you get here, go to next operation that you were supposed to do before coming to this middleware
    });

    //escape here and go back to index.js after middleware
    next();
}


module.exports = ( auth );