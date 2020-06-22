import { Request, Response } from 'express';
import { getRepository, IsNull, Equal, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { Categories} from '../entity';
import { CategoryModel } from '../models';


class SubCategoriesController {

    // Apis of categories

    static createSubCategory = async (req: Request, res: Response) => {

        const categoryModel = req.body as CategoryModel;
        const categoryRepository = getRepository(Categories);
        const category = new Categories();

        if (categoryModel.parent_category_id) {

            const errors = await validate(categoryModel);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }
        } else {
            res.status(400).send('Parent Id is required');
        }

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            category.name = categoryModel?.name;
            category.parent_category_id =  categoryModel?.parent_category_id;
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

        res.status(201).send('SubCategory created');
    };

    static getSubCategory = async (req: Request, res: Response) => {

        try {

            const categoryId = req.params?.id;
            const categoryRepository = getRepository(Categories);
            const subCategory = await categoryRepository.createQueryBuilder()
                .select("category")
                .from(Categories, "category")
                .where("category.id = :id", { id: categoryId })
                .getOne();

            if (subCategory) {
                res.status(200).json(subCategory);
            } else {
                res.status(404).send('Resource Not Found');
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getsubCategoriesByCategoryId = async (req: Request, res: Response) => {

        const categoryId = req.params.id;

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();

        try {

            const categories = await queryRunner.query(
                `WITH RECURSIVE category_path (id, name,parent_category_id) AS
            (
              SELECT id, name,parent_category_id
                FROM categories
                WHERE parent_category_id = ${categoryId}
              UNION ALL
              SELECT c.id, c.name,c.parent_category_id
                FROM category_path AS cp JOIN categories AS c
                  ON cp.id = c.parent_category_id
            )
            SELECT * FROM category_path
            ORDER BY parent_category_id;`
            );

            res.status(200).json(categories);
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static updateSubCategory = async (req: Request, res: Response) => {

        const model = req.body as CategoryModel;
        const categoryId = req.params.id;
        const categoryRepository = getRepository(Categories);

        try {
            await categoryRepository.findOneOrFail(categoryId);
        } catch (error) {
            res.status(404).send('Category not found');
            return;
        }

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await getConnection()
                .createQueryBuilder()
                .update(Categories)
                .set({ name: model.name })
                .where("id = :id", { id: categoryId })
                .execute();
                await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
                res.status(500).send(error.message);
            }
            finally {
                await queryRunner.release();
            }

        res.status(201).send('Updated category');
    };

    static deleteSubCategory = async (req: Request, res: Response) => {

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
                .where("id = :id", { id: categoryId })
                .execute();
                await queryRunner.commitTransaction();
            } catch (error) {
                await queryRunner.rollbackTransaction();
                res.status(500).send(error.message);
            }
            finally {
                await queryRunner.release();
            }
        res.status(201).send('Deleted Category');
    };


}

export default SubCategoriesController;