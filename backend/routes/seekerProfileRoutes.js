const express = require('express');
const router = express.Router();
const profileController = require('../controllers/seekerProfileController');

router.get('/:userId', profileController.getProfile);
router.post('/:userId', profileController.updateProfile);

module.exports = router;
