const connection = require('../config/database.js');

const Notification = {
    create: async (idUsuario, mensaje) => {
        const query = 'INSERT INTO Notificaciones (idUsuario, mensaje) VALUES (?, ?)';
        const [result] = await connection.promise().query(query, [idUsuario, mensaje]);
        return result;
    },

    getByUserID: async (idUsuario) => {
        const query = 'SELECT * FROM Notificaciones WHERE idUsuario = ? ORDER BY fecha DESC';
        const [rows] = await connection.promise().query(query, [idUsuario]);
        return rows;
    }
}



module.exports = Notification;