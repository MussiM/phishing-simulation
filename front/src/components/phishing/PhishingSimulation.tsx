import React, { useState, useEffect } from 'react';
import PhishingService from '../../services/phishing.service';
import { AxiosResponse } from 'axios';

interface PhishingAttempt {
  id: string;
  recipient: string;
  deliveryStatus: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

const PhishingSimulation = () => {
  const [email, setEmail] = useState('');
  const [attempts, setAttempts] = useState<PhishingAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fetchingAttempts, setFetchingAttempts] = useState(false);

  // Fetch phishing attempts when component mounts
  useEffect(() => {
    fetchPhishingAttempts();
  }, []);

  const fetchPhishingAttempts = () => {
    setFetchingAttempts(true);
    PhishingService.getPhishingAttempts()
      .then((response: AxiosResponse<PhishingAttempt[]>) => {
        setAttempts(response.data);
        setFetchingAttempts(false);
      })
      .catch((error: any) => {
        console.error('Error fetching phishing attempts:', error);
        setFetchingAttempts(false);
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
        setLoading(false);
        // Refresh the list after sending a new email
        fetchPhishingAttempts();
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

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container">
      <h2>Phishing Simulation</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h4>Send Phishing Email</h4>
          <form onSubmit={handleSendPhishingAttempt}>
            <div className="form-group mb-3">
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
            
            {message && (
              <div className="alert alert-info mt-3">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Phishing Attempts</h4>
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={fetchPhishingAttempts}
              disabled={fetchingAttempts}
            >
              {fetchingAttempts ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {fetchingAttempts ? (
            <p>Loading attempts...</p>
          ) : attempts.length === 0 ? (
            <p>No phishing attempts found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Status</th>
                    <th>Clicks</th>
                    <th>Sent At</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map(attempt => (
                    <tr key={attempt.id}>
                      <td>{attempt.recipient}</td>
                      <td>
                        <span className={`badge ${getBadgeClass(attempt.deliveryStatus)}`}>
                          {attempt.deliveryStatus}
                        </span>
                      </td>
                      <td>{attempt.clicks || 0}</td>
                      <td>{formatDate(attempt.createdAt)}</td>
                      <td>{formatDate(attempt.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get appropriate badge color based on status
const getBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'sent':
      return 'bg-success';
    case 'clicked':
      return 'bg-warning';
    case 'failed':
      return 'bg-danger';
    case 'pending':
      return 'bg-secondary';
    default:
      return 'bg-info';
  }
};

export default PhishingSimulation; 