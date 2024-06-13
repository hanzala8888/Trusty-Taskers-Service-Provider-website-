const express = require("express");
require("./database/config");
const User = require("./database/User");
const Service = require("./database/Services");
//const Booking = require("./database/BookNow");
const Booking = require("./database/BookNow");
const cors = require("cors");
// const Services = require("./database/Services");

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
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      resp.send(user);
    } else {
      resp.send({ result: "No User Found" });
    }
  } else {
    resp.send({ result: "No User Found" });
  }
});

function verifyToken(req, resp, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    console.warn("MC", token);
    jwt.verify(token, secretKey, (err, valid) => {
      if (err) {
        resp.status(401).send({ result: "Please provide valid token" });
      } else {
        next();
      }
    });
  } else {
    resp.status(403).send({ result: "Please add token with header" });
  }
}

//forgot password
app.post("/forgotpassword", async (req, resp) => {
  /*const{email} = req.body;
    User.findOne({email:email})
    .then(user => {
        if(!user){
            return resp.send({Status: "User not existed"});
        }
    })*/
});

//Add New Service
app.post("/services", async (req, resp) => {
  let service;
  let category = req.body.category;
  let userId = req.body.userId;

  const existingUser = await Service.findOne({ userId, category });
  if (existingUser) {
    return resp.send({
      result: "You have Already Registered with this service",
    });
  } else {
    let service = new Service(req.body);
    let result = await service.save();
    resp.send(result);
  }
});

//Viewing Services
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

app.get("/showProfile", async(req,resp)=>{
    let user = req.query.userId;
    let result = await Service.find({userId : user});
    resp.send(result)
})

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
})

app.delete("/Delete",async(req,resp)=>{
  let category = req.query.category;
  let userId = req.query.userId;
  
  let data=  await Service.deleteOne({category:category,userId:userId})
  console.log(data)
  resp.send("Successfully Deleted")
})

//Book a new Service
// app.post("/bookService", async (req, resp) => {
//   try {
// let category=req.body.category;
// let serviceProviderId=req.body.serviceProviderId;
// let serviceTakerId=req.body.serviceTakerId;

// const existingUser = await Booking.findOne({category,serviceProviderId,serviceTakerId})
// if (existingUser) {
//   return resp.send({
//     result: "You have Already Booked this service with this user",
//   });
// }else{ 
//   let bookingData = {...req.body,currentStatus:"Pending"}
//     console.log("Request Body:", req.body);
//     let booking = new Booking(bookingData);
//     let result = await booking.save();
//     console.log("Saved Booking:", result);
//     resp.send(result);
// }
//   } catch (error) {
//     console.error("Error saving booking:", error);
//     resp.status(500).send({ error: "Internal Server Error" });
//   }
// });

app.post("/bookService", async (req, resp) => {
  try {
    let category = req.body.category;
    let serviceProviderId = req.body.serviceProviderId;
    let serviceTakerId = req.body.serviceTakerId;
    
    const existingUser = await Booking.findOne({ category, serviceProviderId, serviceTakerId });
    if (existingUser) {
      return resp.send({
        result: "You have Already Booked this service with this user",
      });
    } else {
      let bookingData = { ...req.body, currentStatus: "Pending" };
      let booking = new Booking(bookingData);
      let result = await booking.save();
      resp.send(result);
    }
  } catch (error) {
    console.error("Error saving booking:", error);
    resp.status(500).send({ error: "Internal Server Error" });
  }
});


//Show Booking's
app.get("/viewBookingDetails", async (req, res) => {
  let currentUser = req.query.userId;
  try {
      let result = await Booking.find({ serviceTakerId: currentUser }); // or serviceProviderId: currentUser
      if (result) {
          res.send(result);
      } else {
          res.status(404).send({ message: "No bookings found" });
      }
  } catch (error) {
      res.status(500).send({ message: "Error fetching bookings" });
  }
});


//show all Booking's that are pending to Service Provider 
app.get("/showBookingRequests",async(req,resp)=>{
  let currentUser = req.query.userId;
  let result = await Booking.find({serviceProviderId : currentUser,currentStatus : "Pending"});
  if(result){
    resp.send(result)
  }
})

//show all Booking's that are ongoing
app.get("/showBookingRequestsConfirmed",async(req,resp)=>{
  let currentUser = req.query.userId;
  let result = await Booking.find({serviceProviderId : currentUser,currentStatus : "Confirmed"});
  if(result){
    resp.send(result)
  }
})

//Handling Accepting Request By Service Provider
app.put("/handleBookingRequest", async (req, resp) => {
  try {
    let bookingId = req.query.bookingId;
    let currentStatus=req.body.status;
    let result = await Booking.updateOne({ _id: bookingId }, { $set: { currentStatus: currentStatus} });
    resp.send(result);
  } catch (error) {
    console.error("Error handling accepting request:", error);
    resp.status(500).send({ error: "Internal Server Error" });
  }
});

//Handling Cancelation Of Any Order



app.listen(4500);

  // app.put("/updateProfile", async (req, resp) => {
  //   let category = req.body.category;
  //   let userId = req.body.userId;
  //   let imageUrl = req.body.image;
  
  //   try {
  //       // Update the image URL in the Services collection
  //       let serviceUpdate = await Service.updateOne(
  //           { category: category, userId: userId }, 
  //           { $set: req.body }
  //       );
  
  //       // Update the image URL in the Users collection
  //       let userUpdate = await User.updateOne(
  //           { _id: userId }, 
  //           { $set: { image: imageUrl } }
  //       );
  
  //       if (serviceUpdate.matchedCount == 1 && userUpdate.matchedCount == 1) {
  //           resp.send({ result: "Result successfully Updated" });
  //       } else {
  //           resp.send({ result: "Unsuccessful Updation" });
  //       }
  //   } catch (error) {
  //       console.error('Error updating profile:', error);
  //       resp.status(500).send('Failed to update profile');
  //   }
  // });





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
