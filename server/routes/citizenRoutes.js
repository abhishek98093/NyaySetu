const express=require('express');
const { getUserDetails,submitVerification } = require('../controller/citizenController');
const router=express.Router();
router.get('/userDetails/:id',getUserDetails);
router.put('/submitVerification',submitVerification);

module.exports=router;