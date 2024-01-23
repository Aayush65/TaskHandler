import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { badRequest, forbidden, serverError, statusOkay, unauthAccess } from "../views";
import { ObjectId } from 'mongodb';
import UserModel from '../models/Users';
import { compare } from '../utils/hash';

interface jwtPayload {
    _id: ObjectId,
    isAccessToken: boolean
}

export default async function issueTokenController(req: Request, res: Response) {
    try {
        const { phno, pass } = req.body;
        if (!phno || !pass || typeof phno !== "number" || phno.toString().length !== 10) {
            badRequest(res);
            return;
        }
        const userData = await UserModel.findOne({phno});
        if (!userData || !await compare(pass, userData.pass as string)) {
            forbidden(res);
            return;
        }
        const { _id } = userData;
        const accessToken = jwt.sign({ _id, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '30m'});
        const refreshToken = jwt.sign({ _id, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '1d'});
        statusOkay(res, { accessToken, refreshToken, message: "Login Successful" });
    } catch(err) {
        serverError(res, err);
    }
}

export async function renewTokenController(req: Request, res: Response) {
    try {
        const refreshTokenHeader = req.headers.authorization;
        if (!refreshTokenHeader) {
            unauthAccess(res);
            return;
        }
        const refreshJWTToken = refreshTokenHeader.split(' ')[1];
        if (!refreshJWTToken) {
            unauthAccess(res);
            return;
        }
        const decodedjwt = (jwt.verify(refreshJWTToken, (process.env.SECRET_KEY as string)) as jwtPayload);
        if (!decodedjwt._id || decodedjwt.isAccessToken){
            unauthAccess(res);
            return;
        }
        const _id = decodedjwt._id;
        const accessToken = jwt.sign({ _id, isAccessToken: true }, (process.env.SECRET_KEY as string), {expiresIn: '30m'});
        const refreshToken = jwt.sign({ _id, isAccessToken: false }, (process.env.SECRET_KEY as string), {expiresIn: '1d'});
    
        const userData = await UserModel.findById({ _id });
        if (!userData) {
            unauthAccess(res);
            return;
        }
        statusOkay(res, { accessToken, refreshToken })  
    } catch(err) {
        serverError(res, err);
    }
}