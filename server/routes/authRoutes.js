const express=require('express');
const router=express.Router();
const {signup,sendotp, verify_Otp,login, resetPassword}=require('../controller/authController');
router.post('/signup',signup);
router.post('/sendotp',sendotp);
router.post('/verify-otp',verify_Otp);
router.post('/login',login);
router.patch('/resetpassword',resetPassword)
module.exports=router;