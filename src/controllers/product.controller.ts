import { Request, Response } from 'express';
import { getRepository, IsNull, Equal, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { ProductCategories, Categories, Products, ProductOffers, ProductPrices, ProductQuantity } from '../entity';
import { CategoryModel, ProductModel, ProductCategoryModel, ProductOffersModel, ProductQuantityModel, ProductPricesModel } from '../models';
import settings from '../config/app-settings.json';
import path from 'path';
import file_upload from '../utils/image-upload';

class ProductController {

    // Apis of products

    static getAllProducts = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            const result = await queryRunner.manager.connection
                .createQueryBuilder(Products, 'p')
                .addSelect('p.id','id')
                .addSelect('p.name','name')
                .addSelect('p.description','description')
                .addSelect('p.star_rate','star_rate')
                .addSelect('pp.price','price')
                .innerJoin(ProductPrices, 'pp', 'pp.product_id = p.id')
                .getRawMany();
                
            await queryRunner.commitTransaction();
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).send('Products Not Found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getProduct = async (req: Request, res: Response) => {

        try {

            const productId = req.params?.id;
            const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const result = await queryRunner.manager.connection
                .createQueryBuilder(Products, 'p')
                // .select(['p.id', 'p.name', 'p.description', 'p.star_rate','p.batch_no','p.exp_date','p.bar_code', 'pp.price', 'pp.price_without_offer','po.offer_id','pq.left_qty','pq.tota_qty','pc.category_id','pc.status'])
                .addSelect('p.id','id')
                .addSelect('p.name','name')
                .addSelect('p.description','description')
                .addSelect('p.star_rate','star_rate')
                .addSelect('pp.price','price')
                .addSelect('p.batch_no','batch_no')
                .addSelect('p.exp_date','exp_date')
                .addSelect('p.bar_code','bar_code')
                .addSelect('pp.price','price')
                .addSelect('pp.price_without_offer','price_without_offer')
                .addSelect('po.offer_id','offer_id')
                .addSelect('pq.left_qty','left_qty')
                .addSelect('pq.tota_qty','tota_qty')
                .addSelect('pc.category_id','category_id')
                .addSelect('pc.status','status')
                .innerJoin(ProductPrices, 'pp', 'pp.product_id = p.id')
                .innerJoin(ProductOffers, 'po', 'po.product_id = p.id')
                .innerJoin(ProductQuantity, 'pq', 'pq.product_id = p.id')
                .innerJoin(ProductCategories, 'pc', 'pc.product_id = p.id')
                .where("p.id = :id", { id: productId })
                .getRawOne();

            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).send('Product Not Found');
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getAllProductAganistCategoryId = async (req: Request, res: Response) => {

        const categoryId = req.params.id;
        const productRepository = getRepository(Products);

        try {
            const products = await productRepository
                .find({
                    select: ['id', 'name', 'description'],
                    where: { category_id: categoryId }
                });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static createProduct = async (req: any, res: Response) => {
// console.log(req.body);
// console.log(req.files);
        const productModel = req.body.product as ProductModel;
        console.log(productModel);
        const productCategoryModel = req.body.product.category as ProductCategoryModel;
        console.log(productCategoryModel);
        const productOffersModel = req.body.product.offer as ProductOffersModel;
        console.log(productOffersModel);
        const productQuantityModel = req.body.product.quantity as ProductQuantityModel;
        console.log(productQuantityModel);
        const productPricesModel = req.body.product.price as ProductPricesModel;
        console.log(productPricesModel);

        const errors = await validate(productModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            const product = await new ProductModel().getMappedEntity(productModel);
            const productCategory = await new ProductCategoryModel().getMappedEntity(productCategoryModel);
            const productOffers = await new ProductOffersModel().getMappedEntity(productOffersModel);
            const productQuantity = await new ProductQuantityModel().getMappedEntity(productQuantityModel);
            const productPrices = await new ProductPricesModel().getMappedEntity(productPricesModel);
            productCategory.products = product;
            productOffers.products = product;
            productQuantity.products = product;
            productPrices.products = product;
            const result = await queryRunner.manager.save(product);


            await queryRunner.manager.save(productCategory);
            await queryRunner.manager.save(productOffers);
            await queryRunner.manager.save(productQuantity);
            await queryRunner.manager.save(productPrices);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

        res.status(201).send('Product created');
    };

    static updateProduct = async (req: Request, res: Response) => {

        const productId = req.params.id;
        const productModel = req.body.product as ProductModel;
        const productCategoryModel = req.body.category as ProductCategoryModel;
        const productOffersModel = req.body.offer as ProductOffersModel;
        const productQuantityModel = req.body.quantity as ProductQuantityModel;
        const productPricesModel = req.body.price as ProductPricesModel;

        const errors = await validate(productModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.findOneOrFail(productId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        try {
            const product = await new ProductModel().getMappedEntity(productModel);
            const productCategory = await new ProductCategoryModel().getMappedEntity(productCategoryModel);
            const productOffers = await new ProductOffersModel().getMappedEntity(productOffersModel);
            const productQuantity = await new ProductQuantityModel().getMappedEntity(productQuantityModel);
            const productPrices = await new ProductPricesModel().getMappedEntity(productPricesModel);

            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(Products)
                .set(product)
                .where("id = :id", { id: productId })
                .execute();

            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(ProductCategories)
                .set(productCategory)
                .where("product_id = :id", { id: productId })
                .execute();

            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(ProductOffers)
                .set(productOffers)
                .where("product_id = :id", { id: productId })
                .execute();

            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(ProductQuantity)
                .set(productQuantity)
                .where("product_id = :id", { id: productId })
                .execute();

            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(ProductPrices)
                .set(productPrices)
                .where("product_id = :id", { id: productId })
                .execute();

            await queryRunner.commitTransaction();

        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

        res.status(204).send("Updated Product");
    };

    static deleteProduct = async (req: Request, res: Response) => {

        const productId = req.params.id;

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.findOneOrFail(productId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        try {
            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(ProductCategories)
                .where("product_id = :id", { id: productId })
                .execute();
            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(Products)
                .where("id = :id", { id: productId })
                .execute();
            await queryRunner.commitTransaction();

        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

        res.status(204).send('Deleted Product');
    };
}

export default ProductController;

