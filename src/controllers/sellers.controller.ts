import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { SellerModel, LoginModel } from '../models';
import { Sellers, Login } from '../entity';


class SellersController {

    static createSeller = async (req: Request, res: Response) => {

        const sellerModel = req.body as SellerModel;
        const loginModel = req.body as LoginModel;

        // client.hashPassword();

        if (sellerModel.role === 'Seller') {

            const errors = await validate(sellerModel);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const seller = new Sellers();
            const sellerRepository = getRepository(Sellers);
            const login = new Login();
            const loginRepository = getRepository(Login);

            const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {

                // await entityParsing(seller, sellerModel);
                await SellersController.modelMapping(sellerModel, seller);
                const result = await sellerRepository.save(seller);
                if (result) {
                    await SellersController.modelMapping(loginModel, login);
                    login.user_id = result.id;
                    const loginResult = await loginRepository.save(login);
                    res.status(201).send('Seller created');
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

        }

    };

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

    static deleteSeller = async (req: Request, res: Response) => {

        const sellerId = req.params.id;
        const sellerRepository = getRepository(Sellers);
        const loginRepository = getRepository(Login);

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await sellerRepository.findOneOrFail(sellerId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        try {
            await sellerRepository.createQueryBuilder()
                .delete()
                .from(Sellers)
                .where("id = :id", { id: sellerId })
                .execute();
            await loginRepository.createQueryBuilder()
                .delete()
                .from(Login)
                .where("user_id = :id", { id: sellerId })
                .execute();
            res.status(201).send('Deleted Seller');
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

    };

    static updateSeller = async (req: Request, res: Response) => {

        const sellerId = req.params.id;
        const sellerModel = req.body as SellerModel;
        const seller = new Sellers();
        const sellerRepository = getRepository(Sellers);

        const errors = await validate(sellerModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await sellerRepository.findOneOrFail(sellerId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
             const model = SellersController.modelMapping(sellerModel, seller);
             await sellerRepository
                .createQueryBuilder()
                .update(Sellers)
                .set(model)
                .where("id = :id", { id: sellerId })
                .execute();
            res.status(201).send("Updated Seller");
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

    };

    static modelMapping =  (model, entityModel) => {

        if (entityModel instanceof Sellers) {
            entityModel.name = model?.name;
            entityModel.address = model?.address;
            entityModel.landmark = model?.landmark;
            entityModel.pincode = model?.pincode;
            entityModel.email = model?.email;
            entityModel.status = model?.status;
            entityModel.phone = model?.phone;
            entityModel.aadhar_card_no = model?.aadhar_card_no;
            entityModel.pan_card_no = model?.pan_card_no;
            entityModel.bank_ac_no = model?.bank_ac_no;
            entityModel.ifsc_code = model?.ifsc_code;
            entityModel.inserted_by = model?.inserted_by;
            entityModel.updated_by = model?.updated_by;
        }

        if (entityModel instanceof Login) {
            entityModel.user_name = model?.email;
            entityModel.password = model?.password;
            entityModel.role = model?.role ? model.role : 'Seller';
            entityModel.inserted_by = model?.inserted_by;
            entityModel.updated_by = model?.updated_by;
        }

        return entityModel;

    }

}

export default SellersController;

