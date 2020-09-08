import { Request, Response } from 'express';
import { connect, transaction } from '../context/db.context';
import { validate } from 'class-validator';
import { SubscriptionPlanDtoModel, SubscriptionPlanTableModel, SubscriptionViewListModel,SellerSubscriptionPlanUpdateDTO,SellerModel } from '../models';
import { Status } from '../enums/status.enum'


class SubcriptionController {

    static createSubcription = async (req: Request, res: Response) => {
        try {

            const subDto = Object.assign(new SubscriptionPlanDtoModel(), req.body);

            const errors = await validate(subDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const subscription_plans = new SubscriptionPlanTableModel();
            subscription_plans.created_at = new Date();
            subscription_plans.amount = subDto.amount;
            subscription_plans.no_days_valid = subDto.no_days_valid;
            subscription_plans.created_by = subDto.created_by;
            subscription_plans.description = subDto.description;
            subscription_plans.name = subDto.name;
            subscription_plans.offer_id = subDto.offer_id;
            subscription_plans.status = Status.Active;

            let data: any;
            const pool = await connect();


            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO subscription_plans SET ?`, [subscription_plans]
                );

            });

            if (data.insertId > 0) {
                res.status(201).send({ message: `Subscription_plans is created` });
            } else {
                res.status(500).send({ message: `Failed to create Subscription_plans` });
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static getAllSubcription = async (req: Request, res: Response) => {

        try {
            const connection = await connect();

            const [data] = await connection.query(
                `select
                id ,
                name ,
                description ,
                amount ,
                offer_id ,
                no_days_valid
                from
                subscription_plans
                where status=1`
            );

            const Subscription = data as SubscriptionPlanTableModel[];
            if (Subscription.length) {
                const subscriptionDetails = new Array<SubscriptionPlanTableModel>();
                Subscription.forEach(sub => {
                    const subscription_plans = new SubscriptionPlanTableModel();
                    subscription_plans.amount = sub.amount;
                    subscription_plans.no_days_valid = sub.no_days_valid;
                    subscription_plans.created_by = sub.created_by;
                    subscription_plans.description = sub.description;
                    subscription_plans.name = sub.name;
                    subscription_plans.offer_id = sub.offer_id;
                    subscriptionDetails.push(subscription_plans);

                });
                res.status(200).json(subscriptionDetails);
            } else {
                res.status(404).send({ message: `Subscription_plans  not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
    static getSellerSubcription = async (req: Request, res: Response) => {

        try {
            const userId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `select
                sp.id,
                s.subscription_start_date ,
                s.subscription_end_date,
                sp.name ,
                sp.description ,
                sp.amount  ,
                sp.offer_id  ,
                sp.no_days_valid,
                 f.name as offer_name
                from sellers s
                inner join subscription_plans sp on s.subscription_plan_id=sp.id
                inner join offers f on f.id=sp.offer_id
                where s.user_id=?`,
                [userId]
            );

            const Subscription = data as SubscriptionViewListModel[];
            if (Subscription.length) {
                const subscriptionDetails = new Array<SubscriptionViewListModel>();
                Subscription.forEach(sub => {
                    const subscription_plans = new SubscriptionViewListModel();
                    subscription_plans.amount = sub.amount;
                    subscription_plans.offer_name = sub.offer_name;
                    subscription_plans.subscription_start_date = sub.subscription_start_date;
                    subscription_plans.subscription_end_date = sub.subscription_end_date;
                    subscription_plans.no_days_valid = sub.no_days_valid;
                    subscription_plans.created_by = sub.created_by;
                    subscription_plans.description = sub.description;
                    subscription_plans.name = sub.name;
                    subscription_plans.offer_id = sub.offer_id;
                    subscriptionDetails.push(subscription_plans);

                });
                res.status(200).json(subscriptionDetails);
            } else {
                res.status(404).send({ message: `Subscription_plans  not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static editSubcription = async (req: Request, res: Response) => {
        try {

            const subDto = Object.assign(new SellerSubscriptionPlanUpdateDTO(), req.body);
            const userId = req.params?.id;
            const errors = await validate(subDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const subscription_plans = new SellerModel();
            subscription_plans.updated_at = new Date();
            subscription_plans.subscription_end_date = subDto.end_date;
            subscription_plans.subscription_start_date = subDto.start_date;
            subscription_plans.updated_by = subDto.updated_by;
            subscription_plans.subscription_plan_id = subDto.id;


            let data: any;
            const pool = await connect();


            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE seller SET=?  WHERE user_id=?`, [subscription_plans,userId]
                );

            });

            if (data.insertId > 0) {
                res.status(201).send({ message: `Subscription_plans is Updated` });
            } else {
                res.status(500).send({ message: `Failed to Update Subscription_plans` });
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
}

export default SubcriptionController