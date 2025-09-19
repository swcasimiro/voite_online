import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthNavigation from './components/AuthNavigation';
import Navigation from './components/Navigation'; // Импортируем обычную навигацию
import './App.css';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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

  // Показываем лоадер пока проверяем авторизацию
  if (authLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Условный рендеринг навигации */}
      {isAuthenticated ? (
        <AuthNavigation />
      ) : (
        <Navigation 
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          closeMobileMenu={closeMobileMenu}
        />
      )}

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