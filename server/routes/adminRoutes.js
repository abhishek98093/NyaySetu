const express=require('express');
const router=express.Router();
const {fetchStats}=require('../controller/adminController');
const { authenticate, authorise } = require('../middleware/authMiddleware');
router.get('/fetchStats',authenticate,authorise(['admin']),fetchStats);
module.exports=router;