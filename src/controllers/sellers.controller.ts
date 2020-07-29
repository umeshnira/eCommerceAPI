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
                `SELECT sellers.id, sellers.user_id, sellers.name, sellers.address,
                 sellers.landmark, sellers.pincode, sellers.email,sellers.phone,sellers.aadhar_card_no,
                 sellers.pan_card_no, sellers.bank_name,sellers.bank_ac_no, sellers.branch_name, sellers.ifsc_code,
                 sellers.created_by, sellers.created_at,sellers.updated_by, sellers.updated_at,
                users.user_name as username,
                status.id as status
                FROM sellers
                INNER JOIN users on sellers.user_id  = users.id
                INNER JOIN status on sellers.status  = status.id
                ORDER By sellers.id`
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

            const seller = new SellerModel();
            seller.name = sellerDto.name;
            seller.email = sellerDto.email;
            seller.ifsc_code = sellerDto.ifsc_code;
            seller.address = sellerDto.address;
            seller.landmark = sellerDto.landmark;
            seller.pincode = sellerDto.pincode;
            seller.phone = sellerDto.phone;
            seller.aadhar_card_no = sellerDto.aadhar_card_no;
            seller.pan_card_no = sellerDto.pan_card_no;
            seller.bank_name = sellerDto.bank_name;
            seller.bank_ac_no = sellerDto.bank_ac_no;
            seller.branch_name = sellerDto.branch_name;
            seller.created_by = sellerDto.created_by;
            seller.status = Status.Approval_Pending;
            seller.created_at = new Date();

            const user = new UserModel();
            user.user_name = userDto.user_name;
            user.password = userDto.password;
            user.status = Status.Approval_Pending;
            user.role = userDto.role;
            user.created_by = userDto.created_by;
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
                res.status(201).send({ message: `Seller with Id: ${sellerId} is created` });
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
                res.status(200).send({ message: `Seller with Id: ${sellerId} is updated` });
            } else {
                res.status(500).send(`Seller with Id: ${sellerId} is not updated`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static approveSellerRegistration = async (req: Request, res: Response) => {

        try {
            const sellerId = req.params.id;
            const sellerDto = Object.assign(new UpdateSellerDTO(), req.body);
            const errors = await validate(sellerDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const seller = new SellerModel();
            seller.status = sellerDto.status;
            seller.updated_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM sellers WHERE user_id = ?`, [sellerId]
            );

            const sellerExists = data as SellerModel[];
            if (!sellerExists.length) {
                res.status(404).send(`Seller with Id: ${sellerId} not found`);
            }

            let isUpdated: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE sellers SET ? WHERE user_id = ?`, [seller, sellerId]
                );
                [data] = await connection.query(
                    `UPDATE users SET ? WHERE id = ?`, [seller, sellerId]
                );
                isUpdated = data.affectedRows > 0;
            });

            if (isUpdated) {
                res.status(200).send({ message: `Seller with Id: ${sellerId} is updated` });
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
                res.status(200).send({ message: `Seller with Id: ${sellerId} is deleted` });
            } else {
                res.status(500).send(`Seller with Id: ${sellerId} is not deleted`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };
}

export default SellersController;

