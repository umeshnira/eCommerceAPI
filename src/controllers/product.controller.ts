import { Request, Response } from 'express';
import { getRepository, IsNull, Equal, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { ProductCategories, Categories, Products } from '../entity';
import { CategoryModel, ProductModel, ProductCategoryModel } from '../models';

class ProductController {

    // Apis of products

    static getAllProducts = async (req: Request, res: Response) => {

        try {

            const productRepository = getRepository(Products);
            const products = await productRepository.createQueryBuilder("products").getMany()
            if (products) {
                res.status(200).json(products);
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
            const productRepository = getRepository(Products);
            const product = await productRepository.createQueryBuilder()
                .select("product")
                .from(Products, "product")
                .where("product.id = :id", { id: productId })
                .getOne();

            if (product) {
                res.status(200).json(product);
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

    static createProduct = async (req: Request, res: Response) => {

        const productModel = req.body as ProductModel;
        const productCategoryModel = req.body as ProductCategoryModel;

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
            productCategory.products = product;
            const result = await queryRunner.manager.save(product);
            await queryRunner.manager.save(productCategory);

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
        const productModel = req.body as ProductModel;

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
            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(Products)
                .set(product)
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

