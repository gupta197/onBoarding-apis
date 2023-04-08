const router = require('express').Router();
const {setup2fa,updateUserDetail} = require('../controller/userController');
const auth = require("../middleware/auth");
// Enable and Disable 2 factor authication
router.post('/2fa',auth,setup2fa);
// Get User detail
router.post('/:id',auth,updateUserDetail);

router.get('/',auth,async(req,res)=>{
    res.send("Welcome to User Page")
});


module.exports = router;