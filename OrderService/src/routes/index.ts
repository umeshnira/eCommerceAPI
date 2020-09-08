import { Router } from 'express';
import order from './order.routes';
import helloWorld from './hello-world.route.';
import invoice from './invoice.route';

const routes = Router();

routes.use('/', order);
routes.use('/', invoice);
routes.use('/', helloWorld);

export default routes;