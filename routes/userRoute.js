const router = require('express').Router();
const {setup2fa,updateUserDetail} = require('../controller/userController');
const auth = require("../middleware/auth");
router.post('/2fa',auth,setup2fa);
router.post('/:id',auth,updateUserDetail);
router.get('/',auth,async(req,res)=>{
    res.send("Welcome to User Page")
});


module.exports = router;