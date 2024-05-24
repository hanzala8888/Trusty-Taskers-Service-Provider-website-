const express=require('express');
require('./database/config');
const User = require('./database/User');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//register
app.post("/register", async (req, resp) => {
    try {
        // Check if the email already exists
        let existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            // If user already exists, send an error message
            return resp.status(400).json({ message: "User already registered" });
        }

        // If email does not exist, proceed with registration
        let user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        delete result.password;

        resp.send(result);
    } catch (error) {
        // Handle any errors
        console.error("Error during registration:", error);
        resp.status(500).json({ message: "Internal server error" });
    }
    
});


//login
app.post("/login", async (req, resp) => {
    console.log(req.body);
    if(req.body.password && req.body.email)
    {
        let user = await User.findOne(req.body).select("-password");
        if(user)
        {
            resp.send(user);
        }
        else
        {   
            resp.send({result:'No User Found'});
        }
    }
    else
    {
        resp.send({result:'No User Found'});
    }
});

function verifyToken(req, resp, next){
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
        console.warn("MC", token);
    jwt.verify(token, secretKey, (err, valid) => {
        if(err){
            resp.status(401).send({result: "Please provide valid token"});
        }   
        else{
            next();
        }
    })
    }
    else{
        resp.status(403).send({result: "Please add token with header"});
    }
}


//forgot password
app.post('/forgotpassword', async (req, resp) => {
    /*const{email} = req.body;
    User.findOne({email:email})
    .then(user => {
        if(!user){
            return resp.send({Status: "User not existed"});
        }
    })*/
});
app.listen(4500);