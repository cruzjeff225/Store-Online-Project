import express from "express";
import Cart from "../models/cart.js";

const router = express.Router();

// Obtener total del carrito
router.get("/", async (req, res) => {
    try {
        const cart = await Cart.findOne();
        if (!cart) return res.json({ total: 0 });

        let subtotal = cart.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
        let iva = subtotal * 0.10;
        let total = subtotal + iva;

        res.json({ subtotal, iva, total });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

// Agregar producto al carrito
router.post("/add", async (req, res) => {
    try {
        let cart = await Cart.findOne();
        if (!cart) cart = new Cart({ products: [] });

        cart.products.push(req.body);
        await cart.save();
        res.json({ message: "Producto agregado" });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto" });
    }
});

export default router;
