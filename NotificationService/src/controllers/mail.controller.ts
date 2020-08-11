import { Request, Response } from 'express';
import { OrderCreateMailModel } from '../models/index';
import { sendMailMiddleWare } from '../middlewares/send-mail.middleware';
import { validate } from 'class-validator';

class MailController {

    static sendMail = async (req: Request, res: Response) => {


        try {

            const orderDto = Object.assign(new OrderCreateMailModel(), req.body);
            const errors = await validate(orderDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }
            orderDto.body=orderDto.body.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')
            // console.log(orderDto)
            // orderDto=JSON.parse(orderDto)
            console.log(orderDto.body)
                const mailResp =await sendMailMiddleWare(orderDto);

                if(mailResp.accepted.length>0){
                    res.status(201).send(`Mail send `);
                }
                else{
                    res.status(404).send(`Mail not send `);
                }

        } catch (error) {
            res.status(500).send(error.message);
        }


    }
}

export default MailController;