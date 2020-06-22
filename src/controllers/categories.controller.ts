import { Request, Response } from 'express';
import { getRepository, getConnection, IsNull } from 'typeorm';
import { validate } from 'class-validator';
import { Categories } from '../entity';
import { CategoryModel } from '../models';


class CategoriesController {

    // Apis of categories

    static createCategory = async (req: Request, res: Response) => {

        const categoryModel = req.body as CategoryModel;
        const categoryRepository = getRepository(Categories);
        const category = new Categories();

        const errors = await validate(categoryModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            category.name = categoryModel?.name;
            category.parent_category_id = categoryModel?.parent_category_id;
            category.inserted_by = categoryModel?.inserted_by;
            await categoryRepository.save(category);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

        res.status(201).send('Category created');
    };

    static getCategories = async (req: Request, res: Response) => {

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

    static getCategory = async (req: Request, res: Response) => {

        try {

            const categoryId = req.params?.id;
            const categoryRepository = getRepository(Categories);
            const category = await categoryRepository.createQueryBuilder()
                .select("category")
                .from(Categories, "category")
                .where("category.id = :id", { id: categoryId })
                .getOne();

            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).send('Resource Not Found');
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static updateCategory = async (req: Request, res: Response) => {

        const model = req.body as CategoryModel;
        const categoryId = req.params.id;
        const categoryRepository = getRepository(Categories);

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

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
            res.status(201).send("Updated category")
            res.status(204).send();
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
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

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Categories)
                .where("id = :id && parent_category_id: IsNull()", { id: categoryId })
                .execute();
            res.status(201).send("Deleted category");
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }
    };


}

export default CategoriesController;