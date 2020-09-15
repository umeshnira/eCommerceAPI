import { Request, Response } from 'express';
import { connect, transaction } from '../context/db.context';
import { validate } from 'class-validator';
import { CouponDtoModel, CouponTableModel, CouponViewListModel } from '../models';
import { Status } from '../enums/status.enum'
import { stringify } from 'querystring';


class CouponController {

    static createCoupon = async (req: Request, res: Response) => {

        try {

            const couponDto = Object.assign(new CouponDtoModel(), req.body);

            const errors = await validate(couponDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const Coupon = new CouponTableModel();
            Coupon.created_at = new Date();
            Coupon.created_by = couponDto.created_by;
            Coupon.price = couponDto.price;
            Coupon.start_date = new Date();
            Coupon.description = couponDto.description;
            Coupon.name = couponDto.name;
            Coupon.status = Status.Active;
            Coupon.end_date = new Date(couponDto.end_date);
            Coupon.percentage = couponDto.percentage;
            Coupon.code = couponDto.code;
            Coupon.discount_type = couponDto.discount_type;
            Coupon.free_shipping = couponDto.free_shipping;
            Coupon.on_store = couponDto.on_store;
            Coupon.limit_per_coupon = couponDto.limit_per_coupon;
            Coupon.limit_per_item = couponDto.limit_per_item;
            Coupon.limit_per_user = couponDto.limit_per_user;

           
            let data: any;
            const pool = await connect();


            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO coupon SET ?`, [Coupon]
                );

            });

            if (data.insertId > 0) {
                res.status(201).send({ message: `Coupon is created` });
            } else {
                res.status(500).send({ message: `Failed to create Coupon` });
            }
        }
        catch (error) {

            res.status(500).send(error.message);
        }
    };

    static updateCoupon = async (req: Request, res: Response) => {
        try {

            const couponId = req.params?.id;
            const couponDto = Object.assign(new CouponDtoModel(), req.body);

            const errors = await validate(couponDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const Coupon = new CouponTableModel();
            Coupon.updated_at = new Date();
            Coupon.updated_by = couponDto.updated_by;
            Coupon.price = couponDto.price;
            Coupon.description = couponDto.description;
            Coupon.name = couponDto.name;
            Coupon.end_date = new Date(couponDto.end_date);
            Coupon.percentage = couponDto.percentage;
            Coupon.code = couponDto.code;
            Coupon.discount_type = couponDto.discount_type;
            Coupon.free_shipping = couponDto.free_shipping;
            Coupon.on_store = couponDto.on_store;
            Coupon.limit_per_coupon = couponDto.limit_per_coupon;
            Coupon.limit_per_item = couponDto.limit_per_item;
            Coupon.limit_per_user = couponDto.limit_per_user;

            let data: any;
            const pool = await connect();

            console.log(JSON.stringify(Coupon));
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE coupon SET ?  WHERE id=?`, [Coupon, couponId]
                );

            });

            if (data.affectedRows > 0) {
                res.status(201).send({ message: `Coupon is Updated` });
            } else {
                res.status(500).send({ message: `Failed to Update Coupon ${couponId}` });
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getAllCoupon = async (req: Request, res: Response) => {

        try {
            const connection = await connect();

            const [data] = await connection.query(
                `select
                c.id,
                c.name,
                c.code,
                c.description,
                c.price,
                c.percentage,
                c.start_date,
                c.end_date,
                c.discount_type,
                dt.name as discount_name,
                c.free_shipping,
                c.on_store,
                c.limit_per_coupon,
                c.limit_per_item,
                c.limit_per_user
                from coupon c
                inner join discount_type dt on dt.id=c.discount_type
                where status =1`,
                []
            );

            const coupons = data as CouponViewListModel[];
            if (coupons.length) {
                const couponDetails = new Array<CouponViewListModel>();
                coupons.forEach(x => {
                    const coupon = new CouponViewListModel();
                    coupon.price = x.price;
                    coupon.start_date = x.start_date;
                    coupon.description = x.description;
                    coupon.name = x.name;
                    coupon.end_date = x.end_date;
                    coupon.percentage = x.percentage;
                    coupon.discount_type = x.discount_type;
                    coupon.discount_name = x.discount_name;
                    coupon.free_shipping = x.free_shipping;
                    coupon.on_store = x.on_store;
                    coupon.limit_per_coupon = x.limit_per_coupon;
                    coupon.limit_per_item = x.limit_per_item;
                    coupon.limit_per_user = x.limit_per_user;
                    coupon.code = x.code;
                    coupon.id = x.id;
                    couponDetails.push(coupon);

                });
                res.status(200).json(couponDetails);
            } else {
                res.status(404).send({ message: `Coupon  not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getCoupon = async (req: Request, res: Response) => {

        try {
            const Id = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `select
                c.id,
                c.name,
                c.code,
                c.description,
                c.price,
                c.percentage,
                c.start_date,
                c.end_date,
                c.discount_type,
                c.free_shipping,
                c.on_store,
                c.limit_per_coupon,
                c.limit_per_item,
                c.limit_per_user
                from coupon c
                where c.id=?`,
                [Id]
            );

            const coupons = data[0] as CouponViewListModel;
            if (coupons) {
                const coupon = new CouponViewListModel();
                coupon.price = coupons.price;
                coupon.start_date = coupons.start_date;
                coupon.description = coupons.description;
                coupon.name = coupons.name;
                coupon.end_date = coupons.end_date;
                coupon.percentage = coupons.percentage;
                coupon.discount_type = coupons.discount_type;
                coupon.free_shipping = coupons.free_shipping;
                coupon.on_store = coupons.on_store;
                coupon.limit_per_coupon = coupons.limit_per_coupon;
                coupon.limit_per_item = coupons.limit_per_item;
                coupon.limit_per_user = coupons.limit_per_user;
                coupon.code = coupons.code;
                coupon.id = coupons.id;


                res.status(200).json(coupon);
            } else {
                res.status(404).send({ message: `Coupon  not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
}

export default CouponController