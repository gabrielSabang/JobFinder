// API configuration
/* global __API_BASE_URL__ */
const API_BASE_URL = __API_BASE_URL__ || 'http://localhost:8000';

export const API_URLS = {
  BASE: API_BASE_URL,
  USERS: `${API_BASE_URL}/api/users`,
  POSTS: `${API_BASE_URL}/api/posts`,
  COMMENTS: `${API_BASE_URL}/api/comments`,
  MESSAGES: `${API_BASE_URL}/api/messages`,
};

export default API_URLS;