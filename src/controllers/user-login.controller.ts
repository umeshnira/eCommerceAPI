import { connect } from '../context/db.context';
import { Request, Response } from 'express';
import { UserModel } from '../models';


class LoginController {

    static userLogin = async (req: Request, res: Response) => {
        try {

            const connection = await connect();
            const loginModel = req.body as UserModel;
            const [data] = await connection.query(`SELECT * from users where user_name = ?`, [loginModel.user_name]);

            const user = data as UserModel[];

            if (user.length > 0) {
                const value = user.filter(x => x.password === loginModel.password);

                if (value.length === 0) {
                    res.status(404).send('Invalid password');
                }
            }
            else {
                res.status(404).send('username does not exist');
            }

            const [loginDetails] = await connection.query(
                `SELECT users.user_name as user_name,
                users.id as user_id,
                carts.id as cart_id,
                roles.name as role
                FROM users
                INNER JOIN roles ON users.role = roles.id
                INNER JOIN carts ON users.id = carts.user_id
                where users.user_name = '${loginModel.user_name}' `
            )
            const userLoginDetails = loginDetails as UserModel[];
            res.status(200).send(...userLoginDetails);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

export default LoginController;