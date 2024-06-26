const express = require("express");
require("./database/config");
const User = require("./database/User");
const Service = require("./database/Services");
const Booking = require("./database/BookNow");
let Counter = require("./database/Counter");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());


// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer transport verification failed:", error);
  } else {
    console.log("Nodemailer transport verified. Ready to send emails:", success);
  }
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Your OTP for Signup',
    text: `Your OTP is ${otp}`,
  };

  try {
    console.log("Attempting to send email to:", email);
    console.log("Mail options:", mailOptions);
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

// Temporary storage for OTPs (can be replaced with a database collection)
let otps = {};

//register - initiate OTP generation
app.post("/register", async (req, resp) => {
  console.log("Register endpoint hit");
  try {
      let existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
          console.log("User already registered with email:", req.body.email);
          return resp.status(400).json({ message: "User already registered" });
      }

      // Store user data temporarily or use another method to manage OTPs
      const userData = req.body;
      const otp = generateOTP();
      console.log("Generated OTP:", otp);
      otps[req.body.email] = { otp, ...userData };

      await sendOTPEmail(req.body.email, otp);
      console.log("OTP sent to email:", req.body.email);
      resp.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
      console.error("Error during OTP generation:", error);
      resp.status(500).json({ message: "Internal server error" });
  }
});

// Verify OTP and complete registration
app.post("/verify-otp", async (req, resp) => {
  console.log("Verify OTP endpoint hit");
  const { email, otp } = req.body;
  const tempData = otps[email];

  if (!tempData) {
      console.log("No OTP found for email:", email);
      return resp.status(400).json({ message: "Invalid OTP" });
  }

  if (tempData.otp !== otp) {
      console.log("Invalid OTP for email:", email);
      return resp.status(400).json({ message: "Invalid OTP" });
  }

  try {
      let user = new User(tempData);
      let result = await user.save();
      delete otps[email]; // Remove temp data after successful registration

      result = result.toObject();
      delete result.password;
      delete result.confirmPassword;

      console.log("User registered successfully:", result);
      resp.send(result);
  } catch (error) {
      console.error("Error during registration:", error);
      resp.status(500).json({ message: "Internal server error" });
  }
});

//register
// app.post("/register", async (req, resp) => {
//   try {
//     let existingUser = await User.findOne({ email: req.body.email });

//     if (existingUser) {
//       return resp.status(400).json({ message: "User already registered" });
//     }

//     let user = new User(req.body);
//     let result = await user.save();
//     result = result.toObject();
//     delete result.password;

//     resp.send(result);
//   } catch (error) {
//     console.error("Error during registration:", error);
//     resp.status(500).json({ message: "Internal server error" });
//   }
// });

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

async function updateCount(counterType) {
  try {
    let existingCounter = await Counter.findOne();

    if (!existingCounter) {
      const initialCounter = new Counter({
        totalServices: 50,
        totalServicesRequested: 35,
        totalServicesConfirmed: 25,
        totalServicesCompleted: 15
      });
      await initialCounter.save();
    } else {
      if (counterType==="Registered"){
        existingCounter.totalServices+=1;
        await existingCounter.save();
      }
      else if(counterType==="Pending"){
        existingCounter.totalServicesRequested+=1;
        await existingCounter.save();
       }
       else if(counterType==="Confirmed"){
        existingCounter.totalServicesConfirmed+=1;
        await existingCounter.save();
       }
       else if(counterType==="Completed"){
        existingCounter.totalServicesCompleted+=1;
        await existingCounter.save();
       }
    }
  } catch (error) {
    console.error('Error updating counter:', error);
  }
}

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
  let category = req.body.category;
  let userId = req.body.userId;

  try {
    const existingUser = await Service.findOne({ userId, category });
    if (existingUser) {
      return resp.send({
        result: "You have Already Registered with this service",
      });
    } else {
      let service = new Service(req.body);
      let result = await service.save();
      await updateCount("Registered");
      resp.send(result);
    }
  } catch (error) {
    console.error(`Error saving service: ${error}`);
    resp.status(500).send({ message: "Internal Server Error" });
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

// app.get("/showProfile", async(req,resp)=>{
//     let user = req.query.userId;
//     let result = await Service.find({userId : user});
//     resp.send(result)
// });

app.get("/showServices", async(req,resp)=>{
  let user = req.query.userId;
  let result = await Service.find({userId : user});
  resp.send(result)
});
app.get("/showProfile", async (req, resp) => {
  const userId = req.query.userId; // Assuming userId is passed as a query parameter

  try {
      const userProfile = await User.findOne({ _id: userId });

      if (!userProfile) {
          return resp.status(404).json({ error: "User profile not found" });
      }

      resp.json(userProfile);
  } catch (error) {
      resp.status(500).json({ error: error.message });
  }
});


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

app.post("/bookService", async (req, resp) => {
  try {
    let category = req.body.category;
    let serviceProviderId = req.body.serviceProviderId;
    let serviceTakerId = req.body.serviceTakerId;
    
    const existingUser = await Booking.findOne({ category, serviceProviderId, serviceTakerId });
    if(existingUser){
      if (existingUser.currentStatus=="Pending" || existingUser.currentStatus=="Confirmed") {
        return resp.send({
          result: "You have Already Booked this service with this user",
        });
      }
      else {
     
        let bookingData = { ...req.body, currentStatus: "Pending"};
        let booking = new Booking(bookingData);
        await updateCount("Pending");
        let result = await booking.save();
        resp.send(result);
      }
    }
     else {
      let bookingData = { ...req.body, currentStatus: "Pending"};
      let booking = new Booking(bookingData);
      await updateCount("Pending");
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

//show all Booking's that are ongoing
app.get("/showBookingRequestsConfirmed",async(req,resp)=>{
  let currentUser = req.query.userId;
  let currentStatus=req.query.status;
  let result = await Booking.find({serviceProviderId : currentUser,currentStatus : currentStatus});
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
    await updateCount(currentStatus);
    resp.send(result);
  } catch (error) {
    console.error("Error handling accepting request:", error);
    resp.status(500).send({ error: "Internal Server Error" });
  }
});

app.put("/updateBooking",async(req,resp)=>{
  console.log("welcome in update boking")
  let bookingId = req.body._id;
  console.log(bookingId)
  let result=  await Booking.updateOne(
    {_id:bookingId},{$set:req.body}
)
console.group(result);
if(result.matchedCount==1){
  resp.send({ result: "Result successfully Updated" });
}
})

//Overview overall Services on the app 
app.get("/overview",async(req,resp)=>{
  let result = await Counter.find();
  if(result){
    console.log(result);
    resp.send(result)
  }
})

app.get("/overviewProfile", async(req,resp)=>{
  let user = req.query.userId;
  let result = await User.find({_id : user});
  resp.send(result)
});

//update password
app.post("/updatepassword", async (req, resp) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    let user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return resp.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches
    if (user.password !== oldPassword) {
      return resp.status(400).json({ message: "Old password is incorrect" });
    }

    // Update the password
    user.password = newPassword;
    user.confirmPassword = newPassword;
    await user.save();

    resp.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    resp.status(500).json({ message: "Internal server error" });
  }
});



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