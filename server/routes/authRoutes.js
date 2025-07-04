const express=require('express');
const router=express.Router();
const {signup,sendotp, verifyOtpCont,login, resetPassword}=require('../controller/authController');
router.post('/signup',signup);
router.post('/sendotp',sendotp);
router.post('/verify-otp',verifyOtpCont);
router.post('/login',login);
router.patch('/resetpassword',resetPassword)
module.exports=router;