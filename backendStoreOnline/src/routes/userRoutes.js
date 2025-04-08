const express = require('express')
const UserController = require('../controllers/userController.js');

const router = express.Router();

//Ruta para registro de usuarios
router.post('/register', UserController.registerUser);
router.put('/preferencia-correo/:idUsuario', UserController.updateEmailPreference);
router.get('/:idUsuario', UserController.getUserById);

module.exports = router;