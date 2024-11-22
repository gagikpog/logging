import type { Express, Response } from 'express';
import type { Database } from 'sqlite3';
import { authenticateToken } from '../jwt';
import { readUserApps } from '../query';
import { IAppData, RequestCustom } from '../interfaces';

export function registerAppsRoute(app: Express, db: Database): void {
    app.get('/logging/apps/', authenticateToken, (req: RequestCustom, res: Response): void => {
        readUserApps(req.username || 'NULL', db).then((rows) => {
            res.status(200).send(rows);
        }).catch((err: Error) => {
            res.status(400).send({ error: err.message });
        });
    });

    app.put('/logging/apps/', authenticateToken, (req: RequestCustom, res: Response): void => {
        const username = req.username || 'NULL';
        const data: IAppData = 'name' in req.body && 'title' in req.body ? req.body : null;

        if (data) {
            readUserApps(req.username || 'NULL', db).then((rows) => {
                if (rows.find((a) => a.name === data.name)) {
                    res.status(200).json({ error: `app with name "${data.name}" already exist` });
                } else {
                    const insert = 'INSERT INTO `app` (name, title, user) VALUES (?,?,?)';
                    db.run(insert, [data.name, data.title, username]);
                    res.status(200).json({ error: '' });
                }
            }).catch((err: Error) => {
                res.status(400).send({ error: err.message });
            });
        } else {
            res.status(400).send({ error: 'invalid data' });
        }
    });

    app.delete('/logging/apps/', authenticateToken, (req: RequestCustom, res: Response): void => {
        const username = req.username || 'NULL';
        const data: IAppData = 'name' in req.body ? req.body : null;

        if (data) {
            const sql = 'DELETE FROM `app` WHERE `user` = ? AND `name` = ?';
            db.run(sql, [username, data.name]);
            res.status(200).json({ error: '' });
        } else {
            res.status(400).send({ error: 'invalid data' });
        }
    });
}
