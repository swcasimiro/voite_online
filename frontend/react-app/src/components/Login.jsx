// src/components/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navigation from './Navigation';
import './Auth.css';

function Login({ backgroundImage = 'https://skrinshoter.ru/s/160925/7IxE0gwP.jpg?download=1&name=%D0%A1%D0%BA%D1%80%D0%B8%D0%BD%D1%88%D0%BE%D1%82-16-09-2025%2015:34:33.jpg' }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Перенаправляем если авторизован
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Показываем лоадер пока проверяем авторизацию
  if (authLoading) {
    return (
      <div className="app-wrapper">
        <Navigation />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  // Не рендерим форму если авторизованы
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/v1.0.0/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Сохраняем токены в localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Перенаправляем на главную страницу
        navigate('/');
        window.location.reload();
      } else {
        setError(data.error || data.detail || 'Ошибка авторизации');
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="app-wrapper">
      <Navigation />
      
      {/* Auth Container */}
      <div 
        className="auth-container"
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
      >
        <div className="auth-card">
          <h2>Вход в систему</h2>
          
          {error && (
            <div className="error-message" style={{
              color: '#e74c3c',
              backgroundColor: '#fde8e6',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Введите ваш email"
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Введите ваш пароль"
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              className="auth-btn"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
            
            <div className="auth-link">
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;