// src/components/Candidates.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthNavigation from './AuthNavigation';
import './Candidates.css';

const Candidates = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Перенаправляем если не авторизован
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Показываем лоадер пока проверяем авторизацию
  if (authLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  // Не рендерим если не авторизованы
  if (!isAuthenticated) {
    return null;
  }

  // Данные кандидатов (пока статические)
  const candidates = [
    {
      id: 1,
      name: "Майкл Де Санта",
      photo: "https://i.imgur.com/5Q8w2Wj.jpeg",
      description: "Бывший градоначальник Лос-Сантоса с опытом работы в правоохранительных органах. Выступает за усиление безопасности и борьбу с коррупцией.",
      party: "Партия Порядка",
      partyLink: "#"
    },
    {
      id: 2,
      name: "Франклин Клинтон",
      photo: "https://i.imgur.com/3Q6q0Y2.jpeg",
      description: "Молодой и перспективный политик, представитель нового поколения. Фокусируется на экономическом развитии и создании рабочих мест.",
      party: "Партия Развития",
      partyLink: "#"
    },
    {
      id: 3,
      name: "Тревор Филлипс",
      photo: "https://i.imgur.com/7X4q0Z1.jpeg",
      description: "Независимый кандидат с радикальными взглядами на реформы. Выступает за кардинальные изменения в системе управления.",
      party: "Независимый кандидат",
      partyLink: "#"
    }
  ];

  return (
    <div className="app">
      <AuthNavigation />

      <div className="candidates-container">
        <div className="candidates-content">
          <div className="candidates-header">
            <h1 className="candidates-title">Кандидаты на выборах</h1>
            <p className="candidates-subtitle">
              Ознакомьтесь с информацией о кандидатах. Выберите того, кто представляет ваши интересы.
            </p>
          </div>

          <div className="candidates-grid">
            {candidates.map(candidate => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-image">
                  <img src={candidate.photo} alt={candidate.name} />
                  <div className="candidate-overlay">
                    <div className="candidate-badge">
                      Кандидат #{candidate.id}
                    </div>
                  </div>
                </div>
                
                <div className="candidate-info">
                  <h3 className="candidate-name">{candidate.name}</h3>
                  
                  <div className="candidate-party">
                    <span>Партия: </span>
                    <a 
                      href={candidate.partyLink} 
                      className="party-link"
                      onClick={(e) => e.preventDefault()} // Временная заглушка
                    >
                      {candidate.party}
                    </a>
                  </div>
                  
                  <p className="candidate-description">{candidate.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div> {/* Закрывающий тег для candidates-content */}
      </div> {/* Закрывающий тег для candidates-container */}
    </div>
  );
};

export default Candidates;