const express=require('express');
require('./database/config');
const User = require('./database/User');
const Service = require('./database/Services');
//const bodyParser = require('body-parser');
//const nodemailer = require('nodemailer');

const cors = require('cors');

const app = express();
app.use(express.json());
//app.use(bodyParser.json());
app.use(cors());

//register
app.post("/register", async (req, resp) => {
    try {
        console.log(req.body);
        // Check if the email already exists
        let existingUser = await User.findOne({ email: req.body.email });
        let existingPhone = await User.findOne({ phone: req.body.phone });

        if (existingUser) {
            // If user already exists, send an error message
            return resp.status(400).json({ message: "User already registered" });
        }
        if (existingPhone) {
          // If user already exists, send an error message
          return resp.status(400).json({ message: "Phone already registered" });
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

//services listing
app.post("/services", async (req, resp) => {
    let service;
    let category = req.body.category;
    let userId = req.body.userId;

    const existingUser=await Service.findOne({userId,category});
    console.log(existingUser);
    if(existingUser){
        return resp.send({ result: 'You have Already Registered with this service' });
    }else{
        let service = new Service(req.body);
        let result = await service.save();
        resp.send(result);
    }
});

//Get services based on a category
app.get("/services", async (req, resp) => {
    let category = req.query.category;
    let userId = req.query.userId;
    let service;
    if (category) {
      service = await Service.find({ category: category });
    } else {
      service = await Service.find();
    }
    if (service.length > 0) {
      if (userId) {
        service = service.filter((service) => service.userId !== userId);
      }
  
      if (service.length > 0) {
        resp.send(service);
      } else {
        resp.send({ result: "No Product's Found" });
      }
    } else {
      resp.send({ result: "No services found" });
    }
  });

//search API to search services
app.get("/search/:key", async (req, resp) => {
    let result = await Service.find({
        "$or":[
            {name: {$regex:req.params.key}},
            {category: {$regex:req.params.key}}
        ]
    });
    resp.send(result);
});

//show profile API
app.get("/showProfile", async(req,resp)=>{
    let user = req.query.userId;
    let result = await Service.find({userId : user});
    resp.send(result)
});

//update profile API
app.put("/updateProfile",async(req,resp)=>{
    let category = req.body.category;
    let userId = req.body.userId;
    let result=  await Service.updateOne(
      {category:category,userId:userId},{$set:req.body}
  )
  console.group(result);
  if(result.matchedCount==1){
    resp.send({ result: "Result successfully Updated" });
  }
  });

//selete profile API
app.delete("/Delete",async(req,resp)=>{
    let category = req.query.category;
    let userId = req.query.userId;
    
    let data=  await Service.deleteOne({category:category,userId:userId})
    console.log(data)
    resp.send("Successfully Deleted")
  });


  app.listen(4500);





// function verifyToken(req, resp, next){
//     let token = req.headers['authorization'];
//     if(token){
//         token = token.split(' ')[1];
//         console.warn("MC", token);
//     jwt.verify(token, secretKey, (err, valid) => {
//         if(err){
//             resp.status(401).send({result: "Please provide valid token"});
//         }   
//         else{
//             next();
//         }
//     })
//     }
//     else{
//         resp.status(403).send({result: "Please add token with header"});
//     }
// }


// app.post('/send', (req, res) => {
//     const { name, email, message } = req.body;
  
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'your-email@gmail.com', // replace with your email
//         pass: 'your-email-password', // replace with your email password
//       },
//     });
  
//     const mailOptions = {
//       from: email,
//       to: 'awanhanzala6@gmail.com', // replace with the recipient's email
//       subject: 'New Message from Contact Form',
//       text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//     };
  
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return res.status(500).send(error.toString());
//       }
//       res.send('Email sent: ' + info.response);
//     });
//   });


//forgot password
// app.post('/forgotpassword', async (req, resp) => {
//     const{email} = req.body;
//     User.findOne({email:email})
//     .then(user => {
//         if(!user){
//             return resp.send({Status: "User not existed"});
//         }
//     })
// });
