const express = require("express");
const users = require('./routes/userRoute')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// importing Auth context
const auth = require('./controller/authContoller')

// Register
app.post("/register", auth.register);

// Login and setup 2 factor authication
app.post("/login",auth.login);

// Verify Email
app.get("/verifyEmail",auth.verifyEmail);

// Forget Password
app.post("/forgetPassword",auth.forgetPassword);

// Reset Passwords
app.post("/resetPassword/:id/:token",auth.resetPassword);
// OTP verification
app.post("/verifyOTP",auth.verifyOTP);
//otp share
app.post("/resendOtp",auth.resendOtp);
// Handle multiple routes like 2FA and User details
app.use("/user",users);

app.get('/',(req,res)=>{
    res.send("Welcome to authentication and authorization on Boarding APIS")
})


module.exports = app;