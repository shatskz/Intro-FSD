const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    id : {
        type : String
    },
    password : {
        type : String
    },
    token : {
        type : String
    }
    
});

//creating a comparePassword method
//cb = callback
userSchema.methods.comparePassword = function(inputPassword, cb) {
    var user = this; //will be user1 because method is called on user1 in index.js

    if(inputPassword === user.password) {
        return cb(null, true); //parameters mean that no error and passwords match
    } else {
        return cb(null, false); //no error but passwords don't match
    }
}

userSchema.methods.createToken = function(cb) {
    var user = this;
    //fsd is encrypted key (could use any key)
    var token = jwt.sign(user._id.toHexString(), "fsd"); //all tokens based on hexadecimal id

    user.token = token;

    //will update user since already exists; goes back to cb function
    user.save((err, user) => {
        if(err) return cb(err, null);
        return cb(null, user);
    });
}

//static because shared across all user objects 
userSchema.statics.findByToken = function(token, cb) {
    //decrypt ID
    jwt.verify(token, 'fsd', (err, decoded) => {
        //What does decoded actually mean?
        User.findOne({ _id : decoded}, (err, user) => {
            if(err) return cb(err, null);
            if(!user) return cb(err, null)
            
            //error field is null and user is user
            return cb(null, user);
        })
    })

}

const User = mongoose.model('user', userSchema);
module.exports = { User };