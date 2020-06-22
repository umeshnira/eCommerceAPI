import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { SellerModel, LoginModel } from '../models';
import { Sellers, Login } from '../entity';


class SellersController {

    static getAllSellers = async (req: Request, res: Response) => {

        try {

            const sellerRepository = getRepository(Sellers);
            const sellers = await sellerRepository.createQueryBuilder("sellers").getMany()
            if (sellers) {
                res.status(200).json(sellers);
            } else {
                res.status(404).send('Resource Not Found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getSeller = async (req: Request, res: Response) => {

        try {

            const sellerId = req.params?.id;
            const sellerRepository = getRepository(Sellers);
            const seller = await sellerRepository.createQueryBuilder()
                .select("seller")
                .from(Sellers, "seller")
                .where("seller.id = :id", { id: sellerId })
                .getOne();

            if (seller) {
                res.status(200).json(seller);
            } else {
                res.status(404).send('Resource Not Found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static createSeller = async (req: Request, res: Response) => {

        const sellerModel = req.body as SellerModel;
        const loginModel = req.body as LoginModel;

        const errors = await validate(sellerModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const seller = await new SellerModel().getMappedEntity(sellerModel);
            const result = await queryRunner.manager.save(seller);
            if (result) {
                const login = await new LoginModel().getMappedEntity(loginModel);
                login.user_id = result.id;
                const loginResult = await queryRunner.manager.save(login);
                await queryRunner.commitTransaction();
            }
            else {
                res.status(409).send('username already exists');
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

        res.status(201).send('Seller created');
    };

    static updateSeller = async (req: Request, res: Response) => {

        const sellerId = req.params.id;
        const sellerModel = req.body as SellerModel;

        const errors = await validate(sellerModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.findOneOrFail(sellerId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        try {
            const seller = await new SellerModel().getMappedEntity(sellerModel);
            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(Sellers)
                .set(seller)
                .where("id = :id", { id: sellerId })
                .execute();
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

        res.status(204).send("Updated Seller");
    };

    static deleteSeller = async (req: Request, res: Response) => {

        const sellerId = req.params.id;

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.findOneOrFail(sellerId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        try {
            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(Sellers)
                .where("id = :id", { id: sellerId })
                .execute();
            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(Login)
                .where("user_id = :id", { id: sellerId })
                .execute();
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }
        res.status(204).send('Deleted Seller');
    };
}

export default SellersController;

