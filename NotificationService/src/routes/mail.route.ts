import { Router } from 'express';
import MailController from '../controllers/mail.controller';
const router = Router();

router.post(
    '/mail/:id([0-9]+)', [], MailController.sendMail);


export default router;