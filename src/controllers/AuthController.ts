import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import Clientparser from './requestparser/client.requestParser';

import { ClientEntity } from '../entity/ClientEntity';

class AuthController {

    static createClient = async (req: Request, res: Response) => {

        const model = Clientparser.parse(req);

        const client = new ClientEntity();

        const errors = await validate(model);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        // client.hashPassword();

        if (model.role === 'Client') {
            const clientRepository = getRepository(ClientEntity);
            try {
                await clientRepository.save(client);
            } catch (e) {
                res.status(409).send('username already in use');
                return;
            }

            res.status(201).send('Client created');
        }

    };

    static getAllClients = async (req: Request, res: Response) => {

        const clientRepository = getRepository(ClientEntity);
        const clients = await clientRepository.find({ select: ['id', 'username'] });

        res.status(200).send(clients);
    };

}

export default AuthController;