const nodemailer = require('nodemailer');
const { MAIL_SERVICE, MAIL_USER_EMAIL, MAIL_USER_PASSWORD } = process.env;

exports.mailTransporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
        user: MAIL_USER_EMAIL,
        pass: MAIL_USER_PASSWORD
    }
});
