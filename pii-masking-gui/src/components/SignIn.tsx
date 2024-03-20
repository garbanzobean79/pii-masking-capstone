import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { EventRepeat } from '@mui/icons-material';

import { useNavigate, useLocation, redirect } from 'react-router-dom';

interface SignInFormState {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  // Used to redirect user
  const navigate = useNavigate();
  const location = useLocation();

  // Define states
  const [formData, setFormData] = useState<SignInFormState>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  // Event handler to update form data when username changes
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, username: event.target.value });
  }

  // Event handler to update form data when username changes
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: event.target.value });
  }

  // Event handler for handling the login button click
  const handleSignIn = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const loginSuccess = await authenticateUser(formData.username, formData.password);

    if (loginSuccess) {
      console.log("navigating to", location.state?.redirectTo);
      navigate('/masking-history');
      navigate(location.state?.redirectTo || '/');
    } else {
      // Display error message
      setError('Authentication error. Try again.');
    } 
  };

  async function authenticateUser(username: string, password: string) {
    const requestBody = new URLSearchParams();
    requestBody.append('username', username);
    requestBody.append('password', password);
    requestBody.append('grant_type', 'password');
  
    try {
      const response = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
      });
  
      if (!response.ok) {
        throw new Error('Failed to authenticate user');
      }
  
      const data = await response.json();

      // Store JWT in local storage
      sessionStorage.setItem("jwtToken", data.access_token);

      console.log('Authentication successful:', data);
      return true;
    } catch (error: any) {
      console.error('Authentication error:', error.message);
      return false;
    }
  }

  return (
    // <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
          {error && (
            <Typography sx={{ mt: 1 }} variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSignIn} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleUsernameChange}
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
              value={formData.password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    // </ThemeProvider>
  );
}

export default SignIn;