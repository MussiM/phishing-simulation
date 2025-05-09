import React, { useState } from 'react';
import PhishingService from '../../services/phishing.service';

interface PhishingAttempt {
  id: number;
  recipientEmail: string;
  emailContent: string;
  status: string;
  createdAt: string;
}

const PhishingSimulation = () => {
  const [email, setEmail] = useState('');
  const [attempts, setAttempts] = useState<PhishingAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  const handleSendPhishingAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    PhishingService.sendPhishingAttempt(email)
      .then(response => {
        setMessage('Phishing attempt sent successfully!');
        setEmail('');
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        
        setMessage(resMessage);
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <h2>Phishing Simulation</h2>
      
      <div className="card">
        <div className="card-body">
          <h4>Send Phishing Email</h4>
          <form onSubmit={handleSendPhishingAttempt}>
            <div className="form-group">
              <label htmlFor="email">Recipient Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Phishing Email'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhishingSimulation; 