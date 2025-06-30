const express = require('express');
const { authenticate, authorise } = require('../middleware/authMiddleware');
const { getPoliceComplaints ,assignOfficerToComplaint} = require('../controller/policeController');

const router = express.Router();

router.get('/getPoliceComplaints', authenticate, authorise(['police']), getPoliceComplaints);
router.post('/assignOfficerToComplaint',authenticate,authorise(['police']),assignOfficerToComplaint);

module.exports = router;
