import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { Products, ProductOffers, ProductPrices, ProductQuantity, ProductImages, ProductCategories, Categories, Carts } from '../entity';
import { ProductModel, ProductCategoryModel, ProductOffersModel, ProductQuantityModel, ProductPricesModel, ProductImagesModel, CartsModel } from '../models';
import { application } from '../config/app-settings.json';

class CartController {

    static createCart = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const cartsModel = req.body as CartsModel;
            const carts = await new CartsModel().getMappedEntity(cartsModel);
            await queryRunner.manager.save(carts);

            await queryRunner.commitTransaction();

            res.status(201).send('Product added to cart');
        } catch (error) {
            res.status(500).send(error.message);
        } finally {
            await queryRunner.release();
        }
    }

    static updateCart = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const carttId = req.params.id;
            const cartsModel = req.body as CartsModel;

            const carts = await new CartsModel().getMappedEntity(cartsModel);
            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(Carts)
                .set(carts)
                .where("id = :id", { id: carttId })
                .execute();

            await queryRunner.commitTransaction();

            res.status(201).send('Product updated in cart');
        } catch (error) {
            res.status(500).send(error.message);
        } finally {
            await queryRunner.release();
        }
    }

    static getCartItems = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

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
                .addSelect('pp.price', 'price')
                .addSelect('pp.price_without_offer', 'price_without_offer')
                .addSelect('po.offer_id', 'offer_id')
                .addSelect('pq.left_qty', 'left_qty')
                .addSelect('pq.tota_qty', 'tota_qty')
                .addSelect('pc.category_id', 'category_id')
                .addSelect('pc.status', 'status')
                .addSelect('pi.image', 'image')
                .addSelect('c.id', 'cart_id')
                .addSelect('c.client_id', 'client_id')
                .innerJoin(ProductPrices, 'pp', 'pp.product_id = p.id')
                .innerJoin(ProductOffers, 'po', 'po.product_id = p.id')
                .innerJoin(ProductQuantity, 'pq', 'pq.product_id = p.id')
                .innerJoin(ProductCategories, 'pc', 'pc.product_id = p.id')
                .innerJoin(ProductImages, 'pi', 'pi.product_id = p.id')
                .innerJoin(Carts, 'c', 'c.product_id = p.id')
                .getRawMany();

            if (result) {
                for (var i = 0; i < result.length; i++) {
                    result[i].image = application.storage.product + result[i].image;
                }
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(500).send(error.message);
        } finally {
            await queryRunner.release();
        }
    }

    static deleteCart = async (req: Request, res: Response) => {

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const carttId = req.params.id;

            await queryRunner.manager.connection
            .createQueryBuilder()
            .delete()
            .from(Carts)
            .where("id = :id", { id: carttId })
            .execute();

            await queryRunner.commitTransaction();

            res.status(201).send('Cart item deleted');
        } catch (error) {
            res.status(500).send(error.message);
        } finally {
            await queryRunner.release();
        }
    }


}


export default CartController;