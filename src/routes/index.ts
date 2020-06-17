import { Router } from 'express';
import user from './user';
import auth from './Auth.routes';
import Category from './Category.routes';
import Product from './Product.routes';

const routes = Router();

routes.use('/users', user);
routes.use('/register', auth);
routes.use('/categories', Category);
routes.use('', Product);

export default routes;