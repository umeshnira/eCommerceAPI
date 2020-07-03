import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { Products, ProductOffers, ProductPrices, ProductQuantity, ProductImages, ProductCategories, Categories } from '../entity';
import { ProductModel, ProductCategoryModel, ProductOffersModel, ProductQuantityModel, ProductPricesModel, ProductImagesModel } from '../models';
import { application } from '../config/app-settings.json';
import * as fs from 'fs';

class ProductController {

    static getProducts = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {

            await queryRunner.connect();

            const result = await queryRunner.manager.connection
                .createQueryBuilder(Products, 'p')
                .addSelect('p.id', 'id')
                .addSelect('p.name', 'name')
                .addSelect('p.description', 'description')
                .addSelect('p.star_rate', 'star_rate')
                .addSelect('pp.price', 'price')
                .addSelect('pi.image', 'image')
                .innerJoin(ProductPrices, 'pp', 'pp.product_id = p.id')
                .innerJoin(ProductImages, 'pi', 'pi.product_id = p.id')
                .getRawMany();

            if (result) {
                result.forEach(x => x.image = application.getImagePath.product + x.image);
                res.status(200).json(result);
            } else {
                res.status(404).send('Products not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        } finally {
            await queryRunner.release();
        }
    };

    static getProduct = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {

            const productId = req.params?.id;
            await queryRunner.connect();

            const result = await queryRunner.manager.connection
                .createQueryBuilder(Products, 'p')
                .addSelect('p.id', 'id')
                .addSelect('p.name', 'name')
                .addSelect('p.description', 'description')
                .addSelect('p.star_rate', 'star_rate')
                .addSelect('pp.price', 'price')
                .addSelect('p.batch_no', 'batch_no')
                .addSelect('p.exp_date', 'exp_date')
                .addSelect('p.bar_code', 'bar_code')
                .addSelect('pp.price_without_offer', 'price_without_offer')
                .addSelect('po.offer_id', 'offer_id')
                .addSelect('pq.left_qty', 'left_qty')
                .addSelect('pq.tota_qty', 'tota_qty')
                .addSelect('pc.category_id', 'category_id')
                .addSelect('pc.status', 'status')
                .innerJoin(ProductPrices, 'pp', 'pp.product_id = p.id')
                .innerJoin(ProductOffers, 'po', 'po.product_id = p.id')
                .innerJoin(ProductQuantity, 'pq', 'pq.product_id = p.id')
                .innerJoin(ProductCategories, 'pc', 'pc.product_id = p.id')
                .where('p.id = :id', { id: productId })
                .getRawOne();

            const imageResult = await queryRunner.manager.connection
                .createQueryBuilder(ProductImages, 'p')
                .select('p.image', 'image')
                .where('p.product_id = :id', { id: productId })
                .getRawMany();

            if (result) {
                imageResult.forEach(x => x.path = application.getImagePath.product + x.image);
                result.images = imageResult;
                res.status(200).json(result);
            } else {
                res.status(404).send(`Product with id: ${productId}  not found`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        } finally {
            await queryRunner.release();
        }
    };

    static getProductsByCategoryId = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {

            const categoryId = req.params.id;
            await queryRunner.connect();


            const result = await queryRunner.manager.connection
                .createQueryBuilder(Products, 'p')
                .addSelect('p.id', 'id')
                .addSelect('p.name', 'name')
                .addSelect('p.description', 'description')
                .addSelect('p.star_rate', 'star_rate')
                .addSelect('pp.price', 'price')
                .addSelect('pi.image', 'image')
                .addSelect('pc.category_id', 'category_id')
                .addSelect('c.name', 'category_name')
                .innerJoin(ProductPrices, 'pp', 'pp.product_id = p.id')
                .innerJoin(ProductImages, 'pi', 'pi.product_id = p.id')
                .innerJoin(ProductCategories, 'pc', 'pc.product_id = p.id')
                .innerJoin(Categories, 'c', 'pc.category_id = c.id')
                .where('c.id = :id', { id: categoryId })
                .getRawMany();

            if (result) {
                result.forEach(x => x.image = application.getImagePath.product + x.image);
                res.status(200).json(result);
            }

        } catch (error) {
            res.status(500).send(error.message);
        } finally {
            await queryRunner.release();
        }
    };

    static createProduct = async (req: any, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {

            const parsedData = JSON.parse(req.body.data)
            const productModel = parsedData as ProductModel;
            const productCategoryModel = parsedData.category as ProductCategoryModel;
            const productOffersModel = parsedData.offer as ProductOffersModel;
            const productQuantityModel = parsedData.quantity as ProductQuantityModel;
            const productPricesModel = parsedData.price as ProductPricesModel;

            const errors = await validate(productModel);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            await queryRunner.connect();
            await queryRunner.startTransaction();

            const product = await new ProductModel().getMappedEntity(productModel);
            await queryRunner.manager.save(product);

            const productCategory = await new ProductCategoryModel().getMappedEntity(productCategoryModel);
            productCategory.products = product;
            await queryRunner.manager.save(productCategory);

            const productQuantity = await new ProductQuantityModel().getMappedEntity(productQuantityModel);
            productQuantity.products = product;
            await queryRunner.manager.save(productQuantity);

            const productPrices = await new ProductPricesModel().getMappedEntity(productPricesModel);
            productPrices.products = product;
            await queryRunner.manager.save(productPrices);

            if (productOffersModel) {
                const productOffers = await new ProductOffersModel().getMappedEntity(productOffersModel);
                productOffers.products = product;
                await queryRunner.manager.save(productOffers);
            }

            for (const file of req?.files) {
                const productImagesModel = new ProductImagesModel();
                productImagesModel.image = file.filename;
                productImagesModel.inserted_by = productModel.created_by;
                productImagesModel.inserted_at = new Date();

                const productImages = await new ProductImagesModel().getMappedEntity(productImagesModel);
                productImages.products = product;
                await queryRunner.manager.save(productImages);
            }

            await queryRunner.commitTransaction();

            res.status(201).send('Product created');
        }
        catch (error) {
            ProductController.unlinkUploadedFiles(req?.files);
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }
    };

    static updateProduct = async (req: any, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {

            const productId = req.params.id;
            const parsedData = JSON.parse(req.body.data);
            const productModel = parsedData as ProductModel;
            const productCategoryModel = parsedData.category as ProductCategoryModel;
            const productOffersModel = parsedData.offer as ProductOffersModel;
            const productQuantityModel = parsedData.quantity as ProductQuantityModel;
            const productPricesModel = parsedData.price as ProductPricesModel;
            //const productImageObj = parsedData.images;

            const errors = await validate(productModel);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            await queryRunner.connect();
            await queryRunner.startTransaction();

            const product = await new ProductModel().getMappedEntity(productModel);
            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(Products)
                .set(product)
                .where('id = :id', { id: productId })
                .execute();

            const productCategory = await new ProductCategoryModel().getMappedEntity(productCategoryModel);
            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(ProductCategories)
                .set(productCategory)
                .where('product_id = :id', { id: productId })
                .execute();

            if (productOffersModel) {
                const productOffers = await new ProductOffersModel().getMappedEntity(productOffersModel);
                await queryRunner.manager.connection
                    .createQueryBuilder()
                    .update(ProductOffers)
                    .set(productOffers)
                    .where('product_id = :id', { id: productId })
                    .execute();
            }

            const productQuantity = await new ProductQuantityModel().getMappedEntity(productQuantityModel);
            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(ProductQuantity)
                .set(productQuantity)
                .where('product_id = :id', { id: productId })
                .execute();

            const productPrices = await new ProductPricesModel().getMappedEntity(productPricesModel);
            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(ProductPrices)
                .set(productPrices)
                .where('product_id = :id', { id: productId })
                .execute();


            const imageResult = await queryRunner.manager.connection
                .createQueryBuilder(ProductImages, 'p')
                .select('p.image', 'image')
                .where('p.product_id = :id', { id: productId })
                .getRawMany();

            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(ProductImages)
                .where('product_id = :id', { id: productId })
                .execute();

            for (const file of req?.files) {
                const productImagesModel = new ProductImagesModel();
                productImagesModel.image = file.filename;
                productImagesModel.updated_by = productModel.updated_by;
                productImagesModel.updated_at = new Date();
                productImagesModel.inserted_at = new Date();
                productImagesModel.product_id = productId;

                const productImages = await new ProductImagesModel().getMappedEntity(productImagesModel);
                console.log(productImages)
                await queryRunner.manager.connection
                await queryRunner.manager.save(productImages);
            }
            const files = [];
            for (const image of imageResult) {
                files.push({ path: application.storage.product + image.image });
            }
            ProductController.unlinkUploadedFiles(files);
            await queryRunner.commitTransaction();

            res.status(204).send('Product is upadted');

        } catch (error) {
            ProductController.unlinkUploadedFiles(req?.files);
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }
    };

    static deleteProduct = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {
            const productId = req.params.id;

            await queryRunner.connect();
            await queryRunner.startTransaction();

            const prod = await queryRunner.manager.findOneOrFail<Products>(productId);
            if (!prod) {
                res.status(404).send(`Product with id: ${productId}  not found`);
                return;
            }

            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(ProductCategories)
                .where('product_id = :id', { id: productId })
                .execute();

            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(ProductOffers)
                .where('product_id = :id', { id: productId })
                .execute();

            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(ProductQuantity)
                .where('product_id = :id', { id: productId })
                .execute();

            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(ProductPrices)
                .where('product_id = :id', { id: productId })
                .execute();

            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(ProductImages)
                .where('product_id = :id', { id: productId })
                .execute();

            const images = await getConnection()
                .createQueryBuilder()
                .select('image')
                .from(ProductImages, 'image')
                .where('image.product_id = :id', { id: productId })
                .getMany();

            const files = [];
            for (const image of images) {
                files.push({ path: image.image });
            }
            ProductController.unlinkUploadedFiles(files);

            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(Products)
                .where('id = :id', { id: productId })
                .execute();

            await queryRunner.commitTransaction();

            res.status(204).send('Product is deleted');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
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

