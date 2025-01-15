import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import Call from './Call';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import ConversationPage from './Conversation';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/conversation" element={<ConversationPage />} />
        <Route
          path="/call"
          element={
            <PrivateRoute
              element={<Call user={user} />}
            />
          }
        />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
