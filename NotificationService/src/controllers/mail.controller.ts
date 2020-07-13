import { Request, Response } from 'express';
import { connect, transaction } from '../context/db.context';
import { OrderViewListModel } from '../models/index';
import { sendMailMiddleWare } from '../middlewares/send-mail.middleware'
import fetch from 'node-fetch';

class MailController {

    static sendMail = async (req: Request, res: Response) => {

        const order_id =  req.params.id;
        try {

            const response = await fetch(`http://localhost:1338/ecommerce/orders/mail/${order_id}`);
            const json = await response.json();
            if (json) {
                const order = json as OrderViewListModel[];
                const mailResp =await sendMailMiddleWare(order);

                if(mailResp.accepted.length>0){
                    res.status(201).send(`Mail send `);
                }
                else{
                    res.status(404).send(`Mail not send `);
                }
              
            } else {
                res.status(404).send('Orders not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }


    }
}

export default MailController;