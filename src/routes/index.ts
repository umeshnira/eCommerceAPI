import { Router } from 'express';
import category from './categories.routes';
import product from './Product.routes';
import sellers from './sellers.routes';
import clients from './clients.routes';
import helloWorld from './hello-world.route.';
import subCategories from './sub-categories.routes';

const routes = Router();

routes.use('/', category);
routes.use('/', subCategories);
routes.use('/', product);
routes.use('/', sellers);
routes.use('/', clients);
routes.use('/', helloWorld);

export default routes;