import { Request, Response } from 'express';
import { badRequest, created, serverError } from '../views';
import UserModel from '../models/Users';
import { encrypt } from '../utils/hash';


export default async function addUserController(req: Request, res: Response) {
    try {
        const { phno, pass } = req.body;
        if ( !pass || typeof phno !== "number" || phno.toString().length !== 10 ) {
            badRequest(res);
            return;
        }

        const existingUser = await UserModel.findOne({ phno });
        if (existingUser) {
            badRequest(res);
            return;
        }

        req.body.pass = await encrypt(req.body.pass);
        const newUser = new UserModel(req.body);
        await newUser.save();
        created(res, {message: "User Added Successfully"});
    } catch(err) {
        serverError(res, err);
    }
}