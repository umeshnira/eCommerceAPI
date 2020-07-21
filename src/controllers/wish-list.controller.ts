import { AddWishListDTO, WishListModel, WishListViewModel, AddCartDTO, CartModel } from '../models';
import { validate } from 'class-validator';
import { connect, transaction } from '../context/db.context';
import { Request, Response } from 'express';
import { application } from '../config/app-settings.json';


class WishListController {

    static createWishList = async (req: Request, res: Response) => {

        try {
            const wishListDto = Object.assign(new AddWishListDTO(), req.body);

            const errors = await validate(wishListDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const wishList = wishListDto as WishListModel;
            wishList.created_at = new Date();

            let data: any;
            const pool = await connect();

            let wishListId: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO wishlist SET ?`, [wishList]
                );
                wishListId = data.insertId;
            });

            if (wishListId) {
                res.status(201).send({ message: `Wish List with Id: ${wishListId} is created` });
            } else {
                res.status(500).send(`Failed to add the product to wish list`);
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    };

    static deleteWishListItem = async (req: Request, res: Response) => {

        try {
            const wishListId = req.params.id;
            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM wishlist WHERE id = ?`, [wishListId]
            );

            const wishListExists = data as WishListModel[];
            if (!wishListExists.length) {
                res.status(404).send(`Wish List with Id: ${wishListExists} not found`);
            }

            let isDeleted: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `DELETE FROM wishlist  WHERE id = ?`, [wishListId]
                );
                isDeleted = data.affectedRows > 0;
            });

            if (isDeleted) {
                res.status(200).send({ message: `Wish List with Id: ${wishListId} is deleted` });
            } else {
                res.status(500).send(`Wish list with Id: ${wishListId} is not deleted`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getWishListItemsByUserId = async (req: Request, res: Response) => {

        try {
            const userId = req.params?.uid;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT prod.id as productId, prod.name, prod.description, price.price,
                        offer.offer_id, qty.left_qty, qty.total_qty, later.id as id, ima.image
                        FROM wishlist
                        INNER JOIN products prod ON prod.id = wishlist.product_id
                        INNER JOIN product_prices price ON prod.id = price.product_id
                        LEFT JOIN product_offers offer ON prod.id = offer.product_id
                        INNER JOIN product_quantity qty ON prod.id = qty.product_id
                        INNER JOIN product_categories cat ON prod.id = cat.product_id
                        INNER JOIN product_images ima ON prod.id = ima.product_id WHERE wishlist.user_id = ?
                        GROUP BY wishlist.id`, [userId]
            );

            const wishList = data as WishListViewModel[];
            if (wishList) {

                const wishListDetails = new Array<WishListViewModel>();
                wishList.forEach(x => {
                    const wishListObj = new WishListViewModel();
                    wishListObj.id = x.id;
                    wishListObj.name = x.name
                    wishListObj.description = x.description
                    wishListObj.price = x.price
                    wishListObj.offer_id = x.offer_id
                    wishListObj.left_qty = x.left_qty
                    wishListObj.total_qty = x.total_qty
                    wishListObj.productId = x.productId
                    wishListObj.image = x.image
                    wishListObj.path = application.getImagePath.product + x.image
                    wishListDetails.push(wishListObj);
                });

                res.status(200).json(wishListDetails);
            } else {
                res.status(404).send(`Wish List with userId: ${userId} not found`);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static moveSaveLaterItemToWishList = async (req: Request, res: Response) => {

        try {
            const wishListDto = Object.assign(new AddWishListDTO(), req.body);

            const errors = await validate(wishListDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const wishList = wishListDto as WishListModel;
            wishList.created_at = new Date();

            let data: any;
            const pool = await connect();

            let wishListId: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO wishlist SET ?`, [wishList]
                );
                wishListId = data.insertId;
                [data] = await connection.query(
                    `DELETE FROM save_later WHERE product_id = ? AND user_id = ?`, [wishList.product_id, wishList.user_id]
                );
            });

            if (wishListId) {
                res.status(201).send({ message: `WishList with Id: ${wishListId} is created` });
            } else {
                res.status(500).send({ message: `Failed to Add the product to wishlist` });
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

}

export default WishListController;
