import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';

interface SignUpFormState {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    [key: string]: string;
}

export default function SignUp() {

    const navigate = useNavigate();

    // Define states
    const [formData, setFormData] = useState<SignUpFormState>({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        
    });
    const [error, setError] = useState<string>('');

    // Event handler to update form data when textfield changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(`${name} => ${value}`);
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            firstname: data.get('firstname'),
            lastname: data.get('lastname'),
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
        });
        
        console.log(JSON.stringify(formData));

        const response = await postRegister();
        
        if (response.ok) {
            console.log(response);
            navigate('/');
        } else {
            try{
                const errorMessageStr = await response.text();
                const errorMessage = JSON.parse(errorMessageStr).detail;
                console.error('Authentication error:', errorMessage);
                setError(errorMessage);
            } catch (error) {
                console.error('Error fetching error message:', error);
                setError('Unable to register user. Try again.');
            }
            
        }
    };

    async function postRegister() {
        const response = await fetch('http://127.0.0.1:8000/register/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        return response;
    }

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
            Sign up
            </Typography>
            {error && (
                <Typography sx={{ mt: 1 }} variant="body2" color="error">
                    {error}
                </Typography>
            )}
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="given-name"
                            name="firstname"
                            required
                            fullWidth
                            id="firstname"
                            label="First Name"
                            value={formData.firstname}
                            onChange={handleChange}
                            autoFocus
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="lastname"
                            label="Last Name"
                            name="lastname"
                            autoComplete="family-name"
                            value={formData.lastname}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Typography variant="body2">
                            <Link to="/sign-in" >
                                Already have an account? Sign in
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    </Container>
  );
}