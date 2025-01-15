import React, { useState, useEffect, useRef } from 'react';

const Conversation = () => {
  const [transcription, setTranscription] = useState(""); // Full transcription
  const [streamingText, setStreamingText] = useState(""); // Current real-time text chunk
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    const connectWebSocket = () => {
      socketRef.current = new WebSocket("ws://localhost:8000/stream"); // Update with your backend WebSocket URL

      setConnectionStatus("Connecting...");

      // On successful connection
      socketRef.current.onopen = () => {
        setConnectionStatus("Connected");
        console.log("WebSocket connected");
      };

      // On receiving a message
      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Append to transcription and show the latest streaming text
          if (data.transcription) {
            setStreamingText(data.transcription);
          }

          if (data.finalText) {
            setTranscription((prev) => prev + " " + data.finalText);
            setStreamingText(""); // Clear streaming text when final text is received
          }
        } catch (err) {
          console.error("Error parsing WebSocket message", err);
        }
      };

      // On connection error
      socketRef.current.onerror = (error) => {
        console.error("WebSocket error", error);
        setConnectionStatus("Error");
      };

      // On connection close
      socketRef.current.onclose = () => {
        console.log("WebSocket closed");
        setConnectionStatus("Disconnected");

        // Attempt reconnection after 5 seconds
        setTimeout(() => connectWebSocket(), 5000);
      };
    };

    connectWebSocket();

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Real-Time Transcription</h1>

      <p><strong>Status:</strong> {connectionStatus}</p>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "20px",
          height: "200px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        <p style={{ color: "#888" }}>{streamingText}</p>
        <p>{transcription}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setTranscription("")}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Clear Transcription
        </button>
      </div>
    </div>
  );
};

export default Conversation;