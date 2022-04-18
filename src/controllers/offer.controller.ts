import { Request, Response } from 'express';
import { connect, transaction } from '../context/db.context';
import { application } from '../config/app-settings.json';
import { validate } from 'class-validator';
import { OfferDTOModel, OfferModel, OfferViewDetailsModel, MultipleProductOfferDTOModel, ProductOffers } from '../models';
import { Status } from '../enums/status.enum'

class OfferController {

    static createOffer = async (req: any, res: Response) => {
        try {

            const offerDto = Object.assign(new OfferDTOModel(), req.body);

            const errors = await validate(offerDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const offer = new OfferModel();
            offer.created_at = new Date();
            offer.validFrom = new Date(offerDto.validFrom);
            offer.validTo = new Date(offerDto.validTo);
            offer.created_by = offerDto.created_by;
            offer.description = offerDto.description;
            offer.name = offerDto.name;
            offer.percentage = offerDto.percentage;
            offer.price = offerDto.price;
            offer.status = Status.Active;

            let data: any;
            const pool = await connect();


            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO offers SET ?`, [offer]
                );

            });

            if (data.insertId > 0) {
                res.status(201).send({ message: `offer is created` });
            } else {
                res.status(500).send({ message: `Failed to create offer` });
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }


    static createMultipleProductsOffer = async (req: any, res: Response) => {
        try {

            const offerId = req.params.id;
            const offerDto = Object.assign(new MultipleProductOfferDTOModel(), req.body);

            const errors = await validate(offerDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            let data: any;
            const pool = await connect();
             let isInserted,isUpdated;
            for (const x of offerDto) {
                if(x?.product_offer_id){
                    const offer = new ProductOffers();
                    offer.updated_at = new Date();
                    offer.product_id = x?.product_id;
                    offer.updated_by = offerDto.updated_by;
                    offer.offer_id = offerId;

                    await transaction(pool, async connection => {
                        [data] = await connection.query(
                            `UPDATE product_offers SET ? WHERE id = ?`, [offer,x?.product_offer_id]
                        );
                        isUpdated=data.affectedRows > 0;
                    });
                }else{
                    const offer = new ProductOffers();
                    offer.created_at = new Date();
                    offer.product_id = x?.product_id;
                    offer.created_by = offerDto.updated_by;
                    offer.offer_id = offerId;
                    console.log(JSON.stringify(offer));
    
                    await transaction(pool, async connection => {
                        [data] = await connection.query(
                            `INSERT INTO product_offers SET ?`, [offer]
                        );
                        isInserted= data.insertId > 0
                    });
                }

            }


            if (isInserted || isUpdated) {
                res.status(201).send({ message: `Product offers are added` });
            } else {
                res.status(500).send({ message: `Failed to add product offers` });
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static editOffer = async (req: any, res: Response) => {
        try {

            const offerId = req.params.id;
            const offerDto = Object.assign(new OfferDTOModel(), req.body);

            const errors = await validate(offerDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM offers WHERE id = ?`, [offerId]
            );
            if (!data.length) {
                res.status(404).send({ message: `offer with Id: ${offerId} not found` });
            }
            const offer = new OfferModel();
            offer.updated_at = new Date();
            offer.validFrom =  new Date(offerDto.validFrom);
            offer.validTo =  new Date(offerDto.validTo);
            offer.updated_by = offerDto.updated_by;
            offer.description = offerDto.description;
            offer.name = offerDto.name;
            offer.percentage = offerDto.percentage;
            offer.price = offerDto.price;
            offer.status = 1;

            let isUpdated: any;

            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE offers SET ? WHERE id = ?`, [offer, offerId]
                );

            });

            isUpdated = data.affectedRows > 0;

            if (isUpdated > 0) {
                res.status(200).send({ message: `offer is updated` });
            } else {
                res.status(500).send({ message: `Failed to update offer` });
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static statusChangeOffer = async (req: any, res: Response) => {
        try {

            const offerId = req.params.id;
            const status = req.query.status;

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM offers WHERE id = ?`, [offerId]
            );
            if (!data.length) {
                res.status(404).send({ message: `offer with Id: ${offerId} not found` });
            }

            let isUpdated: any;

            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE offers SET status = ? WHERE id = ?`, [status, offerId]
                );

            });

            isUpdated = data.affectedRows > 0;

            if (isUpdated > 0) {
                res.status(201).send({ message: `offer is updated` });
            } else {
                res.status(500).send({ message: `Failed to update offer` });
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static getAllOffers = async (req: any, res: Response) => {
        try {

            const connection = await connect();

            const [data] = await connection.query(
                `SELECT
                f.id,
                f.name,
                f.description,
                f.price,
                f.percentage,
                f.validFrom,
                f.validTo,
                s.name as status
                FROM offers f
                inner join status s on s.id=f.status
                where f.status != ?
                 `,
                [Status.In_Active]
            );

            const offers = data as OfferViewDetailsModel[];
            if (offers.length) {
                const offerDetails = new Array<OfferViewDetailsModel>();
                offers.forEach(x => {
                    const offer = new OfferViewDetailsModel();
                    offer.id = x.id;
                    offer.validFrom = x.validFrom;
                    offer.validTo = x.validTo;
                    offer.description = x.description;
                    offer.name = x.name;
                    offer.percentage = x.percentage;
                    offer.price = x.price;
                    offer.status = x.status;
                    offerDetails.push(offer);

                });
                res.status(200).json(offerDetails);
            } else {
                res.status(404).send({ message: `offers not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static getOffersByStatus = async (req: any, res: Response) => {
        try {
            const status = req.params.status;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT
                f.id,
                f.name,
                f.description,
                f.price,
                f.percentage,
                f.validFrom,
                f.validTo,
                s.name as status
                FROM offers f
                inner join status s on s.id=f.status
                where f.status = ?
                 `,
                [status]
            );

            const offers = data as OfferViewDetailsModel[];
            if (offers.length) {
                const offerDetails = new Array<OfferViewDetailsModel>();
                offers.forEach(x => {
                    const offer = new OfferViewDetailsModel();
                    offer.id = x.id;
                    offer.validFrom = x.validFrom;
                    offer.validTo = x.validTo;
                    offer.description = x.description;
                    offer.name = x.name;
                    offer.percentage = x.percentage;
                    offer.price = x.price;
                    offer.status = x.status;
                    offerDetails.push(offer);

                });
                res.status(200).json(offerDetails);
            } else {
                res.status(404).send({ message: `offers not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static getOffer = async (req: any, res: Response) => {
        try {
            const offerId = req.params.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT
                f.id,
                f.name,
                f.description,
                f.price,
                f.percentage,
                f.validFrom,
                f.validTo,
                f.created_by,
                s.name as status
                FROM offers f
                inner join status s on s.id=f.status
                where f.id = ?
                 `,
                [offerId]
            );

            const offers = data[0] as OfferViewDetailsModel;
            if (offers) {

                const offer = new OfferViewDetailsModel();
                offer.id = offers.id;
                offer.validFrom = offers.validFrom;
                offer.validTo = offers.validTo;
                offer.created_by = offers.created_by;
                offer.description = offers.description;
                offer.name = offers.name;
                offer.percentage = offers.percentage;
                offer.price = offers.price;
                offer.status = offers.status;

                res.status(200).json(offer);
            } else {
                res.status(404).send({ message: `offers not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static getProductOffers = async (req: any, res: Response) => {
        try {
            const productId = req.params.id;
            const status = req.query.status;
            let tempStatus;
            const connection = await connect();

            if (status) {
                tempStatus = status;
            } else {
                tempStatus = null;
            }

            const [data] = await connection.query(
                `SELECT
                f.id,
                f.name,
                f.description,
                f.price,
                f.percentage,
                f.validFrom,
                f.validTo,
                s.name as status
                FROM offers f
                inner join status s on s.id=f.status
                inner join product_offers pf on pf.offer_id=f.id
                where pf.product_id = ? and ((${tempStatus} is null ) or (f.status = ${tempStatus}))
                 `,
                [productId]
            );

            const offers = data as OfferViewDetailsModel[];
            if (offers.length) {
                const offerDetails = new Array<OfferViewDetailsModel>();
                offers.forEach(x => {
                    const offer = new OfferViewDetailsModel();
                    offer.id = x.id;
                    offer.validFrom = x.validFrom;
                    offer.validTo = x.validTo;
                    offer.description = x.description;
                    offer.name = x.name;
                    offer.percentage = x.percentage;
                    offer.price = x.price;
                    offer.status = x.status;
                    offerDetails.push(offer);

                });
                res.status(200).json(offerDetails);
            } else {
                res.status(404).send({ message: `offers not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static getAllOfferProducts = async (req: any, res: Response) => { //api not tested
        try {
            const offerId = req.params?.id;
            const status = req.query?.status;
            let tempStatus;
            const connection = await connect();

            if (status) {
                tempStatus = status;
            } else {
                tempStatus = null;
            }

            const [data] = await connection.query(
                `SELECT
                f.id,
                f.name,
                f.description,
                f.price,
                f.percentage,
                f.validFrom,
                f.validTo,
                s.name as status,
                prod.id as product_id,
                prod.name as product_name,
                pf.id as product_offer_id
                FROM offers f
                inner join status s on s.id=f.status
                inner join product_offers pf on pf.offer_id=f.id
                INNER JOIN products prod  ON pf.product_id=prod.id
                where f.id = ? and ((${tempStatus} is null ) or (f.status = ${tempStatus}))
                 `,
                [offerId]
            );

            const offers = data as OfferViewDetailsModel[];
            if (offers.length) {
                const offerDetails = new Array<OfferViewDetailsModel>();
                offers.forEach(x => {
                    const offer = new OfferViewDetailsModel();
                    offer.id = x.id;
                    offer.validFrom = x.validFrom;
                    offer.validTo = x.validTo;
                    offer.description = x.description;
                    offer.name = x.name;
                    offer.percentage = x.percentage;
                    offer.price = x.price;
                    offer.status = x.status;
                    offer.product_id = x.product_id;
                    offer.product_name = x.product_name;
                    offer.product_offer_id = x.product_offer_id
                    offerDetails.push(offer);

                });               
                res.status(200).json(offerDetails);
            } else {
                res.status(404).send({ message: `offers not found` });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

export default OfferController;