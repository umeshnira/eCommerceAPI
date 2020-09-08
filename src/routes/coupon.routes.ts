import { Router } from 'express';

import couponController from '../controllers/coupon.controller';

const router = Router();

router.post('/coupon', [], couponController.createCoupon);


export default router;