import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';

const Background = styled(Box)({
  backgroundColor: '#121212',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
});

const StyledPaper = styled(Paper)({
  padding: '2rem',
  backgroundColor: '#1e1e1e',
  color: '#ffffff',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  marginTop: '1rem',
  backgroundColor: '#ffffff',
  color: '#121212',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

const StyledLink = styled(Link)({
  marginTop: '1rem',
  display: 'block',
  textDecoration: 'none',
  color: '#b0b0b0',
  '&:hover': {
    color: '#ffffff',
  },
});

const Register = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        'https://61ea-2401-4900-5020-7597-fdb1-9ba1-6cc7-9f67.ngrok-free.app/register',
        {
          email,
          password,
        }
      );

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Registration failed');
    }
  };

  return (
    <Background>
        <StyledPaper elevation={3}>
          <Typography variant="h4" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: '#b0b0b0' } }}
              InputProps={{ style: { color: '#ffffff' } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: '#b0b0b0' } }}
              InputProps={{ style: { color: '#ffffff' } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputLabelProps={{ style: { color: '#b0b0b0' } }}
              InputProps={{ style: { color: '#ffffff' } }}
            />
            {errorMessage && (
              <Alert severity="error" style={{ marginTop: '1rem' }}>
                {errorMessage}
              </Alert>
            )}
            <StyledButton
              type="submit"
              variant="contained"
              fullWidth
              size="large"
            >
              Register
            </StyledButton>
          </form>
          <StyledLink to="/login">
            Already registered? Log in here
          </StyledLink>
        </StyledPaper>
    </Background>
  );
};

export default Register;
