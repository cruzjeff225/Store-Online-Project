const express = require('express');
const router = express.Router();
const { updateOrderStatus } = require('../controllers/orderController.js');

router.put('/estado/:idPedido', updateOrderStatus);

module.exports = router;