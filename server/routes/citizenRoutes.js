const express=require('express');
const { getUserDetails,submitVerification ,submitComplaint, getComplaint} = require('../controller/citizenController');
const {authenticate,authorise} =require('../middleware/authMiddleware');
const router=express.Router();
router.get('/userDetails',authenticate,authorise(['police','admin','citizen']),getUserDetails);
router.put('/submitVerification',authenticate,authorise(['citizen']),submitVerification);
router.post('/submitComplaint',authenticate,authorise(['citizen']),submitComplaint);
router.get('/getComplaint',authenticate,authorise(['citizen']),getComplaint);

module.exports=router;