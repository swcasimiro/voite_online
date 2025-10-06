// src/components/Candidates.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthNavigation from './AuthNavigation';
import './Candidates.css';

const Candidates = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка кандидатов из API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/candidate/v1.0.0/candidates/');
        
        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Загруженные кандидаты:', data); // Для отладки
        setCandidates(data);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка загрузки кандидатов:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCandidates();
    }
  }, [isAuthenticated]);

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

  // Показываем лоадер загрузки данных
  if (loading) {
    return (
      <div className="app">
        <AuthNavigation />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка кандидатов...</p>
        </div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="app">
        <AuthNavigation />
        <div className="error-container">
          <h2>Ошибка загрузки данных</h2>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Если нет кандидатов
  if (!candidates || candidates.length === 0) {
    return (
      <div className="app">
        <AuthNavigation />
        <div className="candidates-container">
          <div className="candidates-content">
            <div className="empty-state">
              <h2>Кандидаты не найдены</h2>
              <p>На данный момент нет активных кандидатов.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="candidates-count">
              Всего кандидатов: <strong>{candidates.length}</strong>
            </div>
          </div>

          <div className="candidates-grid">
            {candidates.map(candidate => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-image">
                  <img 
                    src={candidate.photo} 
                    alt={candidate.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300/cccccc/969696?text=No+Photo';
                    }}
                  />
                  <div className="candidate-overlay">
                    <div className="candidate-badge">
                      #{candidate.id}
                    </div>
                  </div>
                </div>
                
                <div className="candidate-info">
                  <h3 className="candidate-name">{candidate.name}</h3>
                  
                  <div className="candidate-party">
                    <span className="party-name">{candidate.party}</span>
                  </div>
                  
                  <p className="candidate-description">
                    {candidate.description}
                  </p>
                  
                  <div className="candidate-actions">
                    {candidate.party_website && (
                    <button 
                      className="candidate-btn primary"
                      onClick={() => window.open(candidate.party_website, '_blank')}
                    >
                        Сайт партии
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidates;