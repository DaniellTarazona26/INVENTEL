// src/pages/Login/Login.jsx
import React, { useState } from 'react'
import authService from '../../services/authService'
import './Login.css'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [recordar, setRecordar] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const respuesta = await authService.login(formData.email, formData.password)
      
      console.log('✅ Login exitoso:', respuesta.usuario)
      
      // Llamar al callback de App.jsx
      onLogin(respuesta.usuario)
      
    } catch (error) {
      console.error('❌ Error en login:', error)
      setError(error || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo ESSA */}
        <div className="login-header">
          <div className="logo-essa">
            <span className="logo-text">ESSA</span>
          </div>
        </div>

        {/* Título del sistema */}
        <div className="login-title">
          <h1>INVENTEL</h1>
          <p className="login-subtitle">Sistema de Gestión de Inventario</p>
        </div>

        {/* Formulario de login */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Iniciar Sesión</h2>

          {error && (
            <div className="error-message">
              <span className="error-icon-text">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon-text">👤</span>
              <input
                type="email"
                id="email"
                placeholder="Ingrese su email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                autoComplete="username"
                disabled={cargando}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon-text">🔒</span>
              <input
                type={mostrarContrasena ? 'text' : 'password'}
                id="password"
                placeholder="Ingrese su contraseña"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                autoComplete="current-password"
                disabled={cargando}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                tabIndex={-1}
                disabled={cargando}
              >
                {mostrarContrasena ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                disabled={cargando}
              />
              <span>Recordarme</span>
            </label>
            <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
              ¿Olvidó su contraseña?
            </a>
          </div>

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? 'INICIANDO...' : 'INGRESAR'}
          </button>

          <div className="login-footer-links">
            <a href="#" onClick={(e) => e.preventDefault()}>
              Ayuda
            </a>
          </div>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>&copy; 2026 INVENTEL - Sistema de Gestión de Inventario</p>
          <p className="footer-version">Versión 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default Login
