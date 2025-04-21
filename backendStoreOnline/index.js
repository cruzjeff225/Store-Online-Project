const express = require('express');
const dotenv = require('dotenv');
const orderRoutes = require('./src/routes/orders');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/orders', orderRoutes);

app.listen(3001, () => console.log('Backend corriendo en puerto 3001'));
