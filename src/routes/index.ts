import { Router } from 'express';
import category from './categories.routes';
import product from './Product.routes';
import sellers from './sellers.routes';
import clients from './clients.routes';
import subCategories from './sub-categories.routes';

const routes = Router();

routes.use('/categories', category);
routes.use('/subcategories', subCategories);
routes.use('/products', product);
routes.use('/sellers', sellers);
routes.use('/clients', clients);

export default routes;