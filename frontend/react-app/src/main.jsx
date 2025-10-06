import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Candidates from './components/Candidates.jsx' 
import Verification from './components/Verification';
import Vote from './components/Vote.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidates" element={<Candidates />} /> 
        <Route path="/verification" element={<Verification />} />
        <Route path="/elections" element={<Vote />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)