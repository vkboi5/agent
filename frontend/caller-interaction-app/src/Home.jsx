import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Background = styled(Box)({
  backgroundColor: '#121212',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
});

const StyledButton = styled(Button)({
  color: '#121212',
  backgroundColor: '#ffffff',
  margin: '0.5rem',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

function Home() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to /login
  };

  return (
    <Background>
      <Container>
        <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
          Welcome to Your Voice Assistant Bot
        </Typography>
        <Typography
          variant="h5"
          align="center"
          paragraph
          sx={{ color: '#b0b0b0', maxWidth: '800px', margin: 'auto' }}
        >
          A real-time AI-driven voice bot that handles cold calls, provides personalized product discussions,
          and ensures low-latency communication for an exceptional user experience.
        </Typography>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <StyledButton variant="contained" size="large">
              Learn More
            </StyledButton>
          </Grid>
          <Grid item>
            <StyledButton variant="contained" size="large" onClick={handleLoginClick}>
              Get Started
            </StyledButton>
          </Grid>
        </Grid>
      </Container>
      <Box mt={4}>
        <Typography variant="body2" align="center" sx={{ color: '#b0b0b0' }}>
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </Typography>
      </Box>
    </Background>
  );
}

export default Home;
