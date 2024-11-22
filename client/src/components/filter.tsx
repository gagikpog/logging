import { useMemo, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Box, IconButton } from '@mui/material';
import { IAppData, ILogFilter } from '../interfaces';
import LongMenu from './longMenu';
import { InputLabel } from '@mui/material';

export interface SimpleDialogProps {
    apps: IAppData[];
    filter: ILogFilter;
    open: boolean;
    onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose,  open } = props;

    const handleClose = () => {
        onClose('');
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    const options = useMemo(() => props.apps.map((app) => ({ id: app.name, title: app.title })), [props.apps]);

    const selectedApp = useMemo(() => props.apps.find((app) => app.name === props.filter.app), [props.apps, props.filter.app]);

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Filter</DialogTitle>

            <Box component="div" sx={{
                padding: 3,
                paddingTop: 0,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box component="div" sx={{display: 'flex', alignItems: 'baseline', gap: 2}}>
                    <InputLabel>Application</InputLabel>
                    <LongMenu options={options} title={selectedApp?.title}/>
                </Box>
            </Box>

        </Dialog>
    );
}

export default function Filter({filter, apps}: {filter: ILogFilter, apps: IAppData[]}) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);

    };

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <FilterAltIcon />
            </IconButton>

            <SimpleDialog open={open} onClose={handleClose} apps={apps} filter={filter}/>
        </div>
    );
}
