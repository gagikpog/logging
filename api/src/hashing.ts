import bcrypt from 'bcrypt';

export function encodePassword(password: string): Promise<string> {

    const passwordSalt = Number(process.env.PASSWORD_SALT);

    if (!passwordSalt) {
        console.error(`Password salt is "${passwordSalt}"`);
        return Promise.resolve('');
    }

    return bcrypt
        .hash(password, passwordSalt)
        .catch((err: Error) => {
            console.error(err.message);
            return '';
        });
}

export function validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt
        .compare(password, hash)
        .catch((err: Error) => {
            console.error(err.message);
            return false;
        });
}
