import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
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
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">Привет, {user?.name}</span>
              <button onClick={handleLogout} className="nav-btn logout-btn">
                Выйти
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-btn login-btn">Войти</Link>
              <Link to="/register" className="nav-btn register-btn">Регистрация</Link>
            </>
          )}
        </div>

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
          <a href="#about" onClick={closeMobileMenu}>Выборы</a>
          <a href="#about" onClick={closeMobileMenu}>Кандидаты</a>
          <a href="#features" onClick={closeMobileMenu}>Преимущества</a>
          <a href="#process" onClick={closeMobileMenu}>Процесс</a>
          <a href="#contact" onClick={closeMobileMenu}>Контакты</a>
        </nav>

        <div className="mobile-menu-buttons">
          {isAuthenticated ? (
            <div className="mobile-user-menu">
              <div className="mobile-user-info">
                <span className="user-name">Привет, {user?.name}</span>
              </div>
              <button onClick={handleLogout} className="nav-btn logout-btn">
                Выйти
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-btn login-btn" onClick={closeMobileMenu}>
                Войти
              </Link>
              <Link to="/register" className="nav-btn register-btn" onClick={closeMobileMenu}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;