import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { IAppData } from '../interfaces';
import { createApp, deleteApp, readAppsList } from '../api';
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
    const [createOpen, setCreateOpen] = useState(false);
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [saving, setSaving] = useState(false);
    const [createError, setCreateError] = useState('');
    const [error, setError] = useState('');

    const reload = useCallback(() => readAppsList().then((data) => setApps(data)), []);

    useEffect(() => { reload() }, [reload]);

    const onExecuteAction = useCallback((item: IAppData, action: IAction) => {
        switch (action.id) {
            case 'delete':
                deleteApp(item.name).then(() => {
                    setError('');
                    reload();
                }).catch((error: Error) => {
                    setError(error.message);
                });
                break;
            default:
                break;
        }
    }, [reload]);

    const openCreate = () => {
        setName('');
        setTitle('');
        setCreateError('');
        setCreateOpen(true);
    };

    const closeCreate = () => {
        if (!saving) setCreateOpen(false);
    };

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (saving) return;
        if (!name.trim() || !title.trim()) {
            setCreateError('Name and title are required.');
            return;
        }
        setSaving(true);
        setCreateError('');
        try {
            await createApp({ name: name.trim(), title: title.trim() });
            setCreateOpen(false);
            await reload();
        } catch (error) {
            setCreateError(error instanceof Error ? error.message : 'Unable to create app.');
        } finally {
            setSaving(false);
        }
    };

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

            {error && <Alert severity="error">{error}</Alert>}

            <BasicTable columns={columns} rows={apps} actions={actions} onExecuteAction={onExecuteAction}/>

            <IconButton aria-label="Add app" onClick={openCreate} color="secondary" sx={{position: 'absolute', right: '10px', bottom: '10px'}}>
                <AddCircleIcon fontSize="large" />
            </IconButton>

            <Dialog open={createOpen} onClose={closeCreate} fullWidth maxWidth="xs" aria-labelledby="create-app-title">
                <Box component="form" onSubmit={handleCreate}>
                    <DialogTitle id="create-app-title">Add app</DialogTitle>
                    <DialogContent>
                        {createError && <Alert severity="error">{createError}</Alert>}
                        <TextField
                            autoFocus required fullWidth margin="normal"
                            label="Name" value={name} disabled={saving}
                            helperText="Identifier used when sending logs."
                            onChange={(event) => setName(event.target.value)}
                        />
                        <TextField
                            required fullWidth margin="normal"
                            label="Title" value={title} disabled={saving}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeCreate} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving || !name.trim() || !title.trim()}>
                            {saving ? 'Saving…' : 'Create'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

        </Box>
    );
}
