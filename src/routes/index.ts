import { Router } from 'express';
import category from './categories.routes';
import product from './Product.routes';
import sellers from './sellers.routes';
import clients from './clients.routes';
import helloWorld from './hello-world.route.';
import subCategories from './sub-categories.routes';
import carts from './carts.routes';
import saveLater from './save-later.routes';
import login from './login.routes';
import wishlist from './wish-list.routes';
import offer from './offer.routes';
import review from './review.routes';
import subcription from './subcription.routes';
import coupon from './coupon.routes';

const routes = Router();

routes.use('/', helloWorld);
routes.use('/', category);
routes.use('/', subCategories);
routes.use('/', product);
routes.use('/', sellers);
routes.use('/', clients);
routes.use('/', carts);
routes.use('/', saveLater);
routes.use('/', login);
routes.use('/', wishlist);
routes.use('/', offer);
routes.use('/', review);
routes.use('/', subcription);
routes.use('/', coupon);


export default routes;