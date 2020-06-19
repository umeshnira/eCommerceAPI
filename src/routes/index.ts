import { Router } from 'express';
import user from './user';
import auth from './Auth.routes';
import Category from './Category.routes';
import product from './Product.routes';
import sellers from './sellers.routes';
import clients from './clients.routes';


const routes = Router();

routes.use('/users', user);
routes.use('/register', auth);
routes.use('/categories', Category);
routes.use('/products', product);
routes.use('/sellers', sellers);
routes.use('/clients', clients);

export default routes;