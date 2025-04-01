const express = require('express');
const CartController = require('../controllers/cartController.js');

const router = express.Router();

router.post('/cart', CartController.addToCart);
router.get('/cart/count/:idUsuario', CartController.cartCount);

module.exports = router;