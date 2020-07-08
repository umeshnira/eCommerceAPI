import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { SellerModel, UserModel, AddSellerDTO, UpdateSellerDTO, AddUserDTO } from '../models';
import { connect, transaction } from '../context/db.context';
import { Status } from '../enums';

class SellersController {

    static getAllSellers = async (req: Request, res: Response) => {

        try {
            const connection = await connect();
            const [data] = await connection.query(
                `SELECT id, user_id, name, address, landmark, pin_code, email, phone,  created_by, created_at,
                        updated_by, updated_at FROM sellers`
            );

            const sellers = data as SellerModel[];
            if (sellers.length) {
                res.status(200).json(sellers);
            } else {
                res.status(404).send('Sellers not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getSeller = async (req: Request, res: Response) => {

        try {
            const sellerId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT id, user_id, name, address, landmark, pin_code, email, phone, aadhar_card_no,
                        pan_card_no, bank_name, bank_ac_no, branch_name, ifsc_code, created_by, created_at,
                        updated_by, updated_at FROM sellers WHERE id = ?`, [sellerId]
            );

            const sellers = data as SellerModel[];
            if (sellers.length) {
                res.status(200).json(sellers[0]);
            } else {
                res.status(404).send(`Seller with Id: ${sellerId} not found`);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static createSeller = async (req: Request, res: Response) => {

        try {
            const sellerDto = Object.assign(new AddSellerDTO(), req.body);
            const userDto = Object.assign(new AddUserDTO(), req.body);

            const sellerErrors = await validate(sellerDto);
            if (sellerErrors.length > 0) {
                res.status(400).send(sellerErrors);
                return;
            }

            const userErrors = await validate(userDto);
            if (userErrors.length > 0) {
                res.status(400).send(userErrors);
                return;
            }

            const seller = sellerDto as SellerModel;
            seller.status = Status.Active;
            seller.created_at = new Date();

            const user = userDto as UserModel;
            user.created_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM sellers WHERE email = ?`, [seller.email]
            );

            const sellersExists = data as SellerModel[];
            if (sellersExists.length) {
                res.status(409).send(`Seller with email id: ${seller.email} already exists`);
                return;
            }

            let sellerId: any;

            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO users SET ?`, [user]
                );
                seller.user_id = data.insertId;

                [data] = await connection.query(
                    `INSERT INTO sellers SET ?`, [seller]
                );
                sellerId = data.insertId;
            });

            if (sellerId) {
                res.status(201).send(`Created a seller with Id: ${sellerId}`);
            } else {
                res.status(500).send(`Failed to create a seller`);
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    };

    static updateSeller = async (req: Request, res: Response) => {

        try {
            const sellerId = req.params.id;
            const sellerDto = Object.assign(new UpdateSellerDTO(), req.body);

            const errors = await validate(sellerDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const seller = sellerDto as SellerModel;
            seller.updated_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM sellers WHERE id = ?`, [sellerId]
            );

            const sellerExists = data as SellerModel[];
            if (!sellerExists.length) {
                res.status(404).send(`Seller with Id: ${sellerId} not found`);
            }

            let isUpdated: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE sellers SET ? WHERE id = ?`, [seller, sellerId]
                );
                isUpdated = data.affectedRows > 0;
            });

            if (isUpdated) {
                res.status(200).send(`Seller with Id: ${sellerId} is updated`);
            } else {
                res.status(500).send(`Seller with Id: ${sellerId} is not updated`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static deleteSeller = async (req: Request, res: Response) => {

        try {
            const sellerId = req.params.id;
            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM sellers WHERE id = ?`, [sellerId]
            );

            const sellerExists = data as SellerModel[];
            if (!sellerExists.length) {
                res.status(404).send(`Seller with Id: ${sellerId} not found`);
            }

            let isDeleted: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE sellers SET status = ? WHERE id = ?`, [Status.Archived, sellerId]
                );
                isDeleted = data.affectedRows > 0;
            });

            if (isDeleted) {
                res.status(200).send(`Seller with Id: ${sellerId} is deleted`);
            } else {
                res.status(500).send(`Seller with Id: ${sellerId} is not deleted`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };
}

export default SellersController;

