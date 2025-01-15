import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CallPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agentName, setAgentName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const url = `https://61ea-2401-4900-5020-7597-fdb1-9ba1-6cc7-9f67.ngrok-free.app/make-call/${phoneNumber}`

  const handleStartCall = async () => {
    // Input validation
    if (!phoneNumber || !agentName || !greeting || !role || !industry || !receiverName) {
      alert("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch( url,
        {
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
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Redirect to the conversation page with necessary data
        navigate('/conversation', {
          state: {
            phoneNumber,
            agentName,
            greeting,
            role,
            industry,
            receiverName,
            callDetails: result, // Pass any additional details returned from the backend
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
    <div>
      <h2>Make a Call</h2>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        required
      />
      <input
        type="text"
        value={agentName}
        onChange={(e) => setAgentName(e.target.value)}
        placeholder="Agent Name"
        required
      />
      <input
        type="text"
        value={greeting}
        onChange={(e) => setGreeting(e.target.value)}
        placeholder="Greeting Message"
        required
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        required
      />
      <input
        type="text"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        placeholder="Industry"
        required
      />
      <input
        type="text"
        value={receiverName}
        onChange={(e) => setReceiverName(e.target.value)}
        placeholder="Receiver Name"
        required
      />
      <button onClick={handleStartCall} disabled={isLoading}>
        {isLoading ? 'Starting Call...' : 'Start Call'}
      </button>
    </div>
  );
};

export default CallPage;
