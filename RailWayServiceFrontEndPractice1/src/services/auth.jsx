import { api } from './api';

export const authService = {
  login: (email, password) => 
    api.post('api/Login/login', { email, password }).then(userData => {
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }),

  register: (email, password) => 
    api.post('api/Auth/register', { Email:email, Password:password }),

  logout: () => 
    api.post('api/Login/logout').finally(() => {
      localStorage.removeItem('user');
    }),

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};