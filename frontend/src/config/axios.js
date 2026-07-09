import axios from 'axios';
import API_URLS from './api';

const api = axios.create({
  baseURL: API_URLS.BASE,
  withCredentials: true,
  timeout: 15000,
});

export default api;
