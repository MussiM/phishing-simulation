import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PhishingSimulation from './components/phishing/PhishingSimulation';
import PhishingManagement from './components/PhishingManagement';

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
                  <PhishingSimulation />
              } 
            />
            <Route
              path="/phishingClicked"
              element={
                <PhishingManagement />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
