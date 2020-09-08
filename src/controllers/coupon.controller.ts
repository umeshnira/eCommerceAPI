import { Request, Response } from 'express';
import { connect, transaction } from '../context/db.context';
import { validate } from 'class-validator';
import { CouponDtoModel,CouponTableModel,CouponViewListModel } from '../models';
import { Status } from '../enums/status.enum'


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
            Coupon.start_date = couponDto.start_date;
            Coupon.description = couponDto.description;
            Coupon.name = couponDto.name;
            Coupon.status = Status.Active;
            Coupon.end_date = couponDto.end_date;
            Coupon.percentage = couponDto.percentage;
            Coupon.code = couponDto.code;

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
            Coupon.created_at = new Date();
            Coupon.created_by = couponDto.created_by;
            Coupon.price = couponDto.price;
            Coupon.start_date = couponDto.start_date;
            Coupon.description = couponDto.description;
            Coupon.name = couponDto.name;
            Coupon.end_date = couponDto.end_date;
            Coupon.percentage = couponDto.percentage;
            Coupon.code = couponDto.code;


            let data: any;
            const pool = await connect();


            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE coupon SET=?  WHERE id=?`, [Coupon,couponId]
                );

            });

            if (data.insertId > 0) {
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
            const userId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `select
                id,
                name,
                code,
                description,
                price,
                percentage,
                start_date,
                end_date
                from coupon
                where status =1`,
                []
            );

            const coupons = data as CouponViewListModel[];
            if (coupons.length) {
                const couponDetails = new Array<CouponViewListModel>();
                coupons.forEach(x => {
                    const coupon = new CouponTableModel();
                    coupon.price = x.price;
                    coupon.start_date = x.start_date;
                    coupon.description = x.description;
                    coupon.name = x.name;
                    coupon.end_date = x.end_date;
                    coupon.percentage = x.percentage;
                    coupon.code = x.code;
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
                id,
                name,
                code,
                description,
                price,
                percentage,
                start_date,
                end_date
                from coupon
                where id=?`,
                [Id]
            );

            const coupons = data[0] as CouponViewListModel;
            if (coupons) {
                    const coupon = new CouponTableModel();
                    coupon.price = coupons.price;
                    coupon.start_date = coupons.start_date;
                    coupon.description = coupons.description;
                    coupon.name = coupons.name;
                    coupon.end_date = coupons.end_date;
                    coupon.percentage = coupons.percentage;
                    coupon.code = coupons.code;


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