import React, { useState } from 'react';
import axios from 'axios';

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
      const response = await axios.post('https://61ea-2401-4900-5020-7597-fdb1-9ba1-6cc7-9f67.ngrok-free.app/register', {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      setErrorMessage('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Register;