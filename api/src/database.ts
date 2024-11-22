import { type Database, verbose} from 'sqlite3';
const sqlite3 = verbose();
const DB_SOURCE = "db.sqlite";

const db: Database = new sqlite3.Database(DB_SOURCE, (err: Error | null) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err: Error) => {
            if (err) {
                console.log('Table "user" already created');
            }
        });

        db.run(`CREATE TABLE "log" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "message" TEXT,
            "type" TEXT,
            "app" TEXT,
            "user" TEXT,
            "created" TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        (err: Error) => {
            if (err) {
                console.log('Table "log" already created');
            }
        });

        db.run(`CREATE TABLE "app" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "name" TEXT,
            "title" TEXT,
            "user" TEXT,
            "created" TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        (err: Error) => {
            if (err) {
                console.log('Table "log" already created');
            }
        });
    }
});

export default db;
