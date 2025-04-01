const connection = require('../config/database.js');

const Cart = {
    // Verificar producto en stock
    getStockProduct: async (idProducto) => {
        const query = 'SELECT stock FROM Productos WHERE idProducto = ?';
        const [rows] = await connection.promise().query(query, [idProducto]);
        return rows[0]?.stock || 0;
    },

    // Agregar producto al carrito
    addToCart: async (product) => {
        const { idUsuario, idProducto, cantidadProducto } = product;
        const query = 'INSERT INTO Carrito (idUsuario, idProducto, cantidadProducto) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE cantidadProducto = cantidadProducto + ? ';
        const [result] = await connection.promise().query(query, [idUsuario, idProducto, cantidadProducto, cantidadProducto]);
        return result;
    },

    // Obtener el total de productos en el carrito
    getCart: async (idUsuario) => {
        const query = 'SELECT SUM(cantidadProducto) AS Total FROM Carrito WHERE idUsuario = ?';
        const [rows] = await connection.promise().query(query, [idUsuario]);
        return rows[0]?.Total || 0;
    },

    // Eliminar producto del carrito
    removeFromCart: async (idUsuario, idProducto) => {
        const query = 'DELETE FROM Carrito WHERE idUsuario = ? AND idProducto = ?';
        const [result] = await connection.promise().query(query, [idUsuario, idProducto]);
        return result;
    },

    // Obtener todos los productos en el carrito con detalles
    getCartDetails: async (idUsuario) => {
        const query = `
            SELECT C.idProducto, P.nombre, C.cantidadProducto, P.precio, (C.cantidadProducto * P.precio) AS subtotal
            FROM Carrito C
            JOIN Productos P ON C.idProducto = P.idProducto
            WHERE C.idUsuario = ?`;
        const [rows] = await connection.promise().query(query, [idUsuario]);
        return rows;
    }
};

module.exports = Cart;
