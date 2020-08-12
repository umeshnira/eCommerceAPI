import { Request, Response } from 'express';
import { validate } from 'class-validator';
import {
    ProductImageDTO, ReviewViewDetailsModel, ReviewDTOModel,
    ReviewRatingsModel, ReviewRatingsImageModel
} from '../models';
import { application } from '../config/app-settings.json';
import { connect, transaction } from '../context/db.context';
import { Status } from '../enums';
import * as fs from 'fs';

class ReviewController {

    static createReview = async (req: any, res: Response) => {

        try {
            const parsedData = JSON.parse(req.body.data);
            const reviewDto = Object.assign(new ReviewDTOModel(), parsedData);

            const errors = await validate(reviewDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            let data: any;
            const pool = await connect();

            let review_rating_id: any;

            await transaction(pool, async connection => {

                const review = new ReviewRatingsModel();
                review.product_id = reviewDto.product_id;
                review.description = reviewDto.description;
                review.date = new Date()
                review.rate = reviewDto.rate;
                review.status = Status.Approval_Pending;
                review.title = reviewDto.title;
                review.user_id = reviewDto.user_id
                review.created_by = reviewDto.user_id
                review.created_at = new Date();

                [data] = await connection.query(
                    `INSERT INTO review_ratings SET ?`, [review]
                );

                review_rating_id = data.insertId;

                if (review_rating_id > 0) {

                    for (const file of req?.files) {
                        const reviewImage = new ReviewRatingsImageModel();
                        reviewImage.review_rating_id = review_rating_id;
                        reviewImage.image = file.filename;
                        reviewImage.created_by = reviewDto.created_by;
                        reviewImage.created_at = new Date();

                        [data] = await connection.query(
                            `INSERT INTO review_ratings_images SET ?`, [reviewImage]
                        );
                    }
                }
            });

            if (review_rating_id) {
                res.status(201).send({ message: `Review with Id: ${review_rating_id} is created` });
            } else {
                res.status(500).send({ message: `Failed to create a Review` });
            }
        }
        catch (error) {
            ReviewController.unlinkUploadedFiles(req?.files);
            res.status(500).send(error.message);
        }
    };

    static createSellerReview = async (req: any, res: Response) => {

        try {
            const parsedData = JSON.parse(req.body.data);
            const reviewDto = Object.assign(new ReviewDTOModel(), parsedData);

            const errors = await validate(reviewDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            let data: any;
            const pool = await connect();

            let review_rating_id: any;

            await transaction(pool, async connection => {

                const review = new ReviewRatingsModel();
                review.product_id = reviewDto.product_id;
                review.description = reviewDto.description;
                review.date = new Date()
                review.rate = reviewDto.rate;
                review.status = Status.Approval_Pending;
                review.title = reviewDto.title;
                review.user_id = reviewDto.user_id
                review.created_by = reviewDto.user_id
                review.created_at = new Date();

                [data] = await connection.query(
                    `INSERT INTO review_ratings SET ?`, [review]
                );

                review_rating_id = data.insertId;

            });

            if (data.insertId>0) {
                res.status(201).send({ message: `Review with Id: ${review_rating_id} is created` });
            } else {
                res.status(500).send({ message: `Failed to create a Review` });
            }
        }
        catch (error) {
            ReviewController.unlinkUploadedFiles(req?.files);
            res.status(500).send(error.message);
        }
    };
    static getProductReviews = async (req: Request, res: Response) => {

        try {
            const productID = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `select
                wr.id,
                wr.title,
                wr.description,
                wr.rate,
                wr.date,
                wr.product_id,
                c.name,
                ri.image
                from review_ratings wr
                inner join review_ratings_images ri on ri.review_rating_id=wr.id
                inner join clients c on c.user_id=wr.user_id
                where wr.status=1  and wr.product_id=?`,
                [productID]
            );

            const products = data as ReviewViewDetailsModel[];
            if (products.length) {
                const productDetails = new Array<ReviewViewDetailsModel>();
                products.forEach(prod => {
                    const productDetail = prod as ReviewViewDetailsModel;
                    productDetail.images = new Array<ProductImageDTO>();
                    const product = productDetails.find(x => x.id === prod.id);
                    if (product) {
                        const image = new ProductImageDTO();
                        image.name = prod.image;
                        image.path = application.getImagePath.product + prod.image;
                        product.images.push(image);
                    } else {
                        const image = new ProductImageDTO();
                        image.name = prod.image;
                        image.path = application.getImagePath.product + prod.image;
                        productDetail.images.push(image);
                        productDetails.push(productDetail);
                    }
                });
                res.status(200).json(productDetails);
            } else {
                res.status(404).send({ message: `Reviw Product with Id: ${productID} not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getProductReviewsForSeller = async (req: Request, res: Response) => {

        try {
            const userId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT rr.id,
                     prod.name,
                     ima.image,
                     rr.title,
                     rr.description,
                     rr.rate,
                     s.name as status,
                     rr.date,
                     c.name as author
                        FROM products prod
                        INNER JOIN seller_products sp ON prod.id = sp.product_id
                        INNER JOIN product_images ima ON prod.id = ima.product_id
                        INNER JOIN review_ratings rr ON rr.product_id = prod.id
                        inner join status s on s.id=rr.status
                        inner join clients c on c.user_id=rr.user_id

                        group by prod.id`,
                [userId]
            );

            const products = data as ReviewViewDetailsModel[];
            if (products.length) {
                const productDetails = new Array<ReviewViewDetailsModel>();
                products.forEach(prod => {
                    const productDetail = new ReviewViewDetailsModel();
                    productDetail.id = prod.id;
                    productDetail.name = prod.name;
                    productDetail.description = prod.description;
                    productDetail.author = prod.author;
                    productDetail.rate = prod.rate;
                    productDetail.date = prod.date;
                    productDetail.status = prod.status;
                    productDetail.title = prod.title;
                    productDetail.seller_id = prod.seller_id;
                    productDetail.image = prod.image
                    productDetail.path = application.getImagePath.product + prod.image;
                    productDetails.push(productDetail);

                });
                res.status(200).json(productDetails);
            } else {
                res.status(404).send({ message: `Products with  Id: ${userId} not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };


    static unlinkUploadedFiles(files: any[]) {
        if (files) {
            for (const file of files) {
                fs.unlink(file.path, function (err) {
                    if (err) throw err;
                });
            }
        }
    }
}

export default ReviewController;