const connection = require('../config/database.js');

const User = {
    //Nuevo usuario
    createUser: async (usuario) => {
        const {nombre, correo, contrasena, direccion, telefono} = usuario;
        const query = 'INSERT INTO Usuarios (nombre, correo, contrasena, direccion, telefono) VALUES (?, ?, ?, ?, ?)';
        const [result] = await connection.promise().query(query, [nombre, correo, contrasena, direccion, telefono]);
        return result;
    },

    //Obtener usuario por correo
    getUserByMail: async (correo) => {
        const query = 'SELECT * FROM Usuarios WHERE LOWER(Correo) = LOWER(?)';
        const [rows] = await connection.promise().query(query, [correo.trim()]);
        return rows[0];
    },

    //Obtener usuario por ID
    getUserByID: async (id) => {
        const query = 'SELECT * FROM Usuarios WHERE idUsuario = ?';
        const [rows] = await connection.promise().query(query, [id]);
        return rows[0];
    },

    setEmailPreference: async (idUsuario, recibirCorreos) => {
        const query = 'UPDATE Usuarios SET recibirCorreos = ? WHERE idUsuario = ?';
        const [result] = await connection.promise().query(query, [recibirCorreos, idUsuario]);
        return result;
    }
};

module.exports = User;