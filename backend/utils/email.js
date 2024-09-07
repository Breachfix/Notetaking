// utils/email.js
import nodemailer from 'nodemailer';
import { ENV_VARS } from '../config/envVars.js';

export function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ENV_VARS.MY_EMAIL,
        pass: ENV_VARS.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: ENV_VARS.MY_EMAIL,
      to: recipient_email,
      subject: 'Password Recovery OTP',
      html: `
        <h1>Your OTP is: ${OTP}</h1>
        <p>Use the above OTP to recover your password. This OTP is valid for 5 minutes.</p>
      `,
    };

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        console.log(error);
        return reject({ message: 'Error sending email' });
      }
      return resolve({ message: 'OTP sent successfully' });
    });
  });
}

