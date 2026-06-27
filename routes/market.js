const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketControllar');
const protectRoute = require('../middleware/authMiddleware');


router.get('/history/all', protectRoute, marketController.getAlertHistory);

router.get('/:coin', marketController.getMarketData);

router.post('/threshold', protectRoute, marketController.calculateThreshold);

router.delete('/alert/:id', protectRoute, marketController.deleteAlert);

module.exports = router;