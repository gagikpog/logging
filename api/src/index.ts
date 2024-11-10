import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import db from './database';
import cors from 'cors';
import { authenticateToken, generateAccessToken } from './jwt';
import { ILogData, IUserData, RequestCustom } from './interfaces';
import { getLogData, getLogFilter } from './log';
import { encodePassword, validatePassword } from './hashing';

dotenv.config();

const app: Express = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors({ origin: '*'}));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/logging/', (_req: Request, res: Response) => {
    res.status(200).send('Hello from Logging API');
});

app.get('/logging/user/', authenticateToken, (req: RequestCustom, res: Response) => {
    const username = req.username;
    if (!username) {
        res.status(400).send('');
        return;
    }

    const sql = 'SELECT * FROM user WHERE username = ?';
    const params = [username];
    db.get<IUserData>(sql, params, (err, row) => {

        if (err) {
            return res.status(400).json({'error': err.message});
        }

        if (!row) {
            return res.status(400).json({'error': 'user not found'});
        }
        res.json({
            'message':'success',
            'data': {
                username: row.username,
                name: row.name,
                email: row.email
            }
        });
    });
});

app.post('/logging/add/', (req: Request, res: Response): void => {
    const data = getLogData(req.body);

    if (data) {
        const insert = 'INSERT INTO log (message, type, app) VALUES (?,?,?)';
        db.run(insert, [data.message, data.type, data.app]);
        res.status(200).json({ error: false });
    } else {
        res.status(400).send('invalid data');
    }
});

app.post('/logging/list/', authenticateToken, (req: Request, res: Response): void => {
    const data = getLogFilter(req.body);

    if (data) {
        const wheres = ['app = ?'];
        const wheresData: (string | number)[] = [data.app];

        if (data.id) {
            wheres.push('id = ?');
            wheresData.push(data.id);
        }

        if (data.types?.length) {
            wheres.push(`(${data.types.map((type) => `type = "${type}"`).join(' OR ')})`);
        }

        const sql = `SELECT * FROM log WHERE ${wheres.join(' AND ')}`;

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
    const { username, password, email } = req.body;
    if (!(username || email) || !password) {
        // TODO: fix validation
        res.status(400).json({ error: 'username or email and password required' });
        return;
    }
    
    const sql = 'SELECT * FROM user WHERE username = ? OR email = ?';
    db.get<IUserData>(sql, [username, email], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        if (!row) {
            res.status(200).json({ error: 'wrong login or password' });
            return;
        }

        validatePassword(password, row.password).then((isValid) => {
            if (isValid) {
                const token = generateAccessToken({ username });
                res.status(200).json({ token });
            } else {
                res.status(200).json({ error: 'wrong login or password' });
            }
        });
    });
});

app.get('*', (req: Request, res: Response): void => {
    res.status(404).send(`Not found "${req.path}"`);
});

app.post('*', (req: Request, res: Response): void => {
    res.status(404).send(`Not found "${req.path}"`);
});
