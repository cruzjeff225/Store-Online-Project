require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require('./config/database.js');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes.js')
const cartRoutes = require('./routes/cartRoutes.js')

const app = express();

app.use(express.json())
app.use(cors());

//Rutas para usuarios
app.use('/api', userRoutes)
//Rutas para productos
app.use('/api', productRoutes)
//Rutas para carrito
app.use('/api', cartRoutes)
//Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a StoreOnline Backend');
})

module.exports = app;