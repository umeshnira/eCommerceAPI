import { Request, Response } from "express";
import { validate } from "class-validator";
import {
  CategoryModel,
  CategorypathHeirarchy,
  AddSubCategoryDTO,
  UpdateSubCategoryDTO,
} from "../models";
import { CategoryListModel } from "../models/categories/category-list.model";
import { connect, transaction } from "../context/db.context";
import { Status } from "../enums";

class SubCategoriesController {
  static getSubCategories = async (req: Request, res: Response) => {
    try {
      const connection = await connect();
      const [data] = await connection.query(
        `SELECT id, name, description, status, parent_category_id, created_by, created_at, updated_by,
                        updated_at FROM categories WHERE status = ?`,
        [Status.Active]
      );

      const categoriesListModels = data as CategoryListModel[];
      if (categoriesListModels.length) {
        const categories = new Array<CategoryListModel>();
        const mainCategories = categoriesListModels.filter(
          (x) => x.parent_category_id === null
        );
        for (const mainCategory of mainCategories) {
          categories.push(
            new CategoryListModel(
              mainCategory.id,
              mainCategory.name,
              mainCategory.created_at,
              mainCategory.created_by
            )
          );
        }

        const subCategories = categoriesListModels.filter(
          (x) => x.parent_category_id !== null
        );
        for (const subCategory of subCategories) {
          SubCategoriesController.processCategoryHierarchy(
            categories,
            subCategory
          );
        }

        res.status(200).json(categories);
      } else {
        res.status(404).send({ message: "Sub categories not found" });
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
                        updated_at FROM categories WHERE id = ?`,
        [subCategoryId]
      );

      const categories = data as CategoryModel[];
      if (categories.length) {
        res.status(200).json(categories[0]);
      } else {
        res.status(404).send({
          message: `Sub category with Id: ${subCategoryId} not found`,
        });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static getAllSubCategories = async (req: Request, res: Response) => {
    try {
      const connection = await connect();

      const [data] = await connection.query(
        `WITH RECURSIVE category_path (id, name,parent_category_id,created_by, created_at, status,path) AS
                (
                   SELECT id, name,parent_category_id,created_by, created_at,status,name as path FROM categories
                   WHERE parent_category_id IS NULL && status = ?
                   UNION ALL
                   SELECT c.id, c.name,c.parent_category_id,c.created_by, c.created_at ,c.status,CONCAT(cp.path, ' > ',
                          c.name) FROM category_path AS cp JOIN categories AS c ON cp.id = c.parent_category_id
               )
               SELECT * FROM category_path where status = ?;`,
        [Status.Active, Status.Active]
      );

      const categories = data as CategorypathHeirarchy[];
      if (categories.length) {
        res.status(200).json(categories);
      } else {
        res.status(404).send({ message: "Sub categories not found" });
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
        `SELECT id,name,created_by,created_at,parent_category_id
             FROM Categories WHERE status =?;`,
        [Status.Active]
      );

      const dataList = data as CategoryListModel[];
      const categories = new Array<CategoryListModel>();
      const mainCategories = dataList.filter(
        (x) => x.parent_category_id === Number(subCategoryId)
      );

      for (const mainCategory of mainCategories) {
        categories.push(
          new CategoryListModel(
            mainCategory.id,
            mainCategory.name,
            mainCategory.created_at,
            mainCategory.created_by
          )
        );
      }

      const subCategories = dataList.filter(
        (x) => x.parent_category_id !== null
      );
      for (const subCategory of subCategories) {
        SubCategoriesController.processCategoryHierarchy(
          categories,
          subCategory
        );
      }
      if (categories.length) {
        res.status(200).json(categories);
      } else {
        res.status(404).send({
          message: `Sub category with Id: ${subCategoryId} not found`,
        });
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

      const subCategory = subCategoryDto as CategoryModel;
      subCategory.status = Status.Active;
      subCategory.created_at = new Date();

      let data: any;
      const pool = await connect();

      [data] = await pool.query(`SELECT 1 FROM categories WHERE name = ? AND status = 1`, [
        subCategory.name,
      ]);

      const subCategoryExists = data as CategoryModel[];
      if (subCategoryExists.length) {
        res.status(409).send({ message: "Sub category already exists" });
        return;
      }

      [data] = await pool.query(
        `SELECT id FROM categories WHERE name = ? AND status != 1`,
        [subCategory.name]
      );

      let checkSubCategory = data as CategoryModel[];
      let subCategoryId: any;
      if (checkSubCategory?.length > 0) {
        await transaction(pool, async (connection) => {
          [data] = await connection.query(
            `UPDATE categories SET ? WHERE id = ?`,
            [subCategory, checkSubCategory[0]?.id]
          );
          if (data.affectedRows > 0) {
            subCategoryId = checkSubCategory[0]?.id;
          }
        });
      } else {
        await transaction(pool, async (connection) => {
          [data] = await connection.query(`INSERT INTO categories SET ?`, [
            subCategory,
          ]);
          subCategoryId = data.insertId;
        });
      }

      if (subCategoryId) {
        res.status(201).send({
          message: `Sub category with Id: ${subCategoryId} is created`,
        });
      } else {
        res.status(500).send({ message: `Failed to Create a sub category` });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static updateSubCategory = async (req: Request, res: Response) => {
    try {
      const subCategoryId = req.params.id;
      const subCategoryDto = Object.assign(
        new UpdateSubCategoryDTO(),
        req.body
      );

      const errors = await validate(subCategoryDto);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      const category = subCategoryDto as CategoryModel;
      category.updated_at = new Date();

      let data: any;
      const pool = await connect();

      [data] = await pool.query(`SELECT 1 FROM categories WHERE id = ?`, [
        subCategoryId,
      ]);

      const categoryExists = data as CategoryModel[];
      if (!categoryExists.length) {
        res.status(404).send({
          message: `Sub category with Id: ${subCategoryId} not found`,
        });
      }

      let isUpdated: any;
      await transaction(pool, async (connection) => {
        [data] = await connection.query(
          `UPDATE categories SET ? WHERE id = ?`,
          [category, subCategoryId]
        );
        isUpdated = data.affectedRows > 0;
      });

      if (isUpdated) {
        res.status(200).send({
          message: `Sub category with Id: ${subCategoryId} is updated`,
        });
      } else {
        res.status(500).send({
          message: `Sub category with Id: ${subCategoryId} is not updated`,
        });
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
        `SELECT 1 FROM categories WHERE parent_category_id IS NOT NULL AND id = ?`,
        [subCategoryId]
      );

      const subCategoryExists = data as CategoryModel[];
      if (!subCategoryExists.length) {
        res.status(404).send({
          message: `Sub category with Id: ${subCategoryId} not found`,
        });
      }

      [data] = await pool.query(
        `SELECT * FROM categories WHERE parent_category_id = ?`,
        [subCategoryId]
      );

      const innerSubCategoryExists = data as CategoryModel[];
      if (innerSubCategoryExists.length) {
        res.status(209).send({
          message: `Sub category with Id: ${subCategoryId} has sub categories`,
        });
      }

      let isDeleted: any;
      await transaction(pool, async (connection) => {
        [data] = await connection.query(
          `UPDATE categories SET status = ? WHERE id = ?`,
          [Status.Archived, subCategoryId]
        );
        isDeleted = data.affectedRows > 0;
      });

      if (isDeleted) {
        res.status(200).send({
          message: `Sub category with Id: ${subCategoryId} is deleted`,
        });
      } else {
        res.status(500).send({
          message: `Sub category with Id: ${subCategoryId} is not deleted`,
        });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  private static processCategoryHierarchy(
    categories: CategoryListModel[],
    subCategory: CategoryListModel
  ): boolean {
    const category = categories.find(
      (x) => x.id === subCategory.parent_category_id
    );
    if (category) {
      if (
        category.subCategories.findIndex((x) => x.id === subCategory.id) === -1
      ) {
        category.subCategories.push(
          new CategoryListModel(
            subCategory.id,
            subCategory.name,
            subCategory.created_at,
            subCategory.created_by,
            subCategory.parent_category_id
          )
        );
        return true;
      }
    } else {
      for (const cat of categories) {
        const hasSubCategoryAdded = this.processCategoryHierarchy(
          cat.subCategories,
          subCategory
        );
        if (hasSubCategoryAdded) {
          break;
        }
      }
    }
  }
}

export default SubCategoriesController;
