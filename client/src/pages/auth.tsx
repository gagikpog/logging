import { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Container, TextField } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { auth, getCurrentUser } from '../api';
import { useUser } from '../hooks/useUser';

export default function Auth() {

    const [message, setMessage] = useState('');
    const {setUser} = useUser();
    const navigate = useNavigate();

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('email') as string;
        const password = data.get('password') as string;
        if (username && password) {
            auth(username, password).then((res) => {
                if (!res.error) {
                    getCurrentUser().then((user) => {
                        setUser(user);
                        navigate('/');
                    });
                }
                setMessage(res.message);
            });
        }
    }, [navigate, setUser]);

    return (
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Typography component="div" sx={{ color: "#dd0101" }}>
                {message}
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
    );
}
