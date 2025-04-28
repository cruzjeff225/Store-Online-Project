const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

const sendWelcomeMail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log('Error al enviar correo. Operación fallida: ',error);            
        } else {
            console.log('Correo enviado exitosamente: ', info.response);
        }
    });
};

const templates = {
    confirmado: (nombre) => ({
        subject: 'Pedido confirmado!',
        text: `Hola ${nombre}, tu pedido ha sido confirmado exitosamente.`,
    }),
    enviado: (nombre) => ({
        subject: 'Pedido enviado',
        text: `Hola ${nombre}, tu pedido ha sido enviado.`,
    }),
    entregado: (nombre) => ({
        subject: 'Pedido entregado',
        text: `Hola ${nombre}, tu pedido a sido entregado. ¡Gracias por tu compra, vuelve pronto!`,
    }),
};

const sendStatusMail = (to, template) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: template.subject,
        text: template.text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo: ', error);
        } else {
            console.log('Correo enviado: ', info.response);
        }
    });
};
module.exports = { sendWelcomeMail, sendStatusMail, templates };