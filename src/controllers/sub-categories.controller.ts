import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { CategoryModel, CategorypathHeirarchy, AddSubCategoryDTO, UpdateSubCategoryDTO } from '../models';
import { CategoryListModel } from '../models/category-list.model';
import { connect, transaction } from '../context/db.context';
import { Status } from '../enums';


class SubCategoriesController {

    static getSubCategories = async (req: Request, res: Response) => {

        try {
            const connection = await connect();
            const [data] = await connection.query(
                `SELECT id, name, description, status, parent_category_id, created_by, created_at, updated_by,
                        updated_at FROM categories WHERE parent_category_id IS NOT NULL`
            );

            const categoriesListModels = data as CategoryListModel[];
            if (categoriesListModels.length) {

                const categories = new Array<CategoryListModel>();
                const mainCategories = categoriesListModels.filter(x => x.parent_category_id === null);

                for (const mainCategory of mainCategories) {
                    categories.push(new CategoryListModel(
                        mainCategory.id,
                        mainCategory.name,
                        mainCategory.inserted_at,
                        mainCategory.inserted_by
                    ));
                }

                const subCategories = categoriesListModels.filter(x => x.parent_category_id !== null);
                for (const subCategory of subCategories) {
                    SubCategoriesController.processCategoryHierarchy(categories, subCategory);
                }

                res.status(200).json(categories);
            } else {
                res.status(404).send('Sub categories not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getSubCategory = async (req: Request, res: Response) => {

        try {
            const subCategoryId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT id, name, description, status, parent_category_id, created_by, created_at, updated_by,
                        updated_at FROM categories WHERE parent_category_id IS NOT NULL`, [subCategoryId]
            );

            const categories = data as CategoryModel[];
            if (categories.length) {
                res.status(200).json(categories);
            } else {
                res.status(404).send(`Sub category with Id: ${subCategoryId} not found`);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getAllSubCategories = async (req: Request, res: Response) => {

        try {
            const connection = await connect();

            const [data] = await connection.query(
                `WITH RECURSIVE category_path (id, name,parent_category_id,inserted_by, inserted_at, path) AS
                 (
                    SELECT id, name,parent_category_id,inserted_by, inserted_at, name as path FROM categories
                           WHERE parent_category_id IS Not NULL
                    UNION ALL
                    SELECT c.id, c.name,c.parent_category_id,c.inserted_by, c.inserted_at, CONCAT(cp.path, ' > ',
                           c.name) FROM category_path AS cp JOIN categories AS c ON cp.id = c.parent_category_id
                )
                SELECT * FROM category_path
                ORDER BY path;`
            );

            const categories = data as CategorypathHeirarchy[];
            if (categories.length) {
                res.status(200).json(categories);
            } else {
                res.status(404).send('Sub categories not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getsubCategoriesByCategoryId = async (req: Request, res: Response) => {

        try {
            const subCategoryId = req.params.id;
            const connection = await connect();

            const [data] = await connection.query(
                `WITH RECURSIVE category_path (id, name,parent_category_id) AS
                 (
                     SELECT id, name,parent_category_id FROM categories
                             WHERE parent_category_id = ${subCategoryId}
                     UNION ALL
                     SELECT c.id, c.name,c.parent_category_id FROM category_path AS cp JOIN categories AS c
                            ON cp.id = c.parent_category_id
                )
                SELECT * FROM category_path
                ORDER BY parent_category_id;`
            );

            const categories = data as CategorypathHeirarchy[];
            if (categories.length) {
                res.status(200).json(categories);
            } else {
                res.status(404).send(`Sub category with Id: ${subCategoryId} not found`);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static createSubCategory = async (req: Request, res: Response) => {

        try {
            const subCategoryDto = Object.assign(new AddSubCategoryDTO(), req.body);

            const errors = await validate(subCategoryDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const subCategory = Object.assign(new CategoryModel(), subCategoryDto);
            subCategory.status = Status.Active;
            subCategory.created_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM categories WHERE name = ?`, [subCategory.name]
            );

            const subCategoryExists = data as CategoryModel[];
            if (subCategoryExists.length) {
                res.status(409).send('Sub category already exists');
                return;
            }

            let subCategoryId: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO categories SET ?`, [subCategory]
                );
                subCategoryId = data.insertId;
            });

            if (subCategoryId) {
                res.status(201).send(`Created a sub category with Id: ${subCategoryId}`);
            } else {
                res.status(500).send(`Failed to Create a sub category`);
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    };

    static updateSubCategory = async (req: Request, res: Response) => {
        try {
            const subCategoryId = req.params.id;
            const subCategoryDto = Object.assign(new UpdateSubCategoryDTO(), req.body);

            const errors = await validate(subCategoryDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const category = new CategoryModel();
            category.name = subCategoryDto.name;
            category.description = subCategoryDto.description;
            category.updated_by = subCategoryDto.updated_by;
            category.updated_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM categories WHERE id = ?`, [subCategoryId]
            );

            const categoryExists = data as CategoryModel[];
            if (!categoryExists.length) {
                res.status(404).send(`Sub category with Id: ${subCategoryId} not found`);
            }

            let isUpdated: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE categories SET ? WHERE id = ?`, [category, subCategoryId]
                );
                isUpdated = data.affectedRows > 0;
            });

            if (isUpdated) {
                res.status(200).send(`Sub category with Id: ${subCategoryId} is updated`);
            } else {
                res.status(500).send(`Sub category with Id: ${subCategoryId} is not updated`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static deleteSubCategory = async (req: Request, res: Response) => {
        try {
            const subCategoryId = req.params.id;
            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM categories WHERE parent_category_id IS NOT NULL AND id = ?`, [subCategoryId]
            );

            const subCategoryExists = data as CategoryModel[];
            if (!subCategoryExists.length) {
                res.status(404).send(`Sub category with Id: ${subCategoryId} not found`);
            }

            [data] = await pool.query(
                `SELECT * FROM categories WHERE parent_category_id = ?`, [subCategoryId]
            );

            const innerSubCategoryExists = data as CategoryModel[];
            if (innerSubCategoryExists.length) {
                res.status(209).send(`Sub category with Id: ${subCategoryId} has sub categories`);
            }

            let isDeleted: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE categories SET status = ? WHERE id = ?`, [Status.Archived, subCategoryId]
                );
                isDeleted = data.affectedRows > 0;
            });

            if (isDeleted) {
                res.status(200).send(`Sub category with Id: ${subCategoryId} is deleted`);
            } else {
                res.status(500).send(`Sub category with Id: ${subCategoryId} is not deleted`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
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