require ('dotenv').config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const connectDB = () => {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                console.log('Error al conectarse a la base de datos: ', err);
                reject(err);
                return;
            };
            console.log('Conexión exitosa a la base de datos MySQL');
            resolve();
        });
    });
};

connectDB().catch(err => {
    console.log('Error de conexión: ', err);
});

module.exports = connection;