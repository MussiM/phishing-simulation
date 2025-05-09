import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import NavigationBar from './components/NavigationBar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PhishingSimulation from './components/phishing/PhishingSimulation';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/phishing" 
              element={
                <PrivateRoute>
                  <PhishingSimulation />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
