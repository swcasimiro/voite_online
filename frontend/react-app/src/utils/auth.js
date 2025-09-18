// src/utils/auth.js

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await fetch('http://127.0.0.1:8000/api/users/v1.0.0/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return data.access;
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    logout();
    throw error;
  }
};

export const authFetch = async (url, options = {}) => {
  let accessToken = getAccessToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, config);

  // Если токен истек, пытаемся обновить его
  if (response.status === 401 && accessToken) {
    try {
      accessToken = await refreshToken();
      config.headers.Authorization = `Bearer ${accessToken}`;
      response = await fetch(url, config);
    } catch (error) {
      throw error;
    }
  }

  return response;
};