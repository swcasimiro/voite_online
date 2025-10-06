// src/components/Vote.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthNavigation from './AuthNavigation';
import './Vote.css';

const Vote = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVote, setUserVote] = useState(null);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем кандидатов
        const candidatesResponse = await fetch('http://127.0.0.1:8000/api/candidate/v1.0.0/candidates/');
        
        if (!candidatesResponse.ok) {
          throw new Error('Ошибка загрузки кандидатов');
        }

        const candidatesData = await candidatesResponse.json();
        setCandidates(candidatesData);

        // Проверяем статус голосования если есть токен
        if (token) {
          const statusResponse = await fetch('http://127.0.0.1:8000/api/candidate/v1.0.0/vote/status/', {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });

          if (statusResponse.ok) {
            const voteStatus = await statusResponse.json();
            setHasVoted(voteStatus.has_voted);
            
            if (voteStatus.has_voted) {
              // Загружаем детали голоса
              const voteResponse = await fetch('http://127.0.0.1:8000/api/candidate/v1.0.0/vote/', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              });

              if (voteResponse.ok) {
                const voteData = await voteResponse.json();
                setUserVote(voteData);
                const votedCandidate = candidatesData.find(c => c.id === voteData.candidate);
                setSelectedCandidate(votedCandidate);
              }
            }
          }
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  // Перенаправляем если не авторизован
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleVote = async () => {
    if (!selectedCandidate || hasVoted) {
      return;
    }

    let currentToken = token;
    if (!currentToken) {
      currentToken = localStorage.getItem('access_token');
    }

    if (!currentToken) {
      setError('Токен авторизации не найден');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const payload = { candidate: selectedCandidate.id };

      const response = await fetch('http://127.0.0.1:8000/api/candidate/v1.0.0/vote/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при голосовании');
      }

      const voteData = await response.json();
      
      setHasVoted(true);
      setUserVote(voteData);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCandidateSelect = (candidate) => {
    if (!hasVoted) {
      setSelectedCandidate(candidate);
    }
  };

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
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <AuthNavigation />

      <div className="vote-container">
        <div className="vote-content">
          <div className="vote-header">
            <h1 className="vote-title">Голосование</h1>
            
            {hasVoted ? (
              <div className="voted-message">
                <div className="voted-icon">✓</div>
                <div className="voted-content">
                  <h2>Вы уже проголосовали!</h2>
                  <p>Вы не можете изменить свой выбор или проголосовать снова.</p>
                  {userVote && (
                    <div className="voted-candidate-info">
                      Вы проголосовали за: <strong>{userVote.candidate_name}</strong>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="vote-subtitle">
                Выберите кандидата, который представляет ваши интересы. 
                После голосования изменить выбор будет невозможно.
              </p>
            )}
            
            {error && (
              <div className="error-message">
                <strong>Ошибка:</strong> {error}
              </div>
            )}
          </div>

          {showSuccess && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <div className="success-text">
                <strong>Голос принят!</strong>
                <p>Вы успешно проголосовали за {userVote?.candidate_name}</p>
              </div>
            </div>
          )}

          <div className="candidates-grid">
            {candidates.map(candidate => (
              <div 
                key={candidate.id} 
                className={`candidate-card ${selectedCandidate?.id === candidate.id ? 'selected' : ''} ${hasVoted ? 'voted' : ''} ${userVote?.candidate === candidate.id ? 'user-voted' : ''}`}
                onClick={() => handleCandidateSelect(candidate)}
              >
                <div className="candidate-image">
                  <img 
                    src={candidate.photo} 
                    alt={candidate.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x500/cccccc/969696?text=No+Photo';
                    }}
                  />
                  <div className="candidate-overlay">
                    <div className="candidate-badge">
                      #{candidate.id}
                    </div>
                    {selectedCandidate?.id === candidate.id && !hasVoted && (
                      <div className="selected-badge">
                        ✓ Выбрано
                      </div>
                    )}
                    {userVote?.candidate === candidate.id && (
                      <div className="user-voted-badge">
                        Ваш выбор
                      </div>
                    )}
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
                  
                  {!hasVoted && (
                    <div className="candidate-actions">
                      <button 
                        className={`candidate-btn ${selectedCandidate?.id === candidate.id ? 'primary' : 'secondary'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCandidateSelect(candidate);
                        }}
                      >
                        {selectedCandidate?.id === candidate.id ? 'Выбрано' : 'Выбрать'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!hasVoted && selectedCandidate && (
            <div className="vote-actions">
              <div className="selected-candidate-info">
                <strong>Выбран кандидат:</strong> {selectedCandidate.name} ({selectedCandidate.party})
              </div>
              <button 
                className="vote-submit-btn"
                onClick={handleVote}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="submit-spinner"></div>
                    Отправка...
                  </>
                ) : (
                  `Проголосовать за ${selectedCandidate.name}`
                )}
              </button>
              
              <p className="vote-note">
                ⚠️ После голосования изменить выбор будет невозможно
              </p>
            </div>
          )}

          {!hasVoted && !selectedCandidate && (
            <div className="vote-actions">
              <div className="no-selection-message">
                Выберите кандидата для голосования
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vote;