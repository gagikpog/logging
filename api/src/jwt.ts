import { sign, verify, type VerifyCallback, type VerifyErrors, JwtPayload,  Jwt} from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { RequestCustom } from './interfaces';

interface  IPayload {
    username: string;
}

export function generateAccessToken(payload: IPayload) {
    if (!process.env.TOKEN_SECRET) {
        console.error(`TOKEN_SECRET is "${process.env.TOKEN_SECRET}"`);
    }

    return sign(payload, process.env.TOKEN_SECRET || '', { expiresIn: '90d' });
}

export function authenticateToken(req: RequestCustom, res: Response, next: NextFunction): void {
    if (!process.env.TOKEN_SECRET) {
        console.error(`TOKEN_SECRET is "${process.env.TOKEN_SECRET}"`);
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
        return;
    }

    const callback:  VerifyCallback = (err: VerifyErrors | null, result?): void => {
        if (err) {
            res.sendStatus(403);
        } else {
            if (typeof result !== 'string' && result && 'username' in result) {
                req.username = (result as IPayload).username;
            }
            next();
        }
    }

    verify(token, process.env.TOKEN_SECRET || '', callback);
}
