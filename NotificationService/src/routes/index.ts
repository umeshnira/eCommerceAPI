import { Router } from 'express';
import mail from './mail.route';
import helloWorld from './hello-world.route.';

const routes = Router();

routes.use('/', helloWorld);
routes.use('/', mail);

export default routes;