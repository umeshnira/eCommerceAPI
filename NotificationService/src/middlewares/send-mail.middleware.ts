import nodemailer from 'nodemailer';
import { mail } from '../config/app-settings.json'

export async function sendMailMiddleWare(order): Promise<any> {


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mail.user,
            pass: mail.pass
        }
    });

    const mailOptions = {
        from: mail.user,
        to: order.toMail,
        subject: order.subject,
        html: order.body
    };

    const mail1 = await transporter.sendMail(mailOptions);
    return mail1;


};