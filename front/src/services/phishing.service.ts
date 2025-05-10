import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL || '';

class PhishingService {
  sendPhishingAttempt(email: string) {
    return axios.post(API_URL + 'phishing-attempt', { recipient: email }, { headers: authHeader() });
  }

  getPhishingAttempts() {
    return axios.get(API_URL + 'phishing-attempt', { headers: authHeader() });
  }

  getAllPhishingAttempts() {
    return axios.get(API_URL + 'attempts', { headers: authHeader() });
  }

  updatePhishingAttempt(emailId: string) {
    if (!emailId) {
      return;
    }
    return axios.post(API_URL + `phishing-attempt/${emailId}/clicked`);
  }
}

export default new PhishingService(); 
