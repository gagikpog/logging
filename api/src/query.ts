import type { Database } from 'sqlite3';
import type { IUserData } from './interfaces';

export function readUser(username: string, db: Database): Promise<IUserData> {
    const sql = 'SELECT * FROM user WHERE username = ? OR email = ?';
    const params = [username, username];
    return new Promise<IUserData>((resolve, rejects) => {
        db.get<IUserData>(sql, params, (err, row) => {

            if (err) {
                return rejects(new Error(err.message));
            }

            if (!row) {
                return rejects( new Error('user not found'));
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
