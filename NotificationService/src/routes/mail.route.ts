import { Router } from 'express';
import MailController from '../controllers/mail.controller';

const router = Router();

router.post(
    '/mail', [], MailController.sendMail);

export default router;