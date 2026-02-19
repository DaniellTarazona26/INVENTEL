// src/components/layout/Header/Header.jsx
import React from 'react'
import './Header.css'

const Header = ({ onLogout, usuario }) => {
  const nombreUsuario = usuario?.nombre || 'Usuario'

  return (
    <header className="header">
      <div className="header-left">
        <h1>INVENTEL</h1>
        <span className="header-subtitle">Sistema de Gestión de Inventario</span>
      </div>
      <div className="header-right">
        <div className="user-info">
          <span className="user-icon">👤</span>
          <span className="user-name">{nombreUsuario.toUpperCase()}</span>
        </div>
        {onLogout && (
          <button className="btn-logout" onClick={onLogout} title="Cerrar Sesión">
            <span className="logout-text">Cerrar Sesión</span>
          </button>
        )}
      </div>
    </header>
  )
}

export default Header

