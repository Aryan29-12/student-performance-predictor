import axios from 'axios';

// Utility to read cookies by name
export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Axios instance configured for Django Session & CSRF
const apiClient = axios.create({
  baseURL: '', // Relative paths proxied by Vite
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor to attach X-CSRFToken header on mutation requests
apiClient.interceptors.request.use(
  (config) => {
    const method = (config.method || '').toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to extract clean error messages from DRF
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred.';
    let fieldErrors = null;

    if (error.response) {
      const data = error.response.data;
      if (data) {
        if (typeof data === 'string') {
          message = data;
        } else if (data.detail) {
          message = data.detail;
        } else if (typeof data === 'object') {
          fieldErrors = data;
          const firstKey = Object.keys(data)[0];
          const firstVal = data[firstKey];
          if (Array.isArray(firstVal)) {
            message = `${firstKey}: ${firstVal[0]}`;
          } else if (typeof firstVal === 'string') {
            message = `${firstKey}: ${firstVal}`;
          }
        }
      }
    } else if (error.request) {
      message = 'Unable to reach backend server. Please verify Django is running.';
    }

    const enhancedError = new Error(message);
    enhancedError.status = error.response ? error.response.status : null;
    enhancedError.fieldErrors = fieldErrors;
    enhancedError.original = error;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;

