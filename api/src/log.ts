import { Request } from 'express';
import { ILogData, ILogFilter, LogType } from './interfaces';

export function getLogData(req: Request): ILogData | null {
    const data = req.body as unknown as ILogData;
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';

    return isValidLogType(data.type) && Boolean(data.message) && Boolean(data.user) && Boolean(data.app) ? {
        id: data.id,
        message: data.message,
        app: data.app,
        created: data.created,
        user: data.user,
        type: data.type,
        ip
    } : null;
}

export function getLogFilter(data: ILogFilter): ILogFilter | null {
    return data.app ? {
        id: data.id,
        app: data.app,
        types: data.types ? data.types.filter(isValidLogType) : [],
        dateFrom: data.dateFrom,
        dateTo: data.dateTo
    } : null
}

function isValidLogType(type: LogType): boolean {
    return [LogType.Error, LogType.Info, LogType.Log, LogType.Warning].includes(type);
}
