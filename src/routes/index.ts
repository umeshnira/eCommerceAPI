import { Router } from 'express';
import user from './user';
import auth from './AuthRoutes';
import productCategory from './ProductCategoryRoutes';

const routes = Router();

routes.use('/users', user);
routes.use('/register', auth);
routes.use('/category', productCategory);
routes.use('/category', productCategory);


export default routes;