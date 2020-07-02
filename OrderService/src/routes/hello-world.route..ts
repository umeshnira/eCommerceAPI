import { Router } from 'express';
import helloWorldController from '../controllers/hello-world.controller';

const router = Router();

router.get('/helloworld', [], helloWorldController.getHelloWorld);

export default router;