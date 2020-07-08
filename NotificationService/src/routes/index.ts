import { Router } from 'express';

import helloWorld from './hello-world.route.';

const routes = Router();


routes.use('/', helloWorld);

export default routes;