const connection = require('../config/database.js');
const User = require('../models/user.js');
const Notification = require('../models/notification.js');
const { sendStatusMail, templates } = require('../config/mail.js');

const updateOrderStatus = async (req, res) => {
    const { idPedido } = req.params;
    const { nuevoEstado } = req.body;

    try {
        // Obteniendo ID de usuario del pedido
        const [pedidosRows] = await connection.promise().query(
            'SELECT idUsuario FROM Pedidos WHERE idPedido = ?',
            [idPedido]
        );
        if (pedidosRows.length === 0) return res.status(404).json({error: 'Pedido no encontrado'});
        const idUsuario = pedidosRows[0].idUsuario;

        // Actualizando estado del pedido
        await connection.promise().query(
            'UPDATE Pedidos SET estado = ? WHERE idPedido = ?',
            [nuevoEstado, idPedido]
        );
        // Obtener usuario
        const usuario = await User.getUserByID(idUsuario);

        // Insertando notificacion en sistema
        const mensaje = `Tu pedido has sido ${nuevoEstado}`;
        await Notification.create(idUsuario, mensaje);

        // Enviar correo si las preferencias de usuario lo permiten
        if (usuario.recibirCorreos) {
            const template = templates[nuevoEstado](usuario.nombre);
            await sendStatusMail(usuario.correo, template);
        }
        res.json({message: 'Estado actualizado, notificación enviada'});
    } catch (err) {
        console.log('Error al actualizar estado', err);
        res.status(500).json({error: 'Error al actualizar estado'});
    }
};

module.exports = { updateOrderStatus };