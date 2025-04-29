// routes/ordersRoutes.js
const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// Aquí:
router.get('/', ordersController.getOrders); 

module.exports = router;
