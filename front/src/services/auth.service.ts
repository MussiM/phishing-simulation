import axios from 'axios';

class AuthService {
  login(email: string, password: string) {
    return axios
      .post(`${process.env.REACT_APP_API_URL || ''}auth/login`, {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(name: string, email: string, password: string) {
    return axios.post(`${process.env.REACT_APP_API_URL || ''}users/register`, {
      name,
      email,
      password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
}

export default new AuthService();
