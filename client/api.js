import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api' }); 

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchPosts = () => API.get('/posts');
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const commentOnPost = (id, comment) => API.post(`/posts/${id}/comment`, { comment });

export const login = (formData) => API.post('/users/login', formData);
export const signUp = (formData) => API.post('/users/register', formData);

export const fetchNotifications = () => API.get('/notifications');

export const fetchMessages = () => API.get('/messages');