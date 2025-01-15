import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Grid,
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
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
  width: '100%',
  maxWidth: '500px',
});

const StyledButton = styled(Button)({
  backgroundColor: '#ffffff',
  color: '#121212',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  marginTop: '1rem',
});

const CallPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agentName, setAgentName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const url = `https://cbcc-117-228-180-199.ngrok-free.app/make-call/${phoneNumber}`;

  const handleStartCall = async () => {
    if (!phoneNumber || !agentName || !greeting || !role || !industry || !receiverName) {
      alert('All fields are required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({
          agent_name: agentName,
          greeting,
          role,
          industry,
          receiver_name: receiverName,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        navigate('/conversation', {
          state: {
            phoneNumber,
            agentName,
            greeting,
            role,
            industry,
            receiverName,
            callDetails: result,
          },
        });
      } else {
        alert(result.detail || 'Failed to start call. Please try again.');
      }
    } catch (error) {
      console.error('Error starting call:', error);
      alert('An error occurred while starting the call. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
        <StyledPaper>
          <Typography variant="h4" align="center" gutterBottom>
            Start a Call
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Fill in the details below to initiate a call.
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  InputLabelProps={{ style: { color: '#b0b0b0' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Agent Name"
                  variant="outlined"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  InputLabelProps={{ style: { color: '#b0b0b0' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Greeting Message"
                  variant="outlined"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  InputLabelProps={{ style: { color: '#b0b0b0' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role"
                  variant="outlined"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  InputLabelProps={{ style: { color: '#b0b0b0' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Industry"
                  variant="outlined"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  InputLabelProps={{ style: { color: '#b0b0b0' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Receiver Name"
                  variant="outlined"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  InputLabelProps={{ style: { color: '#b0b0b0' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  fullWidth
                  onClick={handleStartCall}
                  disabled={isLoading}
                  variant="contained"
                >
                  {isLoading ? (
                    <CircularProgress size={24} style={{ color: '#121212' }} />
                  ) : (
                    'Start Call'
                  )}
                </StyledButton>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
    </Background>
  );
};

export default CallPage;
