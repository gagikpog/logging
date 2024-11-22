export enum LogType {
    Error = 'error',
    Warning = 'warning',
    Log = 'log',
    Info = 'info'
}
export interface IUser {
    name: string;
    username: string;
    email: string;
}

export interface IFullUser extends IUser {
    password: string;
}

export interface IAuthResult {
    message: string;
    error: boolean;
}

export interface ILogData {
    id: number;
    message: string;
    type: LogType;
    app: string;
    created: string;
}

export interface IAppData {
    id: number;
    name: string;
    title: string;
    user: string;
    created: string;
}

export interface ILogFilter {
    id?: number;
    app: string;
    types?: LogType[];
    dateFrom?: string;
    dateTo?: string;
}
