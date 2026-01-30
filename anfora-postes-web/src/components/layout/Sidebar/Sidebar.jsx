// src/components/layout/Sidebar/Sidebar.jsx
import React from 'react'
import './Sidebar.css'

const Sidebar = ({ currentPage, setCurrentPage, usuario }) => {
  const rol = usuario?.rol || 'CONSULTOR'

  // Definir permisos por rol
  const permisos = {
    ADMIN: {
      verInicio: true,
      verInventario: true,
      agregarInventario: true,
      verFactibilidad: true,
      agregarFactibilidad: true,
      verReportes: true,
      verImportar: true,
      verOpciones: true,
    },
    INSPECTOR: {
      verInicio: true,
      verInventario: true,
      agregarInventario: true,
      verFactibilidad: true,
      agregarFactibilidad: true,
      verReportes: true,
      verImportar: true,
      verOpciones: true,
    },
    CONSULTOR: {
      verInicio: true,
      verInventario: true,
      agregarInventario: false,
      verFactibilidad: true,
      agregarFactibilidad: false,
      verReportes: true,
      verImportar: false,
      verOpciones: false,
    }
  }

  const puede = permisos[rol] || permisos.CONSULTOR

  const handleClick = (page) => {
    setCurrentPage(page)
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {/* INICIO - Todos */}
        {puede.verInicio && (
          <button
            className={`nav-item ${currentPage === 'inicio' ? 'active' : ''}`}
            onClick={() => handleClick('inicio')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Inicio</span>
          </button>
        )}

        {/* INVENTARIO */}
        {puede.verInventario && (
          <div className="nav-section">
            <div className="nav-section-title">Inventario</div>
            
            <button
              className={`nav-item ${currentPage === 'inventario' ? 'active' : ''}`}
              onClick={() => handleClick('inventario')}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-text">Ver Registros Postes</span>
            </button>

            {puede.agregarInventario && (
              <button
                className={`nav-item ${currentPage === 'agregar' ? 'active' : ''}`}
                onClick={() => handleClick('agregar')}
              >
                <span className="nav-icon">➕</span>
                <span className="nav-text">Agregar Poste</span>
              </button>
            )}
          </div>
        )}

        {/* FACTIBILIDAD */}
        {puede.verFactibilidad && (
          <div className="nav-section">
            <div className="nav-section-title">Factibilidad</div>
            
            <button
              className={`nav-item ${currentPage === 'factibilidad' ? 'active' : ''}`}
              onClick={() => handleClick('factibilidad')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">
                {puede.agregarFactibilidad ? 'Factibilidad' : 'Ver Registros'}
              </span>
            </button>
          </div>
        )}

        {/* REPORTES - Todos pueden verlos */}
        {puede.verReportes && (
          <div className="nav-section">
            <div className="nav-section-title">Reportes</div>
          <button
            className={`nav-item ${currentPage === 'reportes' ? 'active' : ''}`}
            onClick={() => handleClick('reportes')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-text">Reportes</span>
          </button>
          </div>
        )}

        {/* IMPORTAR - Solo ADMIN e INSPECTOR */}
        {puede.verImportar && (
          <button
            className={`nav-item ${currentPage === 'importar' ? 'active' : ''}`}
            onClick={() => handleClick('importar')}
          >
            <span className="nav-icon">📥</span>
            <span className="nav-text">Importar</span>
          </button>
        )}

        {/* OPCIONES - Solo ADMIN (completo) e INSPECTOR (limitado) */}
        {puede.verOpciones && (
          <div className="nav-section">
            <div className="nav-section-title">Opciones</div>
          <button
            className={`nav-item ${currentPage === 'opciones' ? 'active' : ''}`}
            onClick={() => handleClick('opciones')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Opciones</span>
          </button>
          </div>
        )}

        {/* Indicador de rol */}
        <div className="nav-footer">
          <div className={`rol-badge rol-${rol.toLowerCase()}`}>
            {rol}
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
