import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { IAppData, ILogData, ILogFilter } from '../interfaces';
import { readAppsList, readLogList } from '../api';
import BasicTable, { IColumn } from '../components/table';
import Filter from '../components/filter';

const columns: IColumn<ILogData>[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'app', headerName: 'Application' },
    { field: 'type', headerName: 'Type' },
    { field: 'message', headerName: 'Message' },
    { field: 'created', headerName: 'Date' },
];

export default function Logs() {

    const [apps, setApps] = useState<IAppData[]>([]);
    const [logs, setLogs] = useState<ILogData[]>([]);
    const [filter, setFilter] = useState<ILogFilter>({app: '', dateFrom: '', dateTo: '', types: []});

    useEffect(() => {
        readAppsList().then((apps) => {
            setApps(apps);
            const currentAppName = apps[0]?.name || '';
            setFilter((f) => ({...f, app: currentAppName}));
        });
    }, []);

    useEffect(() => {
        if (filter.app) {
            readLogList(filter).then((data) => setLogs(data));
        }
    }, [filter]);

    return (
        <Box
            component="div"
            sx={{
              margin: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography component="h1" variant="h5" align="center">Logging view page</Typography>
            <Filter filter={filter} apps={apps} />
            <BasicTable columns={columns} rows={logs}/>
        </Box>
    );
}
