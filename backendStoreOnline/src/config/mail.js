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

module.exports = { sendWelcomeMail };