const Cart = require('../models/cart.js');

const CartController = {
    addToCart: async (req, res) => {
        const { idUsuario, idProducto, cantidadProducto } = req.body;
        //Validar si el producto tiene stock suficiente
        try {
            const existingStock = await Cart.getStockProduct(idProducto);
            if(existingStock < cantidadProducto ) {
                console.log('Stock insufiente');
                return res.status(400).json({message: 'Stock insuficiente'});
            };

            const adding = { idUsuario, idProducto, cantidadProducto };
            const result = await Cart.addToCart(adding);
            
            if(result.affectedRows > 0) {
                console.log('Producto agregado al carrito');
                return res.status(200).json({message: 'Producto agregado al carrito'});
            } else {
                console.log('No se pudo agregar al carrito');
                return res.status(500).json({message: 'No se puedo agregar al carrito'})
            }

        } catch (error) {
            console.log('Error en la función addToCart:', error);
            res.status(500).json({message: 'Error al agregar producto al carrito'});
        }
    },

    cartCount: async (req, res) => {
        const { idUsuario } = req.params;
        try {
            const count = await Cart.getCart(idUsuario);
            res.status(200).json({count});
        } catch (error) {
            console.log('Error en getCart:', error);
            res.status(500).json({message: 'Error al obtener cantidad de productos en el carrito'});
        }
    }
};

module.exports = CartController;