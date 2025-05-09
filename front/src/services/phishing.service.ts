import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8000/api/phishing/';

class PhishingService {
  sendPhishingAttempt(email: string) {
    return axios.post(API_URL + 'send', { email }, { headers: authHeader() });
  }

  getAllPhishingAttempts() {
    return axios.get(API_URL + 'attempts', { headers: authHeader() });
  }
}

export default new PhishingService(); 
