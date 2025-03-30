const connection = require('../config/database.js');

const Product = {
    //Obtener todos los productos
    getProducts: async () => {
        const query = "SELECT * FROM Productos";
        const [rows] = await connection.promise().query(query);
        return rows;
    },
    //Obtener productos por ID
    getProductByID: async (idProducto) => {
        const query = "SELECT * FROM Productos WHERE idProducto = ?";
        const [rows] = await connection.promise().query(query, [idProducto]);
        return rows[0];
    },
    //Buscar prodcutos por nombre
    searchProductsByName: async (nombreProducto) => {
        const query = "SELECT * FROM Productos WHERE nombreProducto LIKE ?";
        const [rows] = await connection.promise().query(query, [`%${nombreProducto}%`]);
        return rows;
    },
    //Filtrar productos por categoría
    filterProductsByCategory: async (categoriaProducto) => {
        const query = "SELECT * FROM Productos WHERE categoriaProducto LIKE ?";
        const [rows] = await connection.promise().query(query, [`%${categoriaProducto}%`]);
        return rows;
    }
}

module.exports = Product;