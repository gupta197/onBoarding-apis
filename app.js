const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// importing Auth context

// Register
app.get('/',(req,res)=>{
    res.send("Welcome to Authication and Authsation")
})


module.exports = app;