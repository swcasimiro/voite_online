import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    const handleScrollCloseMenu = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollCloseMenu);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollCloseMenu);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="app">
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
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="mobile-nav-links">
          <a href="#about" onClick={closeMobileMenu}>
            <i className="fas fa-vote-yea"></i> Выборы
          </a>
          <a href="#about" onClick={closeMobileMenu}>
            <i className="fas fa-users"></i> Кандидаты
          </a>
          <a href="#features" onClick={closeMobileMenu}>
            <i className="fas fa-star"></i> Преимущества
          </a>
          <a href="#process" onClick={closeMobileMenu}>
            <i className="fas fa-cogs"></i> Процесс
          </a>
          <a href="#contact" onClick={closeMobileMenu}>
            <i className="fas fa-phone"></i> Контакты
          </a>
        </nav>

        <div className="mobile-menu-buttons">
          <Link to="/login" className="nav-btn login-btn" onClick={closeMobileMenu}>
            <i className="fas fa-sign-in-alt"></i> Войти
          </Link>
          <Link to="/register" className="nav-btn register-btn" onClick={closeMobileMenu}>
            <i className="fas fa-user-plus"></i> Регистрация
          </Link>
        </div>

        <div style={{marginTop: '2rem', padding: '1rem', background: 'var(--gray-light)', borderRadius: '0.75rem'}}>
          <p style={{fontSize: '0.9rem', color: 'var(--gray)', textAlign: 'center'}}>
            Современная платформа для честных выборов
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <header className={`hero ${isVisible ? 'visible' : ''}`}>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Современная система</span>
              <br />онлайн-голосования
            </h1>
            <p className="hero-subtitle">
              Первая полностью прозрачная платформа с верификацией и биометрической защитой. Платформа
              обеспечивает защиту от внешних угроз. Голосуя с помощью нас, вы можете быть уверены, что
              голосование пройдет - чисто. Все результаты будут опубликованы на этом же сайте. Все 
              конфидициальные данные будут скрыты.            
            </p>
            <div className="hero-buttons">
              <button className="hero-btn primary">
                <i className="fas fa-play"></i>
                Начать голосование
              </button>
              <button className="hero-btn secondary">
                <i className="fas fa-info"></i>
                Узнать больше
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-wrapper">
              <img 
                src="https://i.playground.ru/i/pix/26413/image.jpg" 
                alt="Система голосования" 
                className="hero-img"
              />
              <div className="image-overlay">
                <div className="badge">
                  <i className="fas fa-shield-alt"></i>
                  <span>100% защита</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Process Section */}
      <section id="process" className="process">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Как это работает?</h2>
            <p className="section-subtitle">Простой и безопасный процесс голосования</p>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">01</div>
              <h3>Регистрация</h3>
              <p>Зарегистрируйтесь с помощью официальных документов и пройдите верификацию</p>
            </div>
            <div className="process-step">
              <div className="step-number">02</div>
              <h3>Подтверждение</h3>
              <p>Подтвердите личность через биометрические данные и двухфакторную аутентификацию</p>
            </div>
            <div className="process-step">
              <div className="step-number">03</div>
              <h3>Голосование</h3>
              <p>Выберите кандидата и подтвердите свой выбор. Голос сразу шифруется</p>
            </div>
            <div className="process-step">
              <div className="step-number">04</div>
              <h3>Результаты</h3>
              <p>Наблюдайте за результатами в реальном времени после окончания выборов</p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <img src="https://gov.gta.world/ext/planetstyles/flightdeck/store/City%20of%20los%20santos.png" alt="Логотип" className="footer-logo" />
                <img src="https://i.imgur.com/A2lSHlV.png" alt="Логотип" className="footer-logo" />
              </div>
              <p>Современная платформа для честных и прозрачных демократических процессов</p>
            </div>
            <div className="footer-section">
              <h4>Контакты</h4>
              <p>+1 (555) 20-4567</p>
              <a href='https://github.com/swcasimiro'>swcasimrio</a>
            </div>
            <div className="footer-section">
              <h4>Адрес</h4>
              <p> Los-Santos, st. Pershing Square, 13</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


export default App;