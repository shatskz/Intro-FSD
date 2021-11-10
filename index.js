//server
const { response } = require('express');
const express = require('express');
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
const { auth } = require('./middleware/auth');

app.listen(port, () => {
    console.log(`Listening on port # ${port}`)
})

//database
const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://zshat15:shat011502@cluster0.b9gvm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(console.log("MongoDB Connected!"))
    .catch(err => {console.log(err)});

// app.get('/', (req, res) => {
//     res.send('Testing successful');
// })

//error will appear on local host
// app.post('/test', (req, res) => {
//     res.send('POST testing is successful');
// })

//REST API Call - Sign Up
const { User } = require('./models/User');

app.post('/signup', (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if(err) return res.json({ registerSuccess : false});
    });
        return res.status(200).json({ registerSuccess : true });
})

// Login - Sesssion #4
app.post('/login', (req, res) => {
    //1. Find whether or not ID exists
    //if id is found in body requesst find the id
    User.findOne({id : req.body.id}, (err, user1) =>{
        if(err) return res.jason({ loginSuccess : false })
        //if no error but user1 not found, it's a null document
        if(!user1) res.json({ loginSuccess : false, msg : "ID not found"});

    
    //2. If ID exists, compare the password with the one in the DB
        user1.comparePassword(req.body.password, (err, isMatch) => {
            if(err) return res.json({ loginSuccess : false});
            if(!isMatch) return res.json({ loginSuccess : false, msg : "PW does not match!" });
            
            //3. Create a token and save it to the web cookie
            //if user gets here, we know user can be logged in
            user1.createToken((err, user) => {
                if(err) return res.json({ loginSuccess : false, msg : "createToken err"});
                
                //Save the Token into the cookie
                return res.cookie('x_auth', user2.token)
                        //can all be one line but easier for readability
                        .status(200)
                        .json({ loginSuccess : true, token : user2.token });
            })
        })
})
})

// function comparePassword{

// }


//go to auth middleware function first before doing this function
//we do it separately becuase need to authenticate many times 
app.get('/auth', auth, (req, res) => {
    return res.json({
        _id : req.user._id,
        id : req.user.id //user attached from middleware
    });
})

app.get('/logout', auth, (req, res) => {
    //id's may not be unique but _id's are unique
    //Reset token
    User.findByIdAndUpdate({ _id : req.user._id }, { token : "" }, (err, user) => { //req.user from middleware
        if(err) return res.json({ logoutSuccess : false });

        //status 200 means everything went well
        return res.staatus(200).json({ logoutSuccess : true });
    }) 
})