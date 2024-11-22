import type { Express, Request, Response } from 'express';
import type { Database } from 'sqlite3';
import { authenticateToken, generateAccessToken } from '../jwt';
import { IUserData, RequestCustom } from '../interfaces';
import { readUser } from '../query';
import { encodePassword, validatePassword } from '../hashing';

export function registerUserRoute(app: Express, db: Database): void {
    app.get('/logging/user/', authenticateToken, (req: RequestCustom, res: Response) => {
        const username = req.username;
        if (!username) {
            res.status(400).send({ error: 'user not found' });
            return;
        }
        readUser(username, db).then((userData) => {
            res.json({
                message: 'success',
                data: {
                    id: userData.id,
                    username: userData.username,
                    name: userData.name,
                    email: userData.email
                }
            });
        }).catch((err) => {
            res.status(400).json({ 'error': err.message })
        });
    });

    app.post('/logging/create-user/', (req: Request, res: Response): void => {
        const { name, username, password, email } = req.body;
        if (!username || !password && !email) {
            // TODO: fix validation
            res.status(400).json({ error: 'name, username, email and password required' });
            return;
        }

        const sql = 'SELECT * FROM user WHERE username = ? OR email = ?';
        db.get(sql, [username, email], (err, row) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }

            if (row) {
                // TODO: fix validation
                res.status(400).json({ error: 'user already exist' });
                return;
            }

            return encodePassword(password).then((passwordHash) => {
                if (passwordHash) {
                    const insert = 'INSERT INTO user (name, username, email, password) VALUES (?, ?, ?, ?)';
                    db.run(insert, [name, username, email, (passwordHash)]);
                    const token = generateAccessToken({ username });
                    res.status(200).json({ token });
                } else {
                    res.status(200).json({ error: 'invalid password' });
                }
            });
        });
    });

    app.post('/logging/auth/', (req: Request, res: Response): void => {
        const { username, password } = req.body;
        if (!(username) || !password) {
            // TODO: fix validation
            res.status(400).json({ error: 'username and password required' });
            return;
        }

        readUser(username, db).then((userData: IUserData): void => {
            validatePassword(password, userData.password).then((isValid: boolean) => {
                if (isValid) {
                    const token = generateAccessToken({ username: userData.username });
                    res.status(200).json({ token });
                } else {
                    res.status(200).json({ error: 'wrong login or password' });
                }
            });
        }).catch(() => {
            res.status(200).json({ error: 'wrong login or password' });
        });
    });
}
