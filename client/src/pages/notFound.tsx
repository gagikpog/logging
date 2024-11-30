import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <Box
            component="div"
            sx={{
                padding: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
          >
            <Typography component="h1" variant="h1" fontWeight='bold' >404</Typography>
            <Link to="/">Home</Link>
        </Box>
    );
}
