import type { Database } from 'sqlite3';
import type { IAppData, IUserData } from './interfaces';

export function readUser(username: string, db: Database): Promise<IUserData> {
    const sql = 'SELECT * FROM user WHERE username = ? OR email = ?';
    const params = [username, username];
    return new Promise<IUserData>((resolve, reject) => {
        db.get<IUserData>(sql, params, (err, row) => {

            if (err) {
                return reject(new Error(err.message));
            }

            if (!row) {
                return reject( new Error('user not found'));
            }

            resolve({
                username: row.username,
                name: row.name,
                email: row.email,
                id: row.id,
                password: row.password
            });
        });
    });
}

export function readUserApps(username: string, db: Database): Promise<IAppData[]> {
    const sql = 'SELECT * FROM `app` WHERE user = ?';
    const params = [username];
    return new Promise<IAppData[]>((resolve, reject) => {
        db.all<IAppData>(sql, params, (err, rows) => {
            if (err) {
                console.error('log', err.message);
                return reject(err.message);
            }
            resolve(rows || []);
        });
    });
}
