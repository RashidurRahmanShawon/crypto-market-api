const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketControllar');

router.get('/:coin', marketController.getMarketData);

router.post('/threshold', marketController.calculateThreshold);

router.delete('/alert/:id', marketController.deleteAlert);

module.exports = router;