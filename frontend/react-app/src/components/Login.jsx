import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

function Login({ backgroundImage = 'https://skrinshoter.ru/s/160925/7IxE0gwP.jpg?download=1&name=%D0%A1%D0%BA%D1%80%D0%B8%D0%BD%D1%88%D0%BE%D1%82-16-09-2025%2015:34:33.jpg' }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
              />
            </div>
            <button type="submit" className="auth-btn">
              Войти
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