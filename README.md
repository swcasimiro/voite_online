# 🗳️ Система Онлайн-Голосования

Современная платформа для проведения безопасных и прозрачных онлайн-выборов с верификацией пользователей.

<a href="#"><img src="https://skillicons.dev/icons?i=python,django,redis,javascript,react,vite,postgresql,docker" alt="Core technologies" /></a>

![Скриншот системы](https://www.upload.ee/image/18615969/index.jpg)

## ✨ Особенности

- 🔐 **Безопасная аутентификация** по email с кастомной валидацией
- 🗳️ **Система голосования** с проверкой прав доступа
- 📊 **Реальная статистика** в режиме реального времени
- 🎨 **Современный интерфейс** на React с анимациями
- 📱 **Адаптивный дизайн** для всех устройств
- 🐳 **Docker-контейнеризация** для простого развертывания
- 🎯 **Админ-панель** на django-unfold с красивым UI

| Frontend | | Backend |
|----------|-|---------|
| **🌐 Пользовательский интерфейс** | | **⚙️ Серверная часть** |
| ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) | 🠖 | ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) |
| UI библиотека, компоненты | | Основной язык программирования |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | 🠖 | ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white) |
| Сборка и разработка | | Веб-фреймворк |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) | 🠖 | ![DRF](https://img.shields.io/badge/DRF-9C1A1C?style=for-the-badge&logo=django&logoColor=white) |
| Маршрутизация SPA | | REST API |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | 🠖 | ![Django Unfold](https://img.shields.io/badge/Unfold-6B46C1?style=for-the-badge) |
| Стилизация, анимации | | Современная админ-панель |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | 🠖 | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) |
| Логика приложения | | База данных |
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) | 🠖 | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) |
| Семантическая верстка | | Контейнеризация |
## 🚀 Быстрый старт

### Предварительные требования
- Установленный [Docker](https://www.docker.com/)
- Установленный [GIT](https://git-scm.com/downloads)

### Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/swcasimiro/voite_online.git
cd voite_online
```

### 2. Создание .env файла.
```bash
voite_online/
├── backend/                 
├── frontend/               
├── docker-compose.yml      
├── .env                    #  <-- Переменные окружения, которое нужно создать.
├── pyproject.toml        
└── README.md

# Пример содержимого .env (соблюдайте синтаксис)
SECRET_KEY=your_secret_key_for_django_app
```

<strong><a href="https://django-secret-key-generator.netlify.app/">Генерация ключей для Django</a></strong>

### 3. Сборка и запуск проекта
```bash
docker-compose up -d --build
```

### Приложение будет доступно по адресам:

🌐 Frontend (React): http://localhost:5173

⚙️ Backend (Django): http://localhost:8000

🔧 Админка Django: http://localhost:8000/admin

### 4. Создание пользователя с правами администратора
```bash
docker-compose exec backend python manage.py createsuperuser
```
