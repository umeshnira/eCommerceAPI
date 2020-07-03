import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { Products, ProductOffers, ProductPrices, ProductQuantity, ProductImages, ProductCategories, Categories, Carts, SaveLater } from '../entity';
import { ProductModel, ProductCategoryModel, ProductOffersModel, ProductQuantityModel, ProductPricesModel, ProductImagesModel, CartsModel, SaveLaterModel } from '../models';
import { application } from '../config/app-settings.json';

class SaveLaterController {

    static createSaveLater = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {

            try {
                await queryRunner.connect();
                await queryRunner.startTransaction();

                const saveLaterModel = req.body as SaveLaterModel;
                const saveLater = await new SaveLaterModel().getMappedEntity(saveLaterModel);
                await queryRunner.manager.save(saveLater);

                await queryRunner.commitTransaction();

                res.status(201).send('Product added to save later');
            } catch (error) {
                res.status(500).send(error.message);
            } finally {
                await queryRunner.release();
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static updateSaveLater = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {
            try {
                await queryRunner.connect();
                await queryRunner.startTransaction();

                const saveLaterId = req.params.id;
                const saveLaterModel = req.body as SaveLaterModel;

                const saveLater = await new SaveLaterModel().getMappedEntity(saveLaterModel);
                await queryRunner.manager.connection
                    .createQueryBuilder()
                    .update(SaveLater)
                    .set(saveLater)
                    .where("id = :id", { id: saveLaterId })
                    .execute();

                await queryRunner.commitTransaction();

                res.status(201).send('Product updated in save later');
            } catch (error) {
                res.status(500).send(error.message);
            } finally {
                await queryRunner.release();
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static getSaveLaterItems = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {
            try {
                await queryRunner.connect();

                const result = await queryRunner.manager.connection
                    .createQueryBuilder(Products, 'p')
                    .addSelect('p.id', 'id')
                    .addSelect('p.name', 'name')
                    .addSelect('p.description', 'description')
                    .addSelect('p.star_rate', 'star_rate')
                    .addSelect('pp.price', 'price')
                    .addSelect('p.batch_no', 'batch_no')
                    .addSelect('p.exp_date', 'exp_date')
                    .addSelect('p.bar_code', 'bar_code')
                    .addSelect('pp.price_without_offer', 'price_without_offer')
                    .addSelect('po.offer_id', 'offer_id')
                    .addSelect('pq.left_qty', 'left_qty')
                    .addSelect('pq.tota_qty', 'tota_qty')
                    .addSelect('pc.category_id', 'category_id')
                    .addSelect('pc.status', 'status')
                    .addSelect('pi.image', 'image')
                    .addSelect('sl.id', 'savelater_id')
                    .addSelect('sl.client_id', 'client_id')
                    .innerJoin(ProductPrices, 'pp', 'pp.product_id = p.id')
                    .innerJoin(ProductOffers, 'po', 'po.product_id = p.id')
                    .innerJoin(ProductQuantity, 'pq', 'pq.product_id = p.id')
                    .innerJoin(ProductCategories, 'pc', 'pc.product_id = p.id')
                    .innerJoin(ProductImages, 'pi', 'pi.product_id = p.id')
                    .innerJoin(SaveLater, 'sl', 'sl.product_id = p.id')
                    .getRawMany();

                if (result) {
                    result.forEach(x => x.image = application.getImagePath.product + x.image);
                    res.status(200).json(result);
                }
            } catch (error) {
                res.status(500).send(error.message);
            } finally {
                await queryRunner.release();
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    static deleteSaveLater = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const saveLaterId = req.params.id;

            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(SaveLater)
                .where("id = :id", { id: saveLaterId })
                .execute();

            await queryRunner.commitTransaction();

            res.status(201).send('save later item deleted');
        } catch (error) {
            res.status(500).send(error.message);
        } finally {
            await queryRunner.release();
        }
    }
    static moveSaveLaterToCart = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {
            try {
                await queryRunner.connect();
                await queryRunner.startTransaction();

                const saveLaterId = req.params.id;

                const saveLaterResult = await queryRunner.manager.connection
                    .createQueryBuilder(SaveLater, 'sl')
                    .addSelect('sl.product_id', 'product_id')
                    .addSelect('sl.client_id', 'client_id')
                    .where('sl.id = :id', { id: saveLaterId })
                    .getRawOne();

                const cartsModel = saveLaterResult as CartsModel;
                const carts = await new CartsModel().getMappedEntity(cartsModel);
                await queryRunner.manager.save(carts);

                await queryRunner.manager.connection
                    .createQueryBuilder()
                    .delete()
                    .from(SaveLater)
                    .where('id = :id', { id: saveLaterId })
                    .execute();

                await queryRunner.commitTransaction();

                res.status(201).send('Product moved to cart');
            } catch (error) {
                res.status(500).send(error.message);
            } finally {
                await queryRunner.release();
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}



export default SaveLaterController;