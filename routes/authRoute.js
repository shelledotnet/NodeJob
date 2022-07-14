const express=require('express')
const router=express.Router();
const authenticaionMiddleware=require('../middlewear/authMiddlewear')
const {login,register}=require('../Controllers/authController')


//register will  be protected by the authenticaionMiddleware means anytime anyone  
//want to reach the register will have to pass throuhg authentication
//router.get('/register',authenticaionMiddleware,register);

router.post('/register',register);
router.post('/login',login);

module.exports=router;