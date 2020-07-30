import { Request, Response } from 'express';
import { connect, transaction } from '../context/db.context';
import { application } from '../config/app-settings.json';
import { validate } from 'class-validator';
import { OfferDTOModel, OfferModel, OfferViewDetailsModel } from '../models';

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
            offer.ValidFrom = offerDto.ValidFrom;
            offer.ValidTo = offerDto.ValidTo;
            offer.created_by = offerDto.created_by;
            offer.description = offerDto.description;
            offer.name = offerDto.name;
            offer.percentage = offerDto.percentage;
            offer.price = offerDto.price;
            offer.status = 1;

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
                res.status(500).send(`Failed to create offer`);
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
            offer.created_at = new Date();
            offer.ValidFrom = offerDto.ValidFrom;
            offer.ValidTo = offerDto.ValidTo;
            offer.created_by = offerDto.created_by;
            offer.description = offerDto.description;
            offer.name = offerDto.name;
            offer.percentage = offerDto.percentage;
            offer.price = offerDto.price;
            offer.status = 1;

            let isUpdated: any;

            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE offers SET ? WHERE id = ?`, [offer,offerId]
                );

            });

            isUpdated = data.affectedRows > 0;

            if (isUpdated > 0) {
                res.status(200).send({ message: `offer is updated` });
            } else {
                res.status(500).send(`Failed to update offer`);
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    static statusChangeOffer = async (req: any, res: Response) => {
        try {

            const offerId = req.params.id;
            const status=req.query.status;
            
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
                    `UPDATE offers SET status = ? WHERE id = ?`, [status,offerId]
                );

            });

            isUpdated = data.affectedRows > 0;

            if (isUpdated > 0) {
                res.status(201).send({ message: `offer is updated` });
            } else {
                res.status(500).send(`Failed to update offer`);
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
                f.ValidFrom,
                f.ValidTo,
                s.name as status
                FROM offers f
                inner join status s on s.id=f.status

                 `,
                []
            );

            const offers = data as OfferViewDetailsModel[];
            if (offers.length) {
                const offerDetails = new Array<OfferViewDetailsModel>();
                offers.forEach(x => {
                    const offer = new OfferViewDetailsModel();
                    offer.ValidFrom = x.ValidFrom;
                    offer.ValidTo = x.ValidTo;
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
            const status=req.params.status;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT 
                f.id,
                f.name,
                f.description,
                f.price,
                f.percentage,
                f.ValidFrom,
                f.ValidTo,
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
                    offer.ValidFrom = x.ValidFrom;
                    offer.ValidTo = x.ValidTo;
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
                f.ValidFrom,
                f.ValidTo,
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
                    
                    offer.ValidFrom = offers.ValidFrom;
                    offer.ValidTo = offers.ValidTo;
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

}

export default OfferController;