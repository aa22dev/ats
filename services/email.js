const nodemailer = require('nodemailer');
const config = require('../config/smtp.js');
const SMTP = require('../models/smtp_configurations.js');

const defaultSmtpConfig = {
    host: config.host,
    port: config.port,
    auth: {
        user: config.auth.user,
        pass: config.auth.pass
    },
    secure: config.secure,
};

const getSmtpConfig = async (companyId) => {
    try {
        const settings = await SMTP.getByCompanyId(companyId);
        if (settings) {
            const { smtp_host, smtp_port, smtp_username, smtp_password, smtp_secure } = settings;
            return {
                host: smtp_host,
                port: smtp_port,
                auth: {
                    user: smtp_username,
                    pass: smtp_password
                },
                secure: smtp_secure === 'ssl' || smtp_port === 465
            };
        }
    } catch (error) {
        throw error;
    }
    return defaultSmtpConfig;
};

const sendOtpEmail = async (to, otp, companyId) => {
    const smtpConfig = await getSmtpConfig(companyId);
    smtpConfig.tls = {
        rejectUnauthorized: false,
    };
    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
        from: smtpConfig.auth.user,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. This otp will expire in 5 minutes.`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
