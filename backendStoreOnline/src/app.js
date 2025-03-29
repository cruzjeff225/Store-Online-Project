require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require('./config/database.js');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json())
app.use(cors());

//Rutas para usuarios
app.use('/api', userRoutes)

//Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a StoreOnline Backend');
})

module.exports = app;