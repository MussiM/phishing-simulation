import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadPhishingAttempts();
  }, []);

  const loadPhishingAttempts = () => {
    setLoading(true);
    PhishingService.getAllPhishingAttempts()
      .then(response => {
        setAttempts(response.data);
        setLoading(false);
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

  const handleSendPhishingAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    PhishingService.sendPhishingAttempt(email)
      .then(response => {
        setMessage('Phishing attempt sent successfully!');
        setEmail('');
        loadPhishingAttempts(); // Refresh the list
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
          
          {message && (
            <div className="alert alert-info mt-3" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-body">
          <h4>Phishing Attempts</h4>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Recipient Email</th>
                  <th>Email Content</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {attempts.length > 0 ? (
                  attempts.map((attempt) => (
                    <tr key={attempt.id}>
                      <td>{attempt.id}</td>
                      <td>{attempt.recipientEmail}</td>
                      <td>{attempt.emailContent}</td>
                      <td>{attempt.status}</td>
                      <td>{new Date(attempt.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No phishing attempts found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhishingSimulation; 