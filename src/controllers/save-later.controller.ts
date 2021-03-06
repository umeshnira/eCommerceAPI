import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { SaveLaterModel, UpdateSaveLaterDTO, AddSaveLaterDTO,SaveLaterViewModels } from '../models';
import { connect, transaction } from '../context/db.context';
import { application } from '../config/app-settings.json';

class SaveLaterController {

    static getSaveLaterItemsByUserId = async (req: Request, res: Response) => {

        try {
            const userId = req.params?.uid;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT prod.id as productId, prod.name, prod.description, price.price,
                        offer.offer_id, qty.left_qty, qty.total_qty, later.id as id, ima.image
                        FROM save_later later
                        INNER JOIN products prod ON prod.id = later.product_id
                        INNER JOIN product_prices price ON prod.id = price.product_id
                        LEFT JOIN product_offers offer ON prod.id = offer.product_id
                        INNER JOIN product_quantity qty ON prod.id = qty.product_id
                        INNER JOIN product_categories cat ON prod.id = cat.product_id
                        INNER JOIN product_images ima ON prod.id = ima.product_id WHERE later.user_id = ?
                        GROUP BY later.id`, [userId]
            );

            const saveLater = data as SaveLaterViewModels[];
            if (saveLater) {

                const saveLaterDetails = new Array<SaveLaterViewModels>();
                saveLater.forEach(x => {
                    const saveObj = new SaveLaterViewModels();
                    saveObj.id = x.id;
                    saveObj.name = x.name
                    saveObj.description = x.description
                    saveObj.price = x.price
                    saveObj.offer_id = x.offer_id
                    saveObj.left_qty = x.left_qty
                    saveObj.total_qty = x.total_qty
                    saveObj.productId = x.productId
                    saveObj.image = x.image
                    saveObj.path = application.getImagePath.product + x.image
                    saveLaterDetails.push(saveObj);
                });

                res.status(200).json(saveLaterDetails);
            } else {
                res.status(404).send(`Save Later with Id: ${userId} not found`);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static createSaveLater = async (req: Request, res: Response) => {

        try {
            const saveLaterDto = Object.assign(new AddSaveLaterDTO(), req.body);

            const errors = await validate(saveLaterDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const saveLater = saveLaterDto as SaveLaterModel;
            saveLater.created_at = new Date();

            let data: any;
            const pool = await connect();

            let saveLaterId: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO save_later SET ?`, [saveLater]
                );
                saveLaterId = data.insertId;
                [data] = await connection.query(
                    `DELETE FROM carts WHERE product_id = ? AND user_id = ?`, [saveLater.product_id, saveLater.user_id]
                );
            });

            if (saveLaterId) {
                res.status(201).send({ message : `Save later with Id: ${saveLaterId} is created` });
            } else {
                res.status(500).send(`Failed to add the product to save later`);
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static updateSaveLater = async (req: Request, res: Response) => {

        try {
            const saveLaterId = req.params.id;
            const saveLaterIDto = Object.assign(new UpdateSaveLaterDTO(), req.body);

            const errors = await validate(saveLaterIDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const saveLater = saveLaterIDto as SaveLaterModel;
            saveLater.updated_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM save_later WHERE id = ?`, [saveLaterId]
            );

            const saveLaterExists = data as SaveLaterModel[];
            if (!saveLaterExists.length) {
                res.status(404).send(`Save later with Id: ${saveLaterExists} not found`);
            }

            let isUpdated: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE save_later SET ? WHERE id = ?`, [saveLater, saveLaterId]
                );
                isUpdated = data.affectedRows > 0;
            });

            if (isUpdated) {
                res.status(200).send({ message : `Save later with Id: ${saveLaterId} is updated` });
            } else {
                res.status(500).send(`Save later with Id: ${saveLaterId} is not updated`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static deleteSaveLater = async (req: Request, res: Response) => {

        try {
            const saveLaterId = req.params.id;
            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM save_later WHERE id = ?`, [saveLaterId]
            );

            const saveLaterExists = data as SaveLaterModel[];
            if (!saveLaterExists.length) {
                res.status(404).send(`Save later with Id: ${saveLaterExists} not found`);
            }

            let isDeleted: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `DELETE FROM save_later  WHERE id = ?`, [saveLaterId]
                );
                isDeleted = data.affectedRows > 0;
            });

            if (isDeleted) {
                res.status(200).send({ message : `Save later with Id: ${saveLaterId} is deleted` });
            } else {
                res.status(500).send(`Save later with Id: ${saveLaterId} is not deleted`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static moveItemToSaveLater = async (req: Request, res: Response) => {

        try {
            const saveLaterDto = Object.assign(new AddSaveLaterDTO(), req.body);

            const errors = await validate(saveLaterDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const saveLater = saveLaterDto as SaveLaterModel;
            saveLater.created_at = new Date();

            let dataExists: any;
            const pool = await connect();

            await transaction(pool, async connection => {
                [dataExists] = await connection.query(
                    `SELECT 1 FROM save_later WHERE product_id = ? AND user_id = ?`, [saveLater.product_id, saveLater.user_id]
                );
            });

            if (!dataExists || dataExists.length === 0) {
                let saveLaterId: any;
                let data: any;
                await transaction(pool, async connection => {
                    [data] = await connection.query(
                        `INSERT INTO wishlist SET ?`, [saveLater]
                    );
                    saveLaterId = data.insertId;
                });

                if (saveLaterId) {
                    res.status(201).send({ message: `Moved the Item to Save Later with Id: ${saveLaterId}` });
                } else {
                    res.status(500).send({ message: `Failed to Add the product to Save Later` });
                }
            } else {
                res.status(200).send({ message: `Item already exists in SaveLater` });
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
}

export default SaveLaterController;