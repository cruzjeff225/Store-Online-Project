const express = require('express');
const CartController = require('../controllers/cartController.js');

const router = express.Router();

// Agregar producto al carrito
router.post('/cart', CartController.addToCart);

// Obtener la cantidad de productos en el carrito
router.get('/cart/count/:idUsuario', CartController.cartCount);

// Actualizar la cantidad de un producto en el carrito
router.put('/cart/update', CartController.updateCartQuantity);

// Eliminar un producto específico del carrito
router.delete('/cart/remove', CartController.removeFromCart);

// Vaciar completamente el carrito
router.delete('/cart/clear/:idUsuario', CartController.clearCart);

module.exports = router;

