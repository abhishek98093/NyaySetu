const express=require('express');
const { getUserDetails,submitVerification ,submitComplaint} = require('../controller/citizenController');
const {authenticate,authorise} =require('../middleware/authMiddleware');
const router=express.Router();
router.get('/userDetails',authenticate,authorise(['police','admin','citizen']),getUserDetails);
router.put('/submitVerification',authenticate,authorise(['citizen']),submitVerification);
router.post('/submitComplaint',authenticate,authorise(['citizen']),submitComplaint)

module.exports=router;