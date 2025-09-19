import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Candidates from './components/Candidates.jsx' // Добавляем импорт
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidates" element={<Candidates />} /> {/* Добавляем маршрут */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)