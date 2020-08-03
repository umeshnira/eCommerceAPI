import { Request, Response } from 'express';
import { validate } from 'class-validator';
import {
    ProductList, Product, ProductCategory, ProductQuantity,
    ProductPrice, ProductOffers, ProductImage, ProductDTO, ProductImageDTO, ProductDetails, SellerProducts,
    ReviewViewDetailsModel,ReviewDTOModel,ReviewRatingsModel,ReviewRatingsImageModel
} from '../models';
import { application } from '../config/app-settings.json';
import { connect, transaction } from '../context/db.context';
import { Status } from '../enums';
import * as fs from 'fs';

class ProductController {

    static getProducts = async (req: Request, res: Response) => {

        try {
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT prod.id, prod.name, prod.description, prod.star_rate, price.price, ima.image,
                        cat.name as category FROM products prod
                        INNER JOIN product_prices price ON prod.id = price.product_id
                        INNER JOIN product_categories prod_cat ON prod.id = prod_cat.product_id
                        INNER JOIN categories cat ON cat.id = prod_cat.category_id
                        INNER JOIN product_images ima ON prod.id = ima.product_id
                        WHERE prod.status = ?
                        ORDER By prod.star_rate DESC`,[Status.Active]
            );

            const products = data as ProductList[];
            if (products.length) {
                const productDetails = new Array<ProductList>();
                products.forEach(prod => {
                    const productDetail = prod as ProductList;
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
                res.status(404).send({message:`Products not found`});
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getProduct = async (req: Request, res: Response) => {

        try {
            const productId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT prod.id, prod.name, prod.description, prod.about, prod.batch_no, prod.star_rate,
                        prod.is_returnable, prod.exp_date, prod.bar_code, price.price, ima.image, qty.left_qty,
                        qty.total_qty, prod_cat.category_id, offer.id AS offer_id FROM products prod
                        INNER JOIN product_categories prod_cat ON prod.id = prod_cat.product_id
                        INNER JOIN product_prices price ON prod.id = price.product_id
                        INNER JOIN product_quantity qty ON prod.id = qty.product_id
                        LEFT JOIN product_offers offer ON prod.id = offer.product_id
                        INNER JOIN categories cat ON cat.id = prod_cat.category_id
                        INNER JOIN product_images ima ON prod.id = ima.product_id WHERE prod.id = ?`, [productId]
            );

            const products = data as ProductDetails[];
            if (products.length) {
                const productDetail = new Product();
                products.forEach((prod, index) => {
                    if (index === 0) {
                        productDetail.id = prod.id;
                        productDetail.name = prod.name;
                        productDetail.description = prod.description;
                        productDetail.about = prod.about;
                        productDetail.batch_no = prod.batch_no;
                        productDetail.star_rate = prod.star_rate;
                        productDetail.is_returnable = prod.is_returnable;
                        productDetail.exp_date = prod.exp_date;
                        productDetail.bar_code = prod.bar_code;
                        productDetail.price = prod.price;
                        productDetail.total_qty = prod.total_qty;
                        productDetail.left_qty = prod.left_qty;
                        productDetail.category_id = prod.category_id;
                        productDetail.offer_id = prod.offer_id;

                        const image = new ProductImageDTO();
                        image.name = prod.image;
                        image.path = application.getImagePath.product + prod.image;
                        productDetail.images.push(image);
                    } else {
                        const image = new ProductImageDTO();
                        image.name = prod.image;
                        image.path = application.getImagePath.product + prod.image;
                        productDetail.images.push(image);
                    }
                });
                res.status(200).json(productDetail);
            } else {
                res.status(404).send({ message: `Product with Id: ${productId} not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getProductsByCategoryId = async (req: Request, res: Response) => {

        try {
            const categoryId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT prod.id, prod.name, prod.description, prod.about, prod.batch_no, prod.star_rate,
                        prod.is_returnable, prod.exp_date, prod.bar_code, price.price, ima.image, qty.left_qty,
                        qty.total_qty, prod_cat.category_id, offer.id AS offer_id , seller_prod.seller_id
                        FROM products prod
                        INNER JOIN product_categories prod_cat ON prod.id = prod_cat.product_id
                        INNER JOIN seller_products seller_prod ON prod.id = seller_prod.product_id
                        INNER JOIN product_prices price ON prod.id = price.product_id
                        INNER JOIN product_quantity qty ON prod.id = qty.product_id
                        LEFT JOIN product_offers offer ON prod.id = offer.product_id
                        INNER JOIN categories cat ON cat.id = prod_cat.category_id
                        INNER JOIN product_images ima ON prod.id = ima.product_id 
                        WHERE prod_cat.category_id = ? &&  prod.status = ?
                        group by prod.id`,
                [categoryId, Status.Active]
            );

            const products = data as ProductDetails[];
            if (products.length) {
                const productDetails = new Array<ProductDetails>();
                products.forEach(prod => {
                    const productDetail = new ProductDetails();
                    productDetail.id = prod.id;
                    productDetail.name = prod.name;
                    productDetail.description = prod.description;
                    productDetail.about = prod.about;
                    productDetail.star_rate = prod.star_rate;
                    productDetail.is_returnable = prod.is_returnable;
                    productDetail.exp_date = prod.exp_date;
                    productDetail.bar_code = prod.bar_code;
                    productDetail.price = prod.price;
                    productDetail.total_qty = prod.total_qty;
                    productDetail.left_qty = prod.left_qty;
                    productDetail.category_id = prod.category_id;
                    productDetail.seller_id = prod.seller_id;
                    productDetail.offer_id = prod.offer_id;
                    productDetail.image = prod.image
                    productDetail.path = application.getImagePath.product + prod.image;
                    productDetails.push(productDetail);

                });
                res.status(200).json(productDetails);
            } else {
                res.status(404).send({ message: `Product with category Id: ${categoryId} not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static createProduct = async (req: any, res: Response) => {

        try {
            const parsedData = JSON.parse(req.body.data);
            const productDto = Object.assign(new ProductDTO(), parsedData);

            const errors = await validate(productDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            let data: any;
            const pool = await connect();

            let productId: any;

            await transaction(pool, async connection => {

                const product = new ProductDetails();
                product.name = productDto.name;
                product.description = productDto.description;
                product.about = productDto.about;
                product.batch_no = productDto.batch_no;
                product.star_rate = productDto.star_rate;
                product.is_returnable = productDto.is_returnable;
                product.exp_date = new Date(productDto.exp_date);
                product.bar_code = productDto.bar_code;
                product.status = Status.Active;
                product.created_by = productDto.created_by;
                product.created_at = new Date();

                [data] = await connection.query(
                    `INSERT INTO products SET ?`, [product]
                );

                productId = data.insertId;

                if (productId > 0) {
                    const productCategory = new ProductCategory();
                    productCategory.category_id = productDto.category_id;
                    productCategory.product_id = productId;
                    productCategory.status = Status.Active;
                    productCategory.created_by = productDto.created_by;
                    productCategory.created_at = new Date();

                    [data] = await connection.query(
                        `INSERT INTO product_categories SET ?`, [productCategory]
                    );

                    const productQuantity = new ProductQuantity();
                    productQuantity.product_id = productId;
                    productQuantity.left_qty = productDto.left_qty;
                    productQuantity.total_qty = productDto.total_qty;
                    productQuantity.created_by = productDto.created_by;
                    productQuantity.created_at = new Date();

                    [data] = await connection.query(
                        `INSERT INTO product_quantity SET ?`, [productQuantity]
                    );

                    const productPrice = new ProductPrice();
                    productPrice.product_id = productId;
                    productPrice.price = productDto.price;
                    productPrice.created_by = productDto.created_by;
                    productPrice.created_at = new Date();

                    [data] = await connection.query(
                        `INSERT INTO product_prices SET ?`, [productPrice]
                    );

                    const sellerProducts = new SellerProducts();
                    sellerProducts.product_id = productId;
                    sellerProducts.seller_id = productDto.seller_id;
                    sellerProducts.status = Status.Active;
                    sellerProducts.created_by = productDto.created_by;
                    sellerProducts.created_at = new Date();

                    [data] = await connection.query(
                        `INSERT INTO seller_products SET ?`, [sellerProducts]
                    );

                    if (productDto.offer_id && productDto.offer_id > 0) {

                        const productOffer = new ProductOffers();
                        productOffer.product_id = productId;
                        productOffer.offer_id = productDto.offer_id;
                        productOffer.created_by = productDto.created_by;
                        productOffer.created_at = new Date();

                        [data] = await connection.query(
                            `INSERT INTO product_offers SET ?`, [productOffer]
                        );
                    }

                    for (const file of req?.files) {
                        const productImage = new ProductImage();
                        productImage.product_id = productId;
                        productImage.image = file.filename;
                        productImage.created_by = productDto.created_by;
                        productImage.created_at = new Date();

                        [data] = await connection.query(
                            `INSERT INTO product_images SET ?`, [productImage]
                        );
                    }
                }
            });

            if (productId) {
                res.status(201).send({ message: `Product with Id: ${productId} is created` });
            } else {
                res.status(500).send({ message: `Failed to create a product` });
            }
        }
        catch (error) {
            ProductController.unlinkUploadedFiles(req?.files);
            res.status(500).send(error.message);
        }
    };

    static updateProduct = async (req: any, res: Response) => {

        try {
            const productId = req.params.id;
            const parsedData = JSON.parse(req.body.data);
            const productDto = Object.assign(new ProductDTO(), parsedData);

            const errors = await validate(productDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM products WHERE id = ?`, [productId]
            );

            const productExists = data as Product[];
            if (!productExists.length) {
                res.status(404).send({ message: `Product with Id: ${productId} not found` });
            }

            let isUpdated: any;

            await transaction(pool, async connection => {

                const product = new ProductDetails();
                product.name = productDto.name;
                product.description = productDto.description;
                product.about = productDto.about;
                product.batch_no = productDto.batch_no;
                product.star_rate = productDto.star_rate;
                product.is_returnable = productDto.is_returnable;
                product.exp_date = new Date(productDto.exp_date);
                product.bar_code = productDto.bar_code;
                product.status = Status.Active;
                product.updated_by = productDto.updated_by;
                product.updated_at = new Date();

                [data] = await connection.query(
                    `UPDATE products SET ? WHERE id = ?`, [product, productId]
                );
                isUpdated = data.affectedRows > 0;

                if (isUpdated) {

                    [data] = await connection.query(
                        `UPDATE product_categories SET category_id = ? WHERE product_id = ?`,
                        [productDto.category_id, productId]
                    );

                    [data] = await connection.query(
                        `UPDATE seller_products SET seller_id = ? WHERE product_id = ?`,
                        [productDto.seller_id, productId]
                    );

                    [data] = await connection.query(
                        `UPDATE product_quantity SET left_qty = ?, total_qty = ? WHERE product_id = ?`,
                        [productDto.left_qty, productDto.total_qty, productId]
                    );

                    [data] = await connection.query(
                        `UPDATE product_prices SET price = ? WHERE product_id = ?`,
                        [productDto.price, productId]
                    );

                    if (productDto.offer_id && productDto.offer_id > 0) {

                        [data] = await connection.query(
                            `UPDATE product_offers SET offer_id = ? WHERE product_id = ?`,
                            [productDto.offer_id, productId]
                        );
                    }

                    [data] = await connection.query(
                        `DELETE FROM product_images WHERE product_id = ?`, [productId]
                    );

                    if (productDto.images && productDto.images.length) {
                        productDto.images.forEach(async img => {
                            const image = new ProductImage();
                            image.product_id = productId;
                            image.image = img;
                            image.created_by = productDto.created_by;
                            image.created_at = new Date();

                            [data] = await connection.query(
                                `INSERT INTO product_images SET ?`, [image]
                            );
                        });
                    }

                    for (const file of req?.files) {
                        const productImage = new ProductImage();
                        productImage.product_id = productId;
                        productImage.image = file.filename;
                        productImage.created_by = productDto.created_by;
                        productImage.created_at = new Date();

                        [data] = await connection.query(
                            `INSERT INTO product_images SET ?`, [productImage]
                        );

                    }
                }
            });

            if (isUpdated) {
                res.status(200).send({ message: `Product with Id: ${productId} is updated` });
            } else {
                res.status(500).send({ message: `Failed to update a product` });
            }
        }
        catch (error) {
            ProductController.unlinkUploadedFiles(req?.files);
            res.status(500).send(error.message);
        }
    };

    static deleteProduct = async (req: Request, res: Response) => {

        try {
            const productId = req.params.id;
            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM products WHERE id = ?`, [productId]
            );

            const productExists = data as Product[];
            if (!productExists.length) {
                res.status(404).send({ message: `Product with Id: ${productId} not found` });
            }

            let isDeleted: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE products SET status = ? WHERE id = ?`, [Status.Archived, productId]
                );
                isDeleted = data.affectedRows > 0;
            });

            if (isDeleted) {
                res.status(200).send({ message: `Product with Id: ${productId} is deleted` });
            } else {
                res.status(500).send({ message: `Product with Id: ${productId} is not deleted` });
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getProductsBySellerId = async (req: Request, res: Response) => {

        try {
            const sellerId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT prod.id, prod.name, prod.description, prod.about, prod.batch_no, prod.star_rate,
                        prod.is_returnable, prod.exp_date, prod.bar_code, price.price, ima.image, qty.left_qty,
                        qty.total_qty, prod_cat.category_id, offer.id AS offer_id, seller_prod.seller_id, cat.name as category
                        FROM products prod
                        INNER JOIN product_categories prod_cat ON prod.id = prod_cat.product_id
                        INNER JOIN seller_products seller_prod ON prod.id = seller_prod.product_id
                        INNER JOIN product_prices price ON prod.id = price.product_id
                        INNER JOIN product_quantity qty ON prod.id = qty.product_id
                        LEFT JOIN product_offers offer ON prod.id = offer.product_id
                        INNER JOIN categories cat ON cat.id = prod_cat.category_id
                        INNER JOIN product_images ima ON prod.id = ima.product_id 
                        WHERE seller_prod.seller_id = ? && prod.status = ?
                        group by prod.id
                        ORDER By prod.star_rate DESC`,
                [sellerId, Status.Active]
            );

            const products = data as ProductDetails[];
            if (products.length) {
                const productDetails = new Array<ProductDetails>();
                products.forEach(prod => {
                    const productDetail = new ProductDetails();
                    productDetail.id = prod.id;
                    productDetail.name = prod.name;
                    productDetail.description = prod.description;
                    productDetail.about = prod.about;
                    productDetail.star_rate = prod.star_rate;
                    productDetail.is_returnable = prod.is_returnable;
                    productDetail.exp_date = prod.exp_date;
                    productDetail.bar_code = prod.bar_code;
                    productDetail.price = prod.price;
                    productDetail.total_qty = prod.total_qty;
                    productDetail.left_qty = prod.left_qty;
                    productDetail.category_id = prod.category_id;
                    productDetail.category = prod.category;
                    productDetail.offer_id = prod.offer_id;
                    productDetail.seller_id = prod.seller_id;
                    productDetail.image=prod.image
                    productDetail.path = application.getImagePath.product + prod.image;
                    productDetails.push(productDetail);

                });
                res.status(200).json(productDetails);
            } else {
                res.status(404).send({message: `Products with Seller Id: ${sellerId} not found`});
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

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
                review.status = 2;
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
            ProductController.unlinkUploadedFiles(req?.files);
            res.status(500).send(error.message);
        }
    };

    static getSellerReviews = async (req: Request, res: Response) => {

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
                        INNER JOIN sellers ss ON ss.id=sp.seller_id
                        INNER JOIN product_images ima ON prod.id = ima.product_id
                        INNER JOIN review_ratings rr ON rr.product_id = prod.id
                        inner join status s on s.id=rr.status
                        inner join clients c on c.user_id=rr.user_id
                         WHERE ss.user_id = ?
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

export default ProductController;

