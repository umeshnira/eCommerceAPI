import { Router } from 'express';
import userLoginController from '../controllers/user-login.controller';

const router = Router();

router.post('/login', [], userLoginController.userLogin);

export default router;