import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ILogData } from '../interfaces';
import { readLogList } from '../api';

export default function Logs() {

    const [logs, setLogs] = useState<ILogData[]>([])

    useEffect(() => {
        readLogList({ app: 'corners' }).then((data) => {
            setLogs(data);
        });
    }, []);

    return (
        <Box
            component="div"
            sx={{
              margin: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" align="center">
                Logging view page
            </Typography>
            {
                logs.map((row) => {
                    return <div key={row.id}>{row.message}</div>
                })
            }
        </Box>
    );
}
