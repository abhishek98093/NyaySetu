const express = require('express');
const { authenticate, authorise } = require('../middleware/authMiddleware');
const {getFilteredLeads, getPoliceComplaints ,assignOfficerToComplaint,addCriminal,addMissingPerson, getAllMissingAndCriminals,deleteCriminal,deleteMissingPerson, updateMissingPerson, updateCriminal, awardStar} = require('../controller/policeController');

const router = express.Router();

router.get('/getPoliceComplaints', authenticate, authorise(['police']), getPoliceComplaints);
router.post('/assignOfficerToComplaint',authenticate,authorise(['police']),assignOfficerToComplaint);
router.post('/addCriminal',authenticate,authorise(['police']),addCriminal);
router.post('/addMissingPerson',authenticate,authorise(['police']),addMissingPerson);
router.get('/getAllMissingAndCriminals',authenticate,authorise(['police']),getAllMissingAndCriminals);
router.delete('/deleteCriminal/:id',authenticate,authorise(['police']),deleteCriminal);
router.delete('/deleteMissingPerson/:id',authenticate,authorise(['police']),deleteMissingPerson);
router.put('/updateMissingPerson/:id',authenticate,authorise(['police']),updateMissingPerson);
router.put('/updateCriminal/:id',authenticate,authorise(['police']),updateCriminal);
router.post('/getFilteredLeads',authenticate,authorise(['police']),getFilteredLeads)
router.post('/awardStar',authenticate,authorise(['police']),awardStar);
module.exports = router;
