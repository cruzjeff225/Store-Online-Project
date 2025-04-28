const express = require('express');
const router = express.Router();
const { getUserNotification } = require('../controllers/notificationController.js');

router.get('/:idUsuario', getUserNotification);

module.exports = router;