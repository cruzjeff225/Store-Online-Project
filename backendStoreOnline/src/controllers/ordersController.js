const connection = require('../config/database.js');

const getOrders = (req, res) => {
    connection.query('SELECT idOrden, idUsuario, idProducto, Cantidad, precioTotal, estadoPedido, creado FROM Orden', 
    (error, results) => {
        if (error) {
            console.error('Error al cargar pedidos:', error);
            res.status(500).json({ error: 'Error al cargar pedidos', detalle: error.message });
            return;
        }
        res.json(results);
    });
};


module.exports = {  getOrders };