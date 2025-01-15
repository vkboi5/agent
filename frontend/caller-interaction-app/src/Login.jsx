import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            'Authorization': `Bearer ${data.access_token}`,
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
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
