import { Router } from 'express';
import order from './order.routes';
import helloWorld from './hello-world.route.';

const routes = Router();

routes.use('/', order);
routes.use('/', helloWorld);

export default routes;