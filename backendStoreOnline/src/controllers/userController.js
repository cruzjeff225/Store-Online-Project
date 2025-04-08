const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWelcomeMail } = require('../config/mail.js');


const UserController = {
    registerUser: async (req, res) => {
        console.log('Recibiendo solicitud de registros:', req.body);

        const { nombre, correo, contrasena, direccion, telefono } = req.body;
        try {
            //Validando si el correo ya existe
            const existingUser = await User.getUserByMail(correo);
            if (existingUser) {
                console.log('Usuario ya existe');

                return res.status(400).json({ message: 'El correo que has ingresado ya está registrado' })
            }
            //Hashear constraseña
            console.log('Hasheando pass');

            const hashedPassword = await bcrypt.hash(contrasena, 10);
            //Crear nuevo usuario
            const newUser = { nombre, correo, contrasena: hashedPassword, direccion, telefono };

            console.log('Creando nuevo usuario');
            const result = await User.createUser(newUser);
            console.log('Usuario creado con exito');

            //Enviar correo de bienvenida
            const subject = 'Bienvenido a StoreOnline!';
            const text = `¡Hola ${nombre}!\n\nGracias por registrarte en StoreOnline. Ahora tienes acceso a una amplia variedad de productos alimenticios, artículos básicos  para el hogar y mucho más, todo al alcance de tu mano.\nExplora nuestras categorías, haz tu pedido y recibe tus productos cómodamente en tu hogar.\n\n¡Comienza a comprar ahora y disfruta de una experiencia de supermercado online como nunca antes!\n\nSaludos,\nEl equipo de StoreOnline`;
            sendWelcomeMail(correo, subject, text);

            res.status(201).json({ message: 'Usuario registrado con éxito:', idUsuario: result.insertId });
        } catch (err) {
            res.status(500).json({ message: 'Error al registrar usuario:', error: err.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const { idUsuario } = req.params;

            // Validación del ID
            if (isNaN(idUsuario)) {
                return res.status(400).json({ message: 'ID de usuario inválido' });
            }

            const user = await User.getUserByID(idUsuario);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            user.recibirCorreos = Boolean(user.recibirCorreos);

            res.json(user);
        } catch (error) {
            console.error('Error en getUserById:', error);
            res.status(500).json({
                message: 'Error al obtener usuario',
                error: error.message
            });
        }
    },

    updateEmailPreference: async (req, res) => {
        try {
            const { idUsuario } = req.params;
            const { recibirCorreos } = req.body;

            // Validación del tipo de dato
            if (typeof recibirCorreos !== 'boolean') {
                return res.status(400).json({ message: 'Valor de preferencia inválido' });
            }

            const recibirCorreosValue = recibirCorreos ? 1 : 0;

            const result = await User.setEmailPreference(idUsuario, recibirCorreosValue);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json({
                success: true,
                message: 'Preferencia actualizada',
                recibirCorreos
            });
        } catch (error) {
            console.error('Error en updateEmailPreference:', error);
            res.status(500).json({
                message: 'Error al actualizar preferencia',
                error: error.message
            });
        }
    }
};

module.exports = UserController;

