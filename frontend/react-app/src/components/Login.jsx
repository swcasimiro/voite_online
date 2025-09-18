import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function Login({ backgroundImage = 'https://skrinshoter.ru/s/160925/7IxE0gwP.jpg?download=1&name=%D0%A1%D0%BA%D1%80%D0%B8%D0%BD%D1%88%D0%BE%D1%82-16-09-2025%2015:34:33.jpg' }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        window.location.reload(); // Обновляем страницу для применения авторизации
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
    setError(''); // Очищаем ошибку при изменении поля
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="app-wrapper">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/">
              <img src="https://gov.gta.world/ext/planetstyles/flightdeck/store/City%20of%20los%20santos.png" alt="Логотип" className="logo" />
            </Link>
            
            <div className="nav-links">
              <a href="#about" onClick={closeMobileMenu}>Выборы</a>
              <a href="#about" onClick={closeMobileMenu}>Кандидаты</a>
              <a href="#features" onClick={closeMobileMenu}>Преимущества</a>
              <a href="#process" onClick={closeMobileMenu}>Процесс</a>
              <a href="#contact" onClick={closeMobileMenu}>Контакты</a>
            </div>
          </div>

          <div className="nav-buttons">
            <Link to="/login" className="nav-btn login-btn">Войти</Link>
            <Link to="/register" className="nav-btn register-btn">Регистрация</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Открыть меню"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <img 
            src="https://gov.gta.world/ext/planetstyles/flightdeck/store/City%20of%20los%20santos.png" 
            alt="Логотип" 
            className="logo"
            style={{width: '50px', height: '50px'}}
          />
          <button 
            className="mobile-menu-close"
            onClick={closeMobileMenu}
            aria-label="Закрыть меню"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-nav-links">
          <a href="#about" onClick={closeMobileMenu}>
            Выборы
          </a>
          <a href="#about" onClick={closeMobileMenu}>
            Кандидаты
          </a>
          <a href="#features" onClick={closeMobileMenu}>
            Преимущества
          </a>
          <a href="#process" onClick={closeMobileMenu}>
            Процесс
          </a>
          <a href="#contact" onClick={closeMobileMenu}>
            Контакты
          </a>
        </nav>

        <div className="mobile-menu-buttons">
          <Link to="/login" className="nav-btn login-btn" onClick={closeMobileMenu}>
            Войти
          </Link>
          <Link to="/register" className="nav-btn register-btn" onClick={closeMobileMenu}>
            Регистрация
          </Link>
        </div>

        <div style={{marginTop: '2rem', padding: '1rem', background: 'var(--gray-light)', borderRadius: '0.75rem'}}>
          <p style={{fontSize: '0.9rem', color: 'var(--gray)', textAlign: 'center'}}>
            Современная платформа для честных выборов
          </p>
        </div>
      </div>

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