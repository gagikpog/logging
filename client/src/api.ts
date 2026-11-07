import { IAppData, IAuthResult, IFullUser, ILogData, ILogFilter, IUser } from './interfaces';

function getOriginPath(path: string): string {
    const isDebug = localStorage.getItem('debug') === 'on';
    const host = isDebug ? 'http://localhost:8003/log' : 'https://api.gagikpog.ru/log';
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

export function readAppsList(): Promise<IAppData[]> {
    return fetch(getOriginPath('/apps/'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    }).then((res) => {
        return res.json();
    }).catch(() => {
        console.error('apps get error');
        return [];
    });
}

async function changeApp(method: 'PUT' | 'DELETE', data: { name: string; title?: string }): Promise<void> {
    const response = await fetch(getOriginPath('/apps/'), {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: { error?: string } | null = await response.json().catch(() => null);
    if (!response.ok || result?.error !== '') {
        throw new Error(result?.error || `Unable to save app changes (HTTP ${response.status})`);
    }
}

export function deleteApp(name: string): Promise<void> {
    return changeApp('DELETE', { name });
}

export function createApp(data: { name: string, title: string }): Promise<void> {
    return changeApp('PUT', data);
}
