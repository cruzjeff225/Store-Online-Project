const express = require('express')
const UserController = require('../controllers/userController.js');

const router = express.Router();

//Ruta para registro de usuarios
router.post('/register', UserController.registerUser);

module.exports = router;