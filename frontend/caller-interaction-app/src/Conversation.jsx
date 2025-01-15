import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const ConversationPage = () => {
  const location = useLocation();
  const { phoneNumber, agentName, greeting, role, industry, receiverName, callDetails, callSid: initialCallSid } = location.state || {};

  // WebSocket state
  const [messages, setMessages] = useState([]); // Finalized messages
  const [streamingText, setStreamingText] = useState(''); // Live streaming text
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [callSid, setCallSid] = useState(initialCallSid || null); // Store callSid dynamically

  useEffect(() => {
    const initiateCall = async () => {
      try {
        const response = await axios.post('/call/', {
          agentName,
          greeting,
          role,
          industry,
          receiverName,
          phoneNumber,
        });
        const { call_sid } = response.data;

        if (!call_sid) {
          console.error('Call SID not received');
          return;
        }

        setCallSid(call_sid);
        connectWebSocket(call_sid); // Initialize WebSocket with callSid
      } catch (error) {
        console.error('Error initiating call:', error);
      }
    };

    const connectWebSocket = (sid) => {
      const wsUrl = `wss://cbcc-117-228-180-199.ngrok-free.app/stream/${sid}`;
      let socket;

      const connect = () => {
        socket = new WebSocket(wsUrl);
        setConnectionStatus('Connecting...');

        socket.onopen = () => {
          setConnectionStatus('Connected');
          console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle live streaming text
            if (data.transcription) {
              setStreamingText(data.transcription);
            }

            // Handle finalized text
            if (data.finalText) {
              setMessages((prev) => [...prev, { sender: 'Agent', message: data.finalText }]);
              setStreamingText(''); // Clear streaming text when finalized text is received
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('Error');
        };

        socket.onclose = () => {
          console.log('WebSocket closed');
          setConnectionStatus('Disconnected');

          // Attempt reconnection after 5 seconds
          setTimeout(() => connect(), 5000);
        };
      };

      connect();

      // Cleanup on component unmount
      return () => {
        if (socket) {
          socket.close();
        }
      };
    };

    if (!callSid) {
      initiateCall(); // Fetch and set callSid if not already available
    } else {
      connectWebSocket(callSid); // If callSid is already available, directly connect WebSocket
    }
  }, [callSid]);

  // Styled chat bubbles
  const UserBubble = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    padding: '10px',
    borderRadius: '15px',
    margin: '10px 0',
    maxWidth: '75%',
    alignSelf: 'flex-end',
  }));

  const AgentBubble = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
    padding: '10px',
    borderRadius: '15px',
    margin: '10px 0',
    maxWidth: '75%',
    alignSelf: 'flex-start',
  }));

  // Add a manual message for the user
  const [inputMessage, setInputMessage] = useState('');
  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    setMessages((prev) => [...prev, { sender: 'User', message: inputMessage }]);
    setInputMessage('');
  };

  return (
    <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" gutterBottom>
        Conversation
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="body1"><strong>Agent Name:</strong> {agentName}</Typography>
        <Typography variant="body1"><strong>Receiver Name:</strong> {receiverName}</Typography>
        <Typography variant="body1"><strong>Phone Number:</strong> {phoneNumber}</Typography>
        <Typography variant="body1"><strong>Greeting:</strong> {greeting}</Typography>
        <Typography variant="body1"><strong>Role:</strong> {role}</Typography>
        <Typography variant="body1"><strong>Industry:</strong> {industry}</Typography>
      </Box>
      <Typography variant="h5" gutterBottom>
        Call Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, maxHeight: 200, overflow: 'auto' }}>
        <pre>{JSON.stringify(callDetails, null, 2)}</pre>
      </Paper>
      <Typography variant="h5" gutterBottom>
        Conversation Stream
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          padding: 2,
          maxHeight: 400,
          overflowY: 'auto',
        }}
      >
        {messages.map((msg, index) => (
          msg.sender === 'User' ? (
            <UserBubble key={index}>
              <Typography variant="body1">{msg.message}</Typography>
            </UserBubble>
          ) : (
            <AgentBubble key={index}>
              <Typography variant="body1">{msg.message}</Typography>
            </AgentBubble>
          )
        ))}
        {streamingText && (
          <AgentBubble>
            <Typography variant="body1">{streamingText}</Typography>
          </AgentBubble>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ConversationPage;
