import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { ClientModel, SellerModel, LoginModel } from '../models';
import { Clients, Sellers, Login } from '../entity';


class AuthController {

    static createUser = async (req: Request, res: Response) => {

        const clientModel = req.body as ClientModel;
        const sellerModel = req.body as SellerModel;
        const loginModel = req.body as LoginModel;

        const login = new Login();
        const loginRepository = getRepository(Login);
        // client.hashPassword();

        if (clientModel.role === 'Client') {

            const errors = await validate(clientModel);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const client = new Clients();
            const clientRepository = getRepository(Clients);
            try {

                const result = await clientRepository.save(clientModel);
                loginModel.user_id = result.id;
                loginModel.user_name = result.email;
                console.log(loginModel);
                const loginResult = await loginRepository.save(loginModel);

            } catch (e) {
                res.status(409).send('username already in use');
                console.log('error', e.message);
                return;
            }

            res.status(201).send('Client created');
        }

        if (sellerModel.role === 'Seller') {

            const errors = await validate(sellerModel);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const seller = new Sellers();
            const sellerRepository = getRepository(Sellers);
            try {

                const result = await sellerRepository.save(sellerModel);
                loginModel.user_id = result.id;
                loginModel.user_name = result.email;
                console.log(loginModel);
                const loginResult = await loginRepository.save(loginModel);
            } catch (e) {
                res.status(409).send('username already in use');
                console.log('error', e.message);
                return;
            }

            res.status(201).send('Seller created');
        }

    };

}

export default AuthController;