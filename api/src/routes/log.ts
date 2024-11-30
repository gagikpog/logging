import type { Express, Request, Response } from 'express';
import type { Database } from 'sqlite3';
import { authenticateToken } from '../jwt';
import { readUser, readUserApps } from '../query';
import { ILogData, RequestCustom } from '../interfaces';
import { getLogData, getLogFilter } from '../log';

export function registerLogsRoute(app: Express, db: Database): void {
    app.post('/logging/add/', (req: Request, res: Response): void => {
        const data = getLogData(req);

        if (data) {
            Promise.all([
                readUserApps(data.user, db),
                readUser(data.user, db)
            ]).then(([apps, userData]) => {
                const currentApp = apps.find((a) => a.name === data.app);
                if (currentApp) {
                    const insert = 'INSERT INTO log (message, type, ip, app, user) VALUES (?,?,?,?,?)';
                    db.run(insert, [data.message, data.type, data.ip, currentApp.name, userData.username]);
                    res.status(200).json({ error: '' });
                } else {
                    res.status(400).send({ error: `unknown app "${data.app}"` });
                }
            }).catch((err: Error) => {
                res.status(400).send({ error: err.message });
            });
        } else {
            res.status(400).send({ error: 'invalid data' });
        }
    });

    app.post('/logging/list/', authenticateToken, (req: RequestCustom, res: Response): void => {
        const data = getLogFilter(req.body);

        if (data) {
            const wheres = ['app = ?', 'user = ?'];
            const wheresData: (string | number)[] = [data.app, req.username || 'NULL'];

            if (data.id) {
                wheres.push('id = ?');
                wheresData.push(data.id);
            }

            if (data.types?.length) {
                wheres.push(`(${data.types.map((type) => `type = "${type}"`).join(' OR ')})`);
            }

            // TODO: suggest filters data.dateFrom and data.dateTo

            const sql = `SELECT * FROM log WHERE ${wheres.join(' AND ')} ORDER BY id DESC`;

            db.all<ILogData[]>(sql, wheresData, (err, rows) => {
                if (err) {
                    console.error('log', err.message);
                    res.status(400).json({ error: err.message });
                    return;
                }

                if (!rows) {
                    // TODO: fix validation
                    res.status(400).json({ error: 'user already exist' });
                    return;
                }
                res.status(200).send(rows);
            });

        } else {
            res.status(400).send('invalid data');
        }
    });
}
