const Notification = require('../models/notification.js');

const getUserNotification = async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const notificaciones = await Notification.getByUserID(idUsuario);
        res.json(notificaciones);
    } catch (error) {
        console.log('Error al obtener notificaciones', error);
        res.status(500).json({error: 'Error al obtener notificaciones'});
    }
};

module.exports = { getUserNotification };