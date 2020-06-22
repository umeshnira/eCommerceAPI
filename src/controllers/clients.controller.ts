import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { ClientModel, LoginModel } from '../models';
import { Clients, Login } from '../entity';

class ClientsController {

    static getAllClients = async (req: Request, res: Response) => {

        try {

            const clientRepository = getRepository(Clients);
            const clients = await clientRepository.createQueryBuilder("clients").getMany()
            if (clients) {
                res.status(200).json(clients);
            } else {
                res.status(404).send('Clients Not Found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getClient = async (req: Request, res: Response) => {

        try {

            const clientId = req.params?.id;
            const clientRepository = getRepository(Clients);
            const client = await clientRepository.createQueryBuilder()
                .select("client")
                .from(Clients, "client")
                .where("client.id = :id", { id: clientId })
                .getOne();

            if (client) {
                res.status(200).json(client);
            } else {
                res.status(404).send('Client Not Found');
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static createClient = async (req: Request, res: Response) => {

        const clientModel = req.body as ClientModel;
        const loginModel = req.body as LoginModel;

        const errors = await validate(clientModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const client = new ClientModel().getMappedEntity(clientModel);
            const login = new LoginModel().getMappedEntity(loginModel);

            const result = await queryRunner.manager.save(client);
            if (result) {
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

    static updateClient = async (req: Request, res: Response) => {

        const clientId = req.params.id;
        const clientModel = req.body as ClientModel;

        const errors = await validate(clientModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.findOneOrFail(clientId);
        } catch (error) {
            res.status(404).send('Client not found');
            return;
        }

        try {
            const client = new ClientModel().getMappedEntity(clientModel);
            await queryRunner.manager.connection
                .createQueryBuilder()
                .update(Clients)
                .set(client)
                .where("id = :id", { id: clientId })
                .execute();
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

        res.status(204).send("Updated Client");
    };

    static deleteClient = async (req: Request, res: Response) => {

        const clientId = req.params.id;

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.findOneOrFail(clientId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        try {
            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(Clients)
                .where("id = :id", { id: clientId })
                .execute();
            await queryRunner.manager.connection
                .createQueryBuilder()
                .delete()
                .from(Login)
                .where("user_id = :id", { id: clientId })
                .execute();
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(error.message);
        }
        finally {
            await queryRunner.release();
        }

        res.status(204).send('Deleted Client');
    };
}

export default ClientsController;
