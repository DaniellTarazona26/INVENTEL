// src/components/layout/Sidebar/Sidebar.jsx
import React, { useState } from 'react'
import './Sidebar.css'

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const [openDropdown, setOpenDropdown] = useState(null)

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠', type: 'simple' },
    {
      id: 'inventario-menu',
      label: 'Inventario',
      icon: '📦',
      type: 'dropdown',
      submenu: [
        { id: 'inventario', label: 'Ver Registros' },
        { id: 'agregar', label: 'Agregar Registro' },
      ],
    },
    { id: 'factibilidad', label: 'Factibilidad', icon: '📊', type: 'simple' },
    { id: 'reportes', label: 'Reportes', icon: '📈', type: 'simple' },
    { id: 'importar', label: 'Importar', icon: '📥', type: 'simple' },
    { id: 'opciones', label: 'Opciones', icon: '⚙️', type: 'simple' },
  ]

  const handleMenuClick = (item) => {
    if (item.type === 'dropdown') {
      setOpenDropdown(openDropdown === item.id ? null : item.id)
    } else {
      setCurrentPage(item.id)
      setOpenDropdown(null)
    }
  }

  const handleSubmenuClick = (submenuId) => {
    setCurrentPage(submenuId)
    setOpenDropdown(null)
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="sidebar-item-wrapper">
            <button
              className={`sidebar-item ${
                item.type === 'simple' && currentPage === item.id ? 'active' : ''
              } ${openDropdown === item.id ? 'open' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {item.type === 'dropdown' && (
                <span className="dropdown-arrow">
                  {openDropdown === item.id ? '▼' : '▶'}
                </span>
              )}
            </button>

            {item.type === 'dropdown' && openDropdown === item.id && (
              <div className="submenu">
                {item.submenu.map((subitem) => (
                  <button
                    key={subitem.id}
                    className={`submenu-item ${
                      currentPage === subitem.id ? 'active' : ''
                    }`}
                    onClick={() => handleSubmenuClick(subitem.id)}
                  >
                    {subitem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
