const express = require('express');
const ProductController = require('../controllers/productController.js');

const router = express.Router();

router.get('/products', ProductController.getAllProducts);
router.get('/products/search', ProductController.searchProductsByName);
router.get('/products/filter', ProductController.filterProductsByCategory);
router.get('/products/:idProducto', ProductController.getProductByID);
module.exports = router;