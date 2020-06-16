import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import ModelParser from './requestparser/productType.parser';

import { ProductCategoryEntity } from '../entity/ProductCategoryEntity';

class ProductCategoryController {

    static createProductCategory = async (req: Request, res: Response) => {

        const model = ModelParser.productTypeModel(req);

        const category = new ProductCategoryEntity();

        const errors = await validate(model);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const productCategoryRepository = getRepository(ProductCategoryEntity);
        try {
            await productCategoryRepository.save(category);
        } catch (e) {
            res.status(409).send(e.message);
            return;
        }

        res.status(201).send('Product Category created');
    };

    static getAllproductCategories = async (req: Request, res: Response) => {

        const productCategoryRepository = getRepository(ProductCategoryEntity);
        const categories = await productCategoryRepository.find({ select: ['id', 'name', 'description'] });

        res.status(200).send(categories);
    };

}

export default ProductCategoryController;