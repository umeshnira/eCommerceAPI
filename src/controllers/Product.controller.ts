import { Request, Response } from 'express';
import { getRepository, IsNull, Equal, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { ProductCategories, Categories, Products } from '../entity';
import { CategoryModel, ProductModel, ProductCategoryModel } from '../models';


class ProductController {

    // Apis of categories

    static createCategory = async (req: Request, res: Response) => {

        const categoryModel = req.body as CategoryModel;
        const categoryRepository = getRepository(Categories);

        const errors = await validate(categoryModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await categoryRepository.save(categoryModel);
        } catch (e) {
            res.status(409).send(e.message);
            return;
        }

        res.status(201).send('Category created');
    };

    static getAllParentCategories = async (req: Request, res: Response) => {

        const parentCategoryRepository = getRepository(Categories);

        try {
            const categories = await parentCategoryRepository
                .find({
                    select: ['id', 'name'],
                    where: { parent_category_id: IsNull() }
                });
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getsubCategoriesAganistCategoryId = async (req: Request, res: Response) => {

        const categoryId = req.params.id;
        const parentCategoryRepository = getRepository(Categories);

        try {
            const categories = await parentCategoryRepository
                .find({
                    select: ['parent_category_id', 'id', 'name'],
                    where: { parent_category_id: categoryId }
                });

            res.status(200).json(categories);
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static updateCategory = async (req: Request, res: Response) => {

        const model = req.body as CategoryModel;
        const categoryId = req.params.id;
        const categoryRepository = getRepository(Categories);

        try {
            await categoryRepository.findOneOrFail(categoryId);
        } catch (error) {
            res.status(404).send('Category not found');
            return;
        }

        try {
            const result = await getConnection()
                .createQueryBuilder()
                .update(Categories)
                .set({ name: model.name })
                .where("id = :id", { id: categoryId })
                .execute();
        } catch (e) {
            res.status(409).send('category name already in use');
            console.log(e.message);
            return;
        }

        res.status(204).send('Updated category');
    };

    static deleteCategory = async (req: Request, res: Response) => {

        const categoryId = req.params.id;
        const categoryRepository = getRepository(Categories);
        let category: Categories;

        try {
            category = await categoryRepository.findOneOrFail(categoryId);
        } catch (error) {
            res.status(404).send('Category not found');
            return;
        }

        try {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Categories)
                .where("id = :id", { id: categoryId })
                .execute();
        } catch (error) {

        }
        res.status(201).send('Deleted Category');
    };

    // Apis of products

    static createProduct = async (req: Request, res: Response) => {

        const productModel = req.body as ProductModel;
        const productCategoryModel = req.body as ProductCategoryModel;
        const productRepository = getRepository(Products);
        const productCategoryRepository = getRepository(ProductCategories);

        let product = new Products();
        product = productModel;
        const productCategory = new ProductCategories();

        const errors = await validate(productModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {

            const result = await productRepository.save(product);
            productCategory.products = product;
            productCategory.category = productCategoryModel.category_id;
            productCategory.inserted_by = productCategoryModel.inserted_by;
            await productCategoryRepository.save(productCategory);
        } catch (e) {
            res.status(409).send(e.message);
            return;
        }

        res.status(201).send('Product created');
    };

    static getAllProducts = async (req: Request, res: Response) => {

        const productRepository = getRepository(Products);

        try {
            const products = await productRepository
                .find({ select: ['id', 'name', 'description'] });
            res.status(200).json(products);
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

    static updateProduct = async (req: Request, res: Response) => {

        const productModel = req.body as ProductModel;
        const productId = req.params.id;
        const productRepository = getRepository(Products);

        try {
            await productRepository.findOneOrFail(productId);
        } catch (error) {
            res.status(404).send('Product not found');
            return;
        }

        try {
            const result = await getConnection()
                .createQueryBuilder()
                .update(Products)
                .set({ name: productModel.name })
                .where("id = :id", { id: productId })
                .execute();
        } catch (e) {
            res.status(409).send('Product name already in use');
            console.log(e.message);
            return;
        }

        res.status(204).send('Updated Product');
    };

    static deleteProduct = async (req: Request, res: Response) => {

        const productId = req.params.id;
        const productRepository = getRepository(Products);
        let product: Products;

        try {
            product = await productRepository.findOneOrFail(productId);
        } catch (error) {
            res.status(404).send('Category not found');
            return;
        }

        try {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Products)
                .where("id = :id", { id: productId })
                .execute();
        } catch (error) {

        }
        res.status(201).send('Deleted Category');
    };



}

export default ProductController;