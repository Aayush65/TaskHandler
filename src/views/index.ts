import { Response } from 'express'; 

export function statusOkay(res: Response, message: any) {
    res.status(200).json(message);
}

export function created(res: Response, message: any) {
    res.status(201).json(message);
}

export function badRequest(res: Response) {
    res.status(400).json({message: 'Bad Request'});
}

export function unauthAccess(res: Response) {
    res.status(401).json({message: 'Unauthorised'});
}

export function forbidden(res: Response) {
    res.status(403).json({message: 'Forbidden'});
}

export function notFound(res: Response) {
    res.status(404).json({message: 'Not Found'});
}

export function serverError(res: Response, err: unknown) {
    console.log(err);
    res.status(500).json({message: 'Internal Server Error'});
}