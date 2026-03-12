const express = require('express');
const router = express.Router();
const modController = require('../controllers/moderationController');

router.post('/review', modController.createReview);
router.post('/report', modController.reportJob);
router.get('/data', modController.getModerationData);

module.exports = router;
