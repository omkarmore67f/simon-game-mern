const express = require('express');
const router = express.Router();
const { submitScore, getGameHistory } = require('../controllers/game.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateScore } = require('../middleware/validate.middleware');

router.post('/score', protect, validateScore, submitScore);
router.get('/history', protect, getGameHistory);

module.exports = router;
