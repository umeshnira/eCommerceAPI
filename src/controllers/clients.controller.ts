import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { ClientModel, UserModel, AddUserDTO } from '../models';
import { connect, transaction } from '../context/db.context';
import { AddClientDTO, UpdateClientDTO } from '../models';
import { Status } from '../enums';

class ClientsController {

    static getAllClients = async (req: Request, res: Response) => {

        try {
            const connection = await connect();
            const [data] = await connection.query(
                `SELECT id, user_id, name, address, landmark, pin_code, email, phone, created_by, created_at,
                        updated_by, updated_at FROM clients`
            );

            const clients = data as ClientModel[];
            if (clients.length) {
                res.status(200).json(clients);
            } else {
                res.status(404).send('Clients not found');
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getClient = async (req: Request, res: Response) => {

        try {
            const clientId = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT id, user_id, name, address, landmark, pin_code, email, phone, created_by, created_at,
                        updated_by, updated_at FROM clients WHERE id = ?`, [clientId]
            );

            const clients = data as ClientModel[];
            if (clients.length) {
                res.status(200).json(clients[0]);
            } else {
                res.status(404).send(`Client with Id: ${clientId} not found`);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static createClient = async (req: Request, res: Response) => {

        try {
            const clientDto = Object.assign(new AddClientDTO(), req.body);
            const userDto = Object.assign(new AddUserDTO(), req.body);

            const clientErrors = await validate(clientDto);
            if (clientErrors.length > 0) {
                res.status(400).send(clientErrors);
                return;
            }

            const userErrors = await validate(userDto);
            if (userErrors.length > 0) {
                res.status(400).send(userErrors);
                return;
            }

            const client = new ClientModel();
            client.name = clientDto.name;
            client.email = clientDto.email;
            client.address = clientDto.address;
            client.landmark = clientDto.landmark;
            client.pin_code = clientDto.pin_code;
            client.phone = clientDto.phone;
            client.created_by = clientDto.created_by;
            client.status = Status.Active;
            client.created_at = new Date();

            const user = new UserModel();
            user.user_name = userDto.user_name;
            user.password = userDto.password;
            user.status = Status.Active;
            user.role = userDto.role;
            user.created_by = userDto.created_by;
            user.created_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM clients WHERE email = ?`, [client.email]
            );

            const clientExists = data as ClientModel[];
            if (clientExists.length) {
                res.status(409).send(`Client with email id: ${client.email} already exists`);
                return;
            }

            let clientId: any;

            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `INSERT INTO users SET ?`, [user]
                );
                client.user_id = data.insertId;

                [data] = await connection.query(
                    `INSERT INTO clients SET ?`, [client]
                );
                clientId = data.insertId;
            });

            if (clientId) {
                res.status(201).send({ message : `Client with Id: ${clientId} is created` });
            } else {
                res.status(500).send(`Failed to Create a client`);
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    };

    static updateClient = async (req: Request, res: Response) => {

        try {
            const clientId = req.params.id;
            const clientDto = Object.assign(new UpdateClientDTO(), req.body);

            const errors = await validate(clientDto);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            const client = clientDto as ClientModel;
            client.updated_at = new Date();

            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM clients WHERE id = ?`, [clientId]
            );

            const clientExists = data as ClientModel[];
            if (!clientExists.length) {
                res.status(404).send(`Client with Id: ${clientId} not found`);
            }

            let isUpdated: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE clients SET ? WHERE id = ?`, [client, clientId]
                );
                isUpdated = data.affectedRows > 0;
            });

            if (isUpdated) {
                res.status(200).send({ message : `Client with Id: ${clientId} is updated` });
            } else {
                res.status(500).send(`Client with Id: ${clientId} is not updated`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static deleteClient = async (req: Request, res: Response) => {

        try {
            const clientId = req.params.id;
            let data: any;
            const pool = await connect();

            [data] = await pool.query(
                `SELECT 1 FROM clients WHERE id = ?`, [clientId]
            );

            const clientExists = data as ClientModel[];
            if (!clientExists.length) {
                res.status(404).send(`Client with Id: ${clientId} not found`);
            }

            let isDeleted: any;
            await transaction(pool, async connection => {
                [data] = await connection.query(
                    `UPDATE clients SET status = ? WHERE id = ?`, [Status.Archived, clientId]
                );
                isDeleted = data.affectedRows > 0;
            });

            if (isDeleted) {
                res.status(200).send({ message : `Client with Id: ${clientId} is deleted` });
            } else {
                res.status(500).send(`Client with Id: ${clientId} is not deleted`);
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
    };

    static getDetailsUserID = async (req: Request, res: Response) => {

        try {
            const userid = req.params?.id;
            const connection = await connect();

            const [data] = await connection.query(
                `SELECT id, user_id, name, address, landmark, pin_code, email, phone, created_by, created_at,
                        updated_by, updated_at FROM clients WHERE user_id = ?`, [userid]
            );

            const clients = data as ClientModel[];
            if (clients.length) {
                res.status(200).json(clients[0]);
            } else {
                res.status(404).send(`Client with Id: ${userid} not found`);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
}

export default ClientsController;
