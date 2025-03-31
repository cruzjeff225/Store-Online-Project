const express = require("express");
const CartItem = require("../models/CartItem"); // crear este modelo en la carpeta models
const router = express.Router();

// Obtener productos del carrito
router.get("/cart", async (req, res) => {
  try {
    const cart = await CartItem.find();
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    res.json({ cart, total });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

// Eliminar producto del carrito
router.delete("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await CartItem.findByIdAndDelete(id);
    const updatedCart = await CartItem.find();
    const total = updatedCart.reduce((acc, item) => acc + item.price, 0);
    res.json({ cart: updatedCart, total });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = router;
