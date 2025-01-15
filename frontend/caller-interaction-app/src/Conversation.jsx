import React from 'react';
import { useLocation } from 'react-router-dom';

const ConversationPage = () => {
  const location = useLocation();
  const {
    phoneNumber,
    agentName,
    greeting,
    role,
    industry,
    receiverName,
    callDetails,
  } = location.state || {};

  return (
    <div>
      <h2>Conversation</h2>
      <p><strong>Agent Name:</strong> {agentName}</p>
      <p><strong>Receiver Name:</strong> {receiverName}</p>
      <p><strong>Phone Number:</strong> {phoneNumber}</p>
      <p><strong>Greeting:</strong> {greeting}</p>
      <p><strong>Role:</strong> {role}</p>
      <p><strong>Industry:</strong> {industry}</p>
      <h3>Call Details</h3>
      <pre>{JSON.stringify(callDetails, null, 2)}</pre>
      <h3>Conversation Stream</h3>
      <p>Here you can implement real-time conversation rendering, such as messages or transcripts.</p>
    </div>
  );
};

export default ConversationPage;