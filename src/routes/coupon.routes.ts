import { Router } from 'express';

import couponController from '../controllers/coupon.controller';

const router = Router();

router.post('/coupon', [], couponController.createCoupon);

router.put('/coupon/:id([0-9]+)', [], couponController.updateCoupon);

router.get('/coupon', [], couponController.getAllCoupon);

router.get('/coupon/:id([0-9]+)', [], couponController.getCoupon);


export default router;