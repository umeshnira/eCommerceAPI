import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

class MailController {

    static sendMail = async (req: Request, res: Response) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'varunrajother@gmail.com',
                pass: '12345678vr'
            }
        });

        const mailOptions = {
            from: 'varunrajother@gmail.com',
            to: 'ss.varunraj.ss@gmail.com',
            subject: 'Sending Email ',
            text: 'hi!'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    }
}

export default MailController;