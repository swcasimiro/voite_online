// src/components/AuthNavigation.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const AuthNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Получаем данные пользователя из localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = userData.name || 'Пользователь'; // Используем поле name
  

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      {/* Navigation для авторизованных */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/">
              <img src="https://gov.gta.world/ext/planetstyles/flightdeck/store/City%20of%20los%20santos.png" alt="Логотип" className="logo" />
            </Link>
            
            <div className="nav-links">
              <Link to="/elections" onClick={closeMobileMenu}>Выборы</Link>
              <Link to="/candidates" onClick={closeMobileMenu}>Кандидаты</Link>
              <Link to="/profile" onClick={closeMobileMenu}>Профиль</Link>
            </div>
          </div>

          <div className="nav-buttons">
            {/* Вместо кнопки выхода показываем имя пользователя */}
            <span className="user-welcome">
              Добро пожаловать, <strong>{userName}</strong>
            </span>
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

      {/* Mobile Menu для авторизованных */}
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

        {/* Блок с приветствием в мобильном меню */}
        <div className="mobile-user-info">
          <p>Добро пожаловать,</p>
          <strong>{userName}</strong>
        </div>

        <nav className="mobile-nav-links">
          <Link to="/elections" onClick={closeMobileMenu}>
            Выборы
          </Link>
          <Link to="/candidates" onClick={closeMobileMenu}>
            Кандидаты
          </Link>
          <Link to="/profile" onClick={closeMobileMenu}>
            Профиль
          </Link>
        </nav>

        <div style={{marginTop: '2rem', padding: '1rem', background: 'var(--gray-light)', borderRadius: '0.75rem'}}>
          <p style={{fontSize: '0.9rem', color: 'var(--gray)', textAlign: 'center'}}>
            Современная платформа для честных выборов
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthNavigation;