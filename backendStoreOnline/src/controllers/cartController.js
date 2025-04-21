const Cart = require('../models/cart.js');

const CartController = {
    addToCart: async (req, res) => {
        const { idUsuario, idProducto, cantidadProducto } = req.body;
        try {
            const existingStock = await Cart.getStockProduct(idProducto);
            if (existingStock < cantidadProducto) {
                console.log('Stock insuficiente');
                return res.status(400).json({ message: 'Stock insuficiente' });
            }

            const adding = { idUsuario, idProducto, cantidadProducto };
            const result = await Cart.addToCart(adding);

            if (result.affectedRows > 0) {
                console.log('Producto agregado al carrito');
                return res.status(200).json({ message: 'Producto agregado al carrito' });
            } else {
                console.log('No se pudo agregar al carrito');
                return res.status(500).json({ message: 'No se pudo agregar al carrito' });
            }

        } catch (error) {
            console.log('Error en la función addToCart:', error);
            res.status(500).json({ message: 'Error al agregar producto al carrito' });
        }
    },

    updateCartQuantity: async (req, res) => {
        const { idUsuario, idProducto, nuevaCantidad } = req.body;
        try {
            if (nuevaCantidad < 1) {
                return res.status(400).json({ message: 'La cantidad no puede ser menor a 1' });
            }

            const existingStock = await Cart.getStockProduct(idProducto);
            if (nuevaCantidad > existingStock) {
                return res.status(400).json({ message: 'Stock insuficiente' });
            }

            const result = await Cart.updateQuantity(idUsuario, idProducto, nuevaCantidad);
            if (result.affectedRows > 0) {
                console.log('Cantidad actualizada en el carrito');
                return res.status(200).json({ message: 'Cantidad actualizada' });
            } else {
                console.log('No se pudo actualizar la cantidad');
                return res.status(500).json({ message: 'No se pudo actualizar la cantidad' });
            }

        } catch (error) {
            console.log('Error en updateCartQuantity:', error);
            res.status(500).json({ message: 'Error al actualizar la cantidad' });
        }
    },

    getCart: async (req, res) => {
        const { idUsuario } = req.params;
        try {
            const cartItems = await Cart.getCart(idUsuario);
            res.status(200).json(cartItems);
        } catch (error) {
            console.log('Error en getCart:', error);
            res.status(500).json({ message: 'Error al obtener el carrito' });
        }
    },

    removeFromCart: async (req, res) => {
        const { idUsuario, idProducto } = req.body;
        try {
            const result = await Cart.removeFromCart(idUsuario, idProducto);
            if (result.affectedRows > 0) {
                console.log('Producto eliminado del carrito');
                return res.status(200).json({ message: 'Producto eliminado' });
            } else {
                return res.status(400).json({ message: 'No se pudo eliminar el producto' });
            }
        } catch (error) {
            console.log('Error en removeFromCart:', error);
            res.status(500).json({ message: 'Error al eliminar producto' });
        }
    },

    clearCart: async (req, res) => {
        const { idUsuario } = req.params;
        try {
            const result = await Cart.clearCart(idUsuario);
            if (result.affectedRows > 0) {
                console.log('Carrito vaciado');
                return res.status(200).json({ message: 'Carrito vaciado' });
            } else {
                return res.status(400).json({ message: 'No se pudo vaciar el carrito' });
            }
        } catch (error) {
            console.log('Error en clearCart:', error);
            res.status(500).json({ message: 'Error al vaciar carrito' });
        }
    }
};

module.exports = CartController;
