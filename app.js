const express = require('express');
const app = express();
const PORT = 4000 || process.env.PORT;

app.get('/',(req,res)=>{
    try {
        res.send("Welcome to OnBoarding APIS");
    } catch (error) {
        res.send("Something Went wrong",error)
    }

})
app.listen(PORT,()=> console.log(`App is listening on port http://localhost:${PORT}`))