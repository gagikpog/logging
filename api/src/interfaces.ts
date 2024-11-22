import { Request } from 'express';

export enum LogType {
    Error = 'error',
    Warning = 'warning',
    Log = 'log',
    Info = 'info'
}

export interface RequestCustom extends Request {
    username?: string;
}

export interface IUserData {
    id: number
    username: string;
    name: string;
    email: string;
    password: string;
}

export interface ILogData {
    id: number;
    message: string;
    type: LogType;
    app: string;
    user: string;
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
