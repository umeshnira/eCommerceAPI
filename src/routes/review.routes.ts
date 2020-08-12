import { Router } from 'express';
import ReviewController from '../controllers/review.controller';
import file_upload from '../utils/image-upload';
import settings from '../config/app-settings.json';
import { setUploadPath } from '../middlewares';

const router = Router();

router.post(
    '/review', [], setUploadPath(settings.application.storage.review), file_upload.array('image'), ReviewController.createReview);

router.post(
        '/review/seller', [], ReviewController.createSellerReview);
    
router.get(
    '/user/:id([0-9]+)/review/forseller', [], ReviewController.getProductReviewsForSeller);

router.get(
    '/products/:id([0-9]+)/review', [], ReviewController.getProductReviews);

export default router;