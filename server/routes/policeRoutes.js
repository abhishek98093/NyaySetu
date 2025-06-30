const express = require('express');
const { authenticate, authorise } = require('../middleware/authMiddleware');
const { getPoliceComplaints } = require('../controller/policeController');

const router = express.Router();

router.get('/getPoliceComplaints', authenticate, authorise(['police']), getPoliceComplaints);

module.exports = router;
