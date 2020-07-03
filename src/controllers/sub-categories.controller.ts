import { Request, Response } from 'express';
import { getRepository, IsNull, Equal, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { Categories } from '../entity';
import { CategoryModel } from '../models';
import { CategoryListModel } from '../models/category-list.model';


class SubCategoriesController {

    // Apis of categories

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
                res.status(404).send('Category Not Found');
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getSubCategories = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        try {

            const categoriesArray = await queryRunner.query(
                `SELECT id,name,created_by,created_at,parent_category_id
                FROM Categories;`
            );

            const categories = new Array<CategoryListModel>();
            const mainCategories = categoriesArray.filter(x => x.parent_category_id === null);

            for (const mainCategory of mainCategories) {
                categories.push(new CategoryListModel(
                    mainCategory.id,
                    mainCategory.name,
                    mainCategory.inserted_at,
                    mainCategory.inserted_by
                ));
            }

            const subCategories = categoriesArray.filter(x => x.parent_category_id !== null);
            for (const subCategory of subCategories) {
                SubCategoriesController.processCategoryHierarchy(categories, subCategory);
            }

            res.status(200).json(categories);
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getAllSubCategories = async (req: Request, res: Response) => {

        const parentCategoryRepository = getRepository(Categories);

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();

        try {

            const categories = await queryRunner.query(
                `WITH RECURSIVE category_path (id, name,parent_category_id,inserted_by, inserted_at, path) AS
                (
                SELECT id, name,parent_category_id,inserted_by, inserted_at, name as path
                    FROM categories
                    WHERE parent_category_id IS Not NULL
                UNION ALL
                SELECT c.id, c.name,c.parent_category_id,c.inserted_by, c.inserted_at, CONCAT(cp.path, ' > ', c.name)
                    FROM category_path AS cp JOIN categories AS c
                    ON cp.id = c.parent_category_id
                )
                SELECT * FROM category_path
                ORDER BY path;`
            );
            res.status(200).json(categories);
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

    static createSubCategory = async (req: Request, res: Response) => {

        const categoryModel = req.body as CategoryModel;
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
            const category = new CategoryModel().getMappedEntity(categoryModel);
            await queryRunner.manager.save(category);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

        res.status(204).send('SubCategory created');
    };

    static updateSubCategory = async (req: Request, res: Response) => {

        const model = req.body as CategoryModel;
        const categoryId = req.params.id;

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.getRepository(Categories).findOneOrFail(categoryId);
        } catch (error) {
            res.status(404).send('Category not found');
            return;
        }

        try {
            const result = await queryRunner.manager.connection
                .createQueryBuilder()
                .update(Categories)
                .set({
                    name: model.name,
                    description: model.description
                })
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

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.getRepository(Categories).findOneOrFail(categoryId);
        } catch (error) {
            res.status(404).send('Category not found');
            return;
        }

        try {
            await queryRunner.manager.connection
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
        res.status(204).send('Deleted Category');
    };

    private static processCategoryHierarchy(categories: CategoryListModel[], subCategory: CategoryListModel): boolean {
        const category = categories.find(x => x.id === subCategory.parent_category_id);
        if (category) {
            if (category.subCategories.findIndex(x => x.id === subCategory.id) === -1) {
                category.subCategories.push(new CategoryListModel(
                    subCategory.id,
                    subCategory.name,
                    subCategory.inserted_at,
                    subCategory.inserted_by,
                    subCategory.parent_category_id
                ));
                return true;
            }
        } else {
            for (const cat of categories) {
                const hasSubCategoryAdded = this.processCategoryHierarchy(cat.subCategories, subCategory);
                if (hasSubCategoryAdded) { break; };
            }
        }
    }
}

export default SubCategoriesController;