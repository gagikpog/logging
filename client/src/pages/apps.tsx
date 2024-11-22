import { Box, IconButton, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { IAppData } from '../interfaces';
import { deleteApp, readAppsList } from '../api';
import BasicTable, { IAction, IColumn } from '../components/table';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const columns: IColumn<IAppData>[] = [
    { field: 'name', headerName: 'Name' },
    { field: 'title', headerName: 'Title' }
];

const actions: IAction[]  = [
    { id: 'delete', title: 'Delete'}
];

export default function Apps() {

    const [apps, setApps] = useState<IAppData[]>([]);

    const reload = useCallback(() => readAppsList().then((data) => setApps(data)), []);

    useEffect(() => { reload() }, [reload]);

    const onExecuteAction = useCallback((item: IAppData, action: IAction) => {
        switch (action.id) {
            case 'delete':
                deleteApp(item.name).then(() => {
                    reload();
                });
                break;
            default:
                break;
        }
    }, [reload]);

    return (
        <Box
            component="div"
            sx={{
              margin: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography component="h1" variant="h5"> Apps </Typography>

            <BasicTable columns={columns} rows={apps} actions={actions} onExecuteAction={onExecuteAction}/>

            <IconButton aria-label="delete" color="secondary" sx={{position: 'absolute', right: '10px', bottom: '10px'}}>
                <AddCircleIcon fontSize="large" />
            </IconButton>

        </Box>
    );
}
