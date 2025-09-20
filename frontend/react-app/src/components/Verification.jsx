// src/components/Verification.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthNavigation from './AuthNavigation';
import './Verification.css';

const Verification = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageStatus, setImageStatus] = useState({
    has_image_pass: false,
    has_image_stats: false
  });
  const [uploadStatus, setUploadStatus] = useState({
    image_pass: null,
    image_stats: null
  });
  const [formData, setFormData] = useState({
    image_pass: null,
    image_stats: null
  });

  // Функция для обновления токена
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      logout();
      navigate('/login');
      return null;
    }
  };

  // Функция для выполнения запросов с автоматическим обновлением токена
  const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('access_token');
    
    const config = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    };

    let response = await fetch(url, config);

    // Если токен просрочен, пытаемся обновить
    if (response.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, config);
      }
    }

    return response;
  };

  // Перенаправляем если не авторизован
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Загружаем статус изображений
  useEffect(() => {
    if (isAuthenticated) {
      fetchImageStatus();
    }
  }, [isAuthenticated]);

  const fetchImageStatus = async () => {
    try {
      const response = await fetchWithAuth('http://127.0.0.1:8000/api/users/v1.0.0/me/profile/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setImageStatus({
          has_image_pass: !!data.image_pass,
          has_image_stats: !!data.image_stats
        });
      } else if (response.status === 401) {
        console.error('Токен недействителен после обновления');
        logout();
        navigate('/login');
      }
    } catch (error) {
      console.error('Ошибка загрузки статуса:', error);
    }
  };

  const handleFileChange = (fieldName) => (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер: 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));

      setUploadStatus(prev => ({ ...prev, [fieldName]: 'selected' }));
      event.target.value = '';
    }
  };

  const uploadSingleImage = async (fieldName, file) => {
    if (!file) return false;

    const uploadFormData = new FormData();
    uploadFormData.append('image_file', file);  // Теперь поле всегда image_file
    uploadFormData.append('image_type', fieldName);

    try {
      const response = await fetchWithAuth('http://127.0.0.1:8000/api/users/v1.0.0/me/upload-image/', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        return true;
      } else {
        const errorText = await response.text();
        let errorMessage = `Ошибка загрузки ${fieldName}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.image_file || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        alert(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      alert(`Ошибка сети при загрузке ${fieldName}`);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image_pass || !formData.image_stats) {
      alert('Пожалуйста, загрузите оба изображения');
      return;
    }

    setLoading(true);
    setUploadStatus({ image_pass: 'uploading', image_stats: 'uploading' });

    try {
      const passSuccess = await uploadSingleImage('image_pass', formData.image_pass);
      const statsSuccess = await uploadSingleImage('image_stats', formData.image_stats);

      if (passSuccess && statsSuccess) {
        setUploadStatus({ image_pass: 'success', image_stats: 'success' });
        await fetchImageStatus();
        setTimeout(() => {
          setUploadStatus({ image_pass: null, image_stats: null });
          setFormData({ image_pass: null, image_stats: null });
        }, 3000);
        alert('Оба файла успешно загружены!');
      } else {
        setUploadStatus({ image_pass: 'error', image_stats: 'error' });
      }
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      setUploadStatus({ image_pass: 'error', image_stats: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
    setUploadStatus(prev => ({ ...prev, [fieldName]: null }));
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="app">
      <AuthNavigation />

      <div className="verification-container">
        <div className="verification-content">
          <div className="verification-header">
            <h1 className="verification-title">Верификация</h1>
            <p className="verification-subtitle">
              Для участия в голосовании необходимо загрузить оба документа для проверки
            </p>
          </div>

          <form onSubmit={handleSubmit} className="verification-form">
            <div className="verification-grid">
              {/* Карточка для фото паспорта */}
              <div className="verification-card">
                <div className="verification-image">
                  <div className="document-placeholder">
                    {imageStatus.has_image_pass ? (
                      <div className="document-uploaded">
                        <span className="success-icon">✓</span>
                        <p>Фото загружено</p>
                      </div>
                    ) : formData.image_pass ? (
                      <div className="document-preview">
                        <span className="file-icon">📄</span>
                        <p>{formData.image_pass.name}</p>
                        <button 
                          type="button" 
                          className="remove-file-btn"
                          onClick={() => removeFile('image_pass')}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="document-empty">
                        <span className="upload-icon">📷</span>
                        <p>Фото паспорта</p>
                      </div>
                    )}
                  </div>
                  <div className="verification-overlay">
                    <div className="verification-badge">
                      Обязательно
                    </div>
                  </div>
                </div>
                
                <div className="verification-info">
                  <h3 className="verification-name">Паспортный документ</h3>
                  
                  <p className="verification-description">
                    Загрузите четкое фото разворота паспорта с вашими данными
                  </p>
                  
                  <div className="verification-actions">
                    <label className={`verification-btn ${formData.image_pass ? 'secondary' : 'primary'} ${imageStatus.has_image_pass ? 'disabled' : ''}`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange('image_pass')}
                        disabled={imageStatus.has_image_pass || loading}
                        style={{ display: 'none' }}
                      />
                      {formData.image_pass ? 'Изменить файл' : 'Выбрать файл'}
                    </label>
                  </div>

                  {uploadStatus.image_pass === 'success' && (
                    <div className="upload-status success">
                      Фото успешно загружено!
                    </div>
                  )}
                </div>
              </div>

              {/* Карточка для статистики */}
              <div className="verification-card">
                <div className="verification-image">
                  <div className="document-placeholder">
                    {imageStatus.has_image_stats ? (
                      <div className="document-uploaded">
                        <span className="success-icon">✓</span>
                        <p>Данные загружены</p>
                      </div>
                    ) : formData.image_stats ? (
                      <div className="document-preview">
                        <span className="file-icon">📄</span>
                        <p>{formData.image_stats.name}</p>
                        <button 
                          type="button" 
                          className="remove-file-btn"
                          onClick={() => removeFile('image_stats')}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="document-empty">
                        <span className="upload-icon">📊</span>
                        <p>Статистика</p>
                      </div>
                    )}
                  </div>
                  <div className="verification-overlay">
                    <div className="verification-badge">
                      Обязательно
                    </div>
                  </div>
                </div>
                
                <div className="verification-info">
                  <h3 className="verification-name">Статистические данные</h3>
                  
                  <p className="verification-description">
                    Загрузите файл с дополнительной информацией для верификации
                  </p>
                  
                  <div className="verification-actions">
                    <label className={`verification-btn ${formData.image_stats ? 'secondary' : 'primary'} ${imageStatus.has_image_stats ? 'disabled' : ''}`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange('image_stats')}
                        disabled={imageStatus.has_image_stats || loading}
                        style={{ display: 'none' }}
                      />
                      {formData.image_stats ? 'Изменить файл' : 'Выбрать файл'}
                    </label>
                  </div>

                  {uploadStatus.image_stats === 'success' && (
                    <div className="upload-status success">
                      Данные успешно загружены!
                    </div>
                  )}
                </div>
              </div>

              {/* Карточка статуса и кнопка отправки */}
              <div className="verification-card status-card">
                <div className="verification-info">
                  <h3 className="verification-name">Статус верификации</h3>
                  
                  <div className="status-indicator">
                    <div className={`status-dot ${imageStatus.has_image_pass && imageStatus.has_image_stats ? 'verified' : 'pending'}`}></div>
                    <span>
                      {imageStatus.has_image_pass && imageStatus.has_image_stats 
                        ? 'Верификация пройдена' 
                        : 'Верификация не завершена'
                      }
                    </span>
                  </div>
                  
                  <div className="requirements-list">
                    <div className={`requirement-item ${imageStatus.has_image_pass ? 'completed' : ''}`}>
                      <span className="requirement-check">
                        {imageStatus.has_image_pass ? '✓' : '•'}
                      </span>
                      Фото паспорта загружено
                    </div>
                    <div className={`requirement-item ${imageStatus.has_image_stats ? 'completed' : ''}`}>
                      <span className="requirement-check">
                        {imageStatus.has_image_stats ? '✓' : '•'}
                      </span>
                      Статистика загружена
                    </div>
                  </div>

                  {!imageStatus.has_image_pass || !imageStatus.has_image_stats ? (
                    <div className="submit-section">
                      <button 
                        type="submit" 
                        className={`verification-btn primary submit-btn ${loading ? 'loading' : ''}`}
                        disabled={!formData.image_pass || !formData.image_stats || loading}
                      >
                        {loading ? 'Загрузка...' : 'Отправить на проверку'}
                      </button>
                      
                      {(!formData.image_pass || !formData.image_stats) && (
                        <p className="submit-note">
                          Загрузите оба файла для отправки
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="verification-note">
                      Документы отправлены на проверку модератором
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verification;