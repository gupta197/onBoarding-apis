const router = require('express').Router();
const {setup2fa,getUserDetail} = require('../controller/userController');
const auth = require("../middleware/auth");
// Enable and disble the 2fA
router.post('/2fa',auth,setup2fa);
// Get User Detail
router.get('/',auth,getUserDetail);


module.exports = router;