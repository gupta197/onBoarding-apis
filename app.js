const express = require("express");
const users = require('./routes/userRoute')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// importing Auth context

const auth = require('./controller/authContoller')

// Register
app.post("/register", auth.register);

// Login
app.post("/login",auth.login);
app.get("/verifyEmail",auth.verifyEmail);
app.post("/forgetPassword",auth.forgetPassword);
app.post("/resetPassword/:id/:token",auth.resetPassword);
app.use("/user",users);

app.get('/',(req,res)=>{
    res.send("Welcome to Authication and Authsation")
})


module.exports = app;