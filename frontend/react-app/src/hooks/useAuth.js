import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading };
};