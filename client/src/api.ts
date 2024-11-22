import { IAuthResult, IFullUser, ILogData, ILogFilter, IUser } from './interfaces';

function getOriginPath(path: string): string {
    const isDebug = localStorage.getItem('debug') === 'on';
    const host = isDebug ? 'http://localhost:8003/logging' : 'https://gagikpog-api.ru/logging';
    return `${host}${path}`;
}

export function createUser(data: IFullUser) {
    fetch(getOriginPath('/create-user/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then((res) => {
        return res.json();
    }).then((data) => {
        localStorage.setItem('token', data.token);
    }).catch(() => {
        console.error('user create error');
    });
}

export function getCurrentUser(): Promise<IUser> {
    const token = localStorage.getItem('token');
    if (!token) {
        return Promise.resolve({} as IUser);
    }

    return fetch(getOriginPath('/user/'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then((res) => {
        return res.json();
    }).then((res) => {
        return res.data;
    }).catch(() => {
        console.error('user get error');
        return {};
    });
}

export function auth(username: string, password: string): Promise<IAuthResult> {
    return fetch(getOriginPath('/auth/'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password})
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            return {
                message: '',
                error: false
            };
        } else {
            localStorage.removeItem('token');
            return {
                message: data.error,
                error: true
            };
        }
    }).catch(() => {
        return {
            message: 'auth error',
            error: true
        };
    });
}

export function readLogList(filter: ILogFilter): Promise<ILogData[]> {
    return fetch(getOriginPath('/list/'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(filter),
    }).then((res) => {
        return res.json();
    }).catch(() => {
        console.error('user get error');
        return [];
    });
}
