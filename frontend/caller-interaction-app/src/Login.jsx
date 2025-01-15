import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)({
  padding: '2rem',
  maxWidth: '400px',
  margin: '2rem auto',
  backgroundColor: '#121212',
  color: '#ffffff',
});

const StyledButton = styled(Button)({
  backgroundColor: '#ffffff',
  color: '#121212',
  marginTop: '1rem',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

const StyledLink = styled(Link)({
  color: '#4caf50',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.access_token) {
        // Store the token in localStorage
        localStorage.setItem('jwtToken', data.access_token);

        // Use the token to fetch user details if available
        const userResponse = await fetch('http://localhost:8000/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        const userData = await userResponse.json();
        if (userResponse.ok) {
          setUser(userData);
        } else {
          console.error('Failed to fetch user details:', userData);
        }

        // Redirect to the call page
        navigate('/call');
      } else {
        alert(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again later.');
    }
  };

  return (
    <Container>
      <StyledPaper elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <StyledButton type="submit" variant="contained" fullWidth>
            Login
          </StyledButton>
        </form>
        <Grid container justifyContent="space-between" alignItems="center" mt={2}>
          <Grid item>
            <Typography variant="body2">
              Don’t have an account?{' '}
              <StyledLink to="/register">Register</StyledLink>
            </Typography>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default Login;
