const Product = require('../models/product.js');

const ProductController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.getProducts();
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json({message: 'Error al obtener productos', error: err});
        }
    },

    getProductByID: async (req, res) => {
        const {idProducto} = req.query;
        try {
            const product = await Product.getProductByID(idProducto);
            if(!product) {
                return res.status(404).json({message: 'Producto no encontrado'});
            }
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({message: 'Error al obtener producto'});
        }
    },
    
    searchProductsByName: async (req,res) => {
        const {nombreProducto} = req.query;
        try {
            const product = await Product.searchProductsByName(nombreProducto);
            if(!product || product.length === 0) {
                return res.status(200).json([]);
            }
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({message: 'Error al obtener producto'})
        }
    },

    filterProductsByCategory: async (req, res) => {
        const {categoriaProducto} = req.query;
        try {
            const product = await Product.filterProductsByCategory(categoriaProducto);
            if(!product || product.length === 0) {
                return res.status(200).json([]);
            }
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({message: 'Error al filtrar productos'});
        }
    },
};

module.exports = ProductController;