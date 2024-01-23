import { Request, Response, NextFunction } from 'express';
import { unauthAccess } from '../views';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import UserModel from '../models/Users';

interface jwtPayload {
    _id: ObjectId,
    isAccessToken: boolean
}

export default async function AuthMiddleWare(req: Request, res: Response, next: NextFunction) {
    try {
        const authorisationToken = req.headers.authorization;
        if (!authorisationToken) {
            unauthAccess(res);
            return;
        }
        const jwtToken = authorisationToken.split(' ')[1];
        const decodedjwt = (jwt.verify(jwtToken, (process.env.SECRET_KEY as string)) as jwtPayload);

        if (!decodedjwt || !decodedjwt.isAccessToken) {
            unauthAccess(res);
            return;
        }
        const userData = await UserModel.findById({ _id: decodedjwt._id });
        if (!userData) {
            unauthAccess(res);
            return;
        }

        res.locals.userId = decodedjwt._id;
        next();
    } catch (err) {
        unauthAccess(res);
    }
}