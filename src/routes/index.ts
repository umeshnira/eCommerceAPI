import { Router } from 'express';
import category from './categories.routes';
import product from './Product.routes';
import sellers from './sellers.routes';
import clients from './clients.routes';
import helloWorld from './hello-world.route.';
import subCategories from './sub-categories.routes';
import carts from './carts.routes';
import saveLater from './save-later.routes';

const routes = Router();

routes.use('/', helloWorld);
routes.use('/', category);
routes.use('/', subCategories);
routes.use('/', product);
routes.use('/', sellers);
routes.use('/', clients);
routes.use('/', carts);
routes.use('/', saveLater);

export default routes;