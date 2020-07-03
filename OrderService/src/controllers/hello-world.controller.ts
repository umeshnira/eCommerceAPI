import { Request, Response } from 'express';

class HelloWorldController {

    static getHelloWorld = async (req: Request, res: Response) => {
        res.status(200).json('Hello World');
    };

}

export default HelloWorldController;