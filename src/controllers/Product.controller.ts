import { Request, Response } from 'express';
import { getRepository, IsNull, Equal, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { ProductCategories, Categories, Products } from '../entity';
import { CategoryModel, ProductModel, ProductCategoryModel } from '../models';


class ProductController {


    // Apis of products

    static createProduct = async (req: Request, res: Response) => {

        const productModel = req.body as ProductModel;
        const productCategoryModel = req.body as ProductCategoryModel;
        const productRepository = getRepository(Products);
        const productCategoryRepository = getRepository(ProductCategories);

        const product = new Products();
        const productCategory = new ProductCategories();

        const errors = await validate(productModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {

            await ProductController.modelMapping(productModel, product);
            const result = await productRepository.save(product);
            productCategory.products = product;
            productCategory.category = productCategoryModel?.category_id;
            productCategory.inserted_by = productCategoryModel?.inserted_by;
            await productCategoryRepository.save(productCategory);
        } catch (e) {
            res.status(409).send(e.message);
            return;
        }

        res.status(201).send('Product created');
    };

    static getAllProducts = async (req: Request, res: Response) => {


        try {

            const productRepository = getRepository(Products);
            const products = await productRepository.createQueryBuilder("products").getMany()
            if (products) {
                res.status(200).json(products);
            } else {
                res.status(404).send('Resource Not Found');
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
                res.status(404).send('Resource Not Found');
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

    static updateProduct = async (req: Request, res: Response) => {

        const productId = req.params.id;
        const productModel = req.body as ProductModel;
        const product = new Products();
        const productRepository = getRepository(Products);

        const errors = await validate(productModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await productRepository.findOneOrFail(productId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        try {
            const model = await ProductController.modelMapping(productModel, product);
            await productRepository
                .createQueryBuilder()
                .update(Products)
                .set(model)
                .where("id = :id", { id: productId })
                .execute();
            res.status(201).send("Updated Product");
        } catch (error) {
            res.status(500).send(error.message);
        }

    };

    static deleteProduct = async (req: Request, res: Response) => {

        const productId = req.params.id;
        const productRepository = getRepository(Products);
        let product: Products;

        try {
            product = await productRepository.findOneOrFail(productId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        try {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(ProductCategories)
                .where("product_id = :id", { id: productId })
                .execute();
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Products)
                .where("id = :id", { id: productId })
                .execute();

        } catch (error) {
            res.status(500).send(error.message);
            return;
        }
        res.status(201).send('Deleted Product');
    };

    static modelMapping = async (model, entityModel) => {

        if (entityModel instanceof Products) {
            entityModel.name = model?.name;
            entityModel.description = model?.description;
            entityModel.batch_no = model?.batch_no;
            entityModel.exp_date = model?.exp_date;
            entityModel.bar_code = model?.bar_code;
            entityModel.about = model?.about;
            entityModel.status = model?.status;
            entityModel.star_rate = model?.star_rate;
            entityModel.is_returnable = model?.is_returnable;
            entityModel.inserted_by = model?.inserted_by;
            entityModel.updated_by = model?.updated_by;

        }

        return entityModel;

    }

}
export default ProductController;

