const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.getJobs);
router.post('/', jobController.createJob);
router.post('/:id/view', jobController.incrementJobViews);
router.get('/recommendations/:userId', jobController.getRecommendations);

module.exports = router;
