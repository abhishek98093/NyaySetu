const express=require('express');
const router=express.Router();
const {fetchStats, createPoliceOfficer}=require('../controller/adminController');
const { authenticate, authorise } = require('../middleware/authMiddleware');
router.get('/fetchStats',authenticate,authorise(['admin']),fetchStats);
router.post('/createPoliceOfficer',authenticate,authorise(['admin']),createPoliceOfficer);
module.exports=router;