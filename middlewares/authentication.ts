import {Response, Request, NextFunction} from 'express'
import { decode } from 'jsonwebtoken';
import Token from '../classes/token';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {

    const userToken = req.get('x-token') || '';

    Token.checkToken( userToken )
        .then( (decode: any) => {
            console.log('Decode', decode);
            req.user = decode.user;
            next();
        }).catch( err => {
            res.json({
                state: false,
                message: 'Invalid Token'
            })
        })

}