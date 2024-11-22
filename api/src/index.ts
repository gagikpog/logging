import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import db from './database';
import cors from 'cors';
import { registerAppsRoute } from './routes/apps';
import { registerUserRoute } from './routes/user';
import { registerLogsRoute } from './routes/log';

dotenv.config();

const app: Express = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors({ origin: '*' }));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/logging/', (_req: Request, res: Response) => {
    res.status(200).send('Hello from Logging API');
});

registerAppsRoute(app, db);
registerUserRoute(app, db);
registerLogsRoute(app, db);

app.get('*', (req: Request, res: Response): void => {
    res.status(404).send(`Not found "${req.path}"`);
});

app.post('*', (req: Request, res: Response): void => {
    res.status(404).send(`Not found "${req.path}"`);
});
