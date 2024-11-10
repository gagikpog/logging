import { ILogData, ILogFilter, LogType } from './interfaces';

export function getLogData(data: ILogData): ILogData | null {
    return isValidLogType(data.type) && Boolean(data.message) && isValidApplication(data.app) ? {
        id: data.id,
        message: data.message,
        app: data.app,
        created: data.created,
        type: data.type,
    } : null;
}

export function getLogFilter(data: ILogFilter): ILogFilter | null {
    return isValidApplication(data.app) ? {
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

function isValidApplication(app: string): boolean {
    return ['corners'].includes(app);
}
