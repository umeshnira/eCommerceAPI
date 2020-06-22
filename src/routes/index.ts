import { Router } from 'express';
import category from './categories.routes';
import product from './Product.routes';
import sellers from './sellers.routes';
import clients from './clients.routes';
import subCategories from './sub-categories.routes';

const routes = Router();

routes.use('/', category);
routes.use('/', subCategories);
routes.use('/', product);
routes.use('/', sellers);
routes.use('/', clients);

export default routes;