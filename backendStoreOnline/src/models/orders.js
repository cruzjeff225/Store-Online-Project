const express = require('express');
const router = express.Router();
const { getOrderDetails } = require('../controllers/orderController');

router.get('/:id', getOrderDetails);

module.exports = router;
