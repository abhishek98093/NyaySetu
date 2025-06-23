const express=require('express');
const router=express.Router();
const {fetchStats, createPoliceOfficer, getFilteredPolice}=require('../controller/adminController');
const { authenticate, authorise } = require('../middleware/authMiddleware');
router.get('/fetchStats',authenticate,authorise(['admin']),fetchStats);
router.post('/createPoliceOfficer',authenticate,authorise(['admin']),createPoliceOfficer);
router.get('/getFilteredPolice',authenticate,authorise(['admin']),getFilteredPolice);
module.exports=router;