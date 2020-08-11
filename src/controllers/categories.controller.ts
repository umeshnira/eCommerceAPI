import { Request, Response } from 'express';
import { CategoryModel, AddCategoryDTO, UpdateCategoryDTO } from '../models';
import { connect, transaction } from '../context/db.context';
import { Status } from '../enums';
import { validate } from 'class-validator';

class CategoriesController {

    static getCategories = async (req: Request, res: Response) => {

        try {
            const connection = await connect();
            const [data] = await connection.query(
                `SELECT id, name, description, status,parent_category_id, created_by, created_at, updated_by, updated_at
                        FROM categories
                        WHERE status = ?`,[Status.Active]
            );

            const categories = data as CategoryModel[];
            if (categories.length) {
                res.status(200).json(categories);
            } else {
                res.status(404).send('Categories not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getCategory = async (req: Request, res: Response) => {

        try {
            const categoryId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT id, name, description, status, created_by, created_at, updated_by, updated_at
                 FROM categories
                 WHERE parent_category_id IS NULL AND id = ?`, [categoryId]
            );

            const categories = data as CategoryModel[];
            if (categories.length) {
                res.status(200).json(categories[0]);
            } else {
                res.status(404).send(`Category with Id: ${categoryId} not found`);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static createCategory = async (req: Request, res: Response) => {

        try {
            const categoryDto = Object.assign(new AddCategoryDTO(), req.body);

            const errors = await validate(categoryDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const category = categoryDto as CategoryModel;
            category.status = Status.Active;
            category.created_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM categories WHERE name = ?`, [category.name]
            );

            const categoryExists = data as CategoryModel[];
            if (categoryExists.length) {
                res.status(409).send('Category already exists');
                return;
            }

            let categoryId: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO categories SET ?`, [category]
                );
                categoryId = data.insertId;
            });

            if (categoryId) {
                res.status(201).send({ message : `Category with Id: ${categoryId} is created` });
            } else {
                res.status(500).send(`Failed to CreatE a category`);
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    };

    static updateCategory = async (req: Request, res: Response) => {

        try {
            const categoryId = req.params.id;
            const categoryDto = Object.assign(new UpdateCategoryDTO(), req.body);

            const errors = await validate(categoryDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const category = categoryDto as CategoryModel;
            category.updated_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM categories WHERE id = ?`, [categoryId]
            );

            const categoryExists = data as CategoryModel[];
            if (!categoryExists.length) {
                res.status(404).send(`Category with Id: ${categoryId} not found`);
            }

            let isUpdated: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE categories SET ? WHERE id = ?`, [category, categoryId]
                );
                isUpdated = data.affectedRows > 0;
            });

            if (isUpdated) {
                res.status(200).send({ message : `Category with Id: ${categoryId} is updated` });
            } else {
                res.status(500).send(`Category with Id: ${categoryId} is not updated`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static deleteCategory = async (req: Request, res: Response) => {

        try {
            const categoryId = req.params.id;
            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM categories WHERE id = ?`, [categoryId]
            );

            const categoryExists = data as CategoryModel[];
            if (!categoryExists.length) {
                res.status(404).send(`Category with Id: ${categoryId} not found`);
            }

            [data] = await pool.query(
                `SELECT * FROM categories WHERE parent_category_id = ?`, [categoryId]
            );

            const subCategoryExists = data as CategoryModel[];
            if (subCategoryExists.length) {
                res.status(209).send(`Category with Id: ${categoryId} has sub categories`);
            }

            let isDeleted: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE categories SET status = ? WHERE id = ?`, [Status.Archived, categoryId]
                );
                isDeleted = data.affectedRows > 0;
            });

            if (isDeleted) {
                res.status(200).send({ message : `Category with Id: ${categoryId} is deleted` });
            } else {
                res.status(500).send(`Category with Id: ${categoryId} is not deleted`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };
}

export default CategoriesController;