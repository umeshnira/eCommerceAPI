import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { ClientModel, LoginModel } from '../models';
import { Clients, Login } from '../entity';


class ClientsController {

    static createClient = async (req: Request, res: Response) => {

        const clientModel = req.body as ClientModel;
        const loginModel = req.body as LoginModel;

        // client.hashPassword();

        if (clientModel.role === 'Client') {

            const errors = await validate(clientModel);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const client = new Clients();
            const clientRepository = getRepository(Clients);
            const login = new Login();
            const loginRepository = getRepository(Login);

            try {

                await ClientsController.modelMapping(clientModel, client);
                const result = await clientRepository.save(client);
                login.user_id = result.id;
                await ClientsController.modelMapping(result, login);
                const loginResult = await loginRepository.save(login);
            } catch (e) {
                res.status(409).send('username already in use');
                console.log('error', e.message);
                return;
            }

            res.status(201).send('Client created');
        }

    };

    static getAllClients = async (req: Request, res: Response) => {

        try {

            const clientRepository = getRepository(Clients);
            const clients = await clientRepository.createQueryBuilder("clients").getMany()
            if (clients) {
                res.status(200).json(clients);
            } else {
                res.status(404).send('Resource Not Found');
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
                res.status(404).send('Resource Not Found');
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static deleteClient = async (req: Request, res: Response) => {

        const clientId = req.params.id;
        const clientRepository = getRepository(Clients);

        try {
            await clientRepository.findOneOrFail(clientId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        try {
            await clientRepository.createQueryBuilder()
                .delete()
                .from(Clients)
                .where("id = :id", { id: clientId })
                .execute();
            res.status(201).send('Deleted Client');
        } catch (error) {
            res.status(500).send(error.message);
        }

    };

    static updateClient = async (req: Request, res: Response) => {

        const clientId = req.params.id;
        const clientModel = req.body as ClientModel;
        const client = new Clients();
        const clientRepository = getRepository(Clients);

        const errors = await validate(clientModel);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await clientRepository.findOneOrFail(clientId);
        } catch (error) {
            res.status(404).send('Resource not found');
            return;
        }

        try {
            const model = await ClientsController.modelMapping(clientModel, client);
            await clientRepository
                .createQueryBuilder()
                .update(Clients)
                .set(model)
                .where("id = :id", { id: clientId })
                .execute();
            res.status(201).send("Updated Client");
        } catch (error) {
            res.status(500).send(error.message);
        }

    };

    static modelMapping = async (model, entityModel) => {

        if (entityModel instanceof Clients) {
            entityModel.name = model?.name;
            entityModel.address = model?.address;
            entityModel.landmark = model?.landmark;
            entityModel.pin_code = model?.pin_code;
            entityModel.email = model?.email;
            entityModel.status = model?.status;
            entityModel.phone = model?.phone;
            entityModel.inserted_by = model?.inserted_by;
            entityModel.updated_by = model?.updated_by;
        }

        if (entityModel instanceof Login) {
            entityModel.user_name = model?.email;
            entityModel.password = model?.password;
            entityModel.role = model?.role ? model.role : 'Client';
            entityModel.inserted_by = model?.inserted_by;
            entityModel.updated_by = model?.updated_by;
        }

        return entityModel;

    }
}

export default ClientsController;
