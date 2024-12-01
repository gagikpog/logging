import { useCallback, useMemo, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Box, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { IAppData, ILogFilter, LogType } from '../interfaces';
import LongMenu, { IMenuOptions } from './longMenu';
import { InputLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export interface SimpleDialogProps {
    apps: IAppData[];
    filter: ILogFilter;
    onClose: () => void;
    onSave: (filter: ILogFilter) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, onSave } = props;

    const [selectedApp, setSelectedApp] = useState(() => props.apps.find((app) => app.name === props.filter.app));

    const [selectedTypes, setSelectedTypes] = useState(() => {
        return (props.filter.types || []).reduce((res: Set<LogType>, type: LogType) => {
            res.add(type);
            return res
        }, new Set<LogType>());
    });

    const handleClose = () => {
        onClose();
    };

    const handleSave = () => {
        const types: LogType[] = []
        selectedTypes.forEach((type) => types.push(type));
        onSave({ app: selectedApp?.name || '', types });
        onClose();
    };

    const options = useMemo(() => props.apps.map((app) => ({ id: app.name, title: app.title })), [props.apps]);

    const typeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as LogType;
        setSelectedTypes((prev) => {
            if (prev.has(name)) {
                prev.delete(name);
            } else {
                prev.add(name);
            }
            return new Set(prev);
        });
    }, []);

    const selectedAppChanged = useCallback((option: IMenuOptions) => {
        setSelectedApp(props.apps.find((app) => app.name === option.id));
    }, [props.apps]);

    return (
        <Dialog onClose={handleClose} open={true}>

            <DialogTitle>
                <Box component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        Filter
                    </div>
                    <IconButton onClick={handleSave} color="primary"><CheckCircleIcon fontSize='large'/></IconButton>
                </Box>
            </DialogTitle>

            <Box component="div" sx={{
                padding: 3,
                paddingTop: 0,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box component="div" sx={{display: 'flex', alignItems: 'baseline', gap: 2}}>
                    <InputLabel>Application</InputLabel>
                    <LongMenu options={options} title={selectedApp?.title} onSelect={selectedAppChanged}/>
                </Box>
                <Box component="div" sx={{display: 'flex', alignItems: 'baseline', columnGap: 2, flexWrap: 'wrap' }}>
                    <FormControlLabel control={<Checkbox onChange={typeChange} checked={selectedTypes?.has(LogType.Error)}  name="error" />} label="Error" />
                    <FormControlLabel control={<Checkbox onChange={typeChange} checked={selectedTypes?.has(LogType.Log)}  name="log" />} label="Log" />
                    <FormControlLabel control={<Checkbox onChange={typeChange} checked={selectedTypes?.has(LogType.Warning)}  name="warning" />} label="Warn" />
                    <FormControlLabel control={<Checkbox onChange={typeChange} checked={selectedTypes?.has(LogType.Info)}  name="info" />} label="Info" />
                </Box>
            </Box>
        </Dialog>
    );
}

export default function Filter({filter, apps, onSave}: {filter: ILogFilter, apps: IAppData[], onSave: (filter: ILogFilter) => void}) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <FilterAltIcon />
            </IconButton>
            {
                open ? <SimpleDialog onClose={handleClose} apps={apps} filter={filter} onSave={onSave}/> : null
            }
        </div>
    );
}
