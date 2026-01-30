// src/pages/Factibilidad/Factibilidad.jsx
import React, { useState } from 'react'
import './Factibilidad.css'
import AgregarFactibilidad from './AgregarFactibilidad'
import VerRegistrosFactibilidad from './VerRegistrosFactibilidad'


const Factibilidad = () => {
  const [vistaActual, setVistaActual] = useState('agregar') // 'agregar' o 'ver'


  return (
    <div className="factibilidad-container">
      <h1 className="page-main-title">📊 Factibilidad</h1>


      {/* Tabs: Agregar vs Ver Registros */}
      <div className="tabs-principales">
        <button
          className={`tab-btn ${vistaActual === 'agregar' ? 'active' : ''}`}
          onClick={() => setVistaActual('agregar')}
        >
          Agregar Registro
        </button>
        <button
          className={`tab-btn ${vistaActual === 'ver' ? 'active' : ''}`}
          onClick={() => setVistaActual('ver')}
        >
          Ver Registros
        </button>
      </div>


      {/* Contenido dinámico según selección */}
      <div className="factibilidad-content">
        {vistaActual === 'agregar' && <AgregarFactibilidad />}
        {vistaActual === 'ver' && <VerRegistrosFactibilidad />}
      </div>
    </div>
  )
}


export default Factibilidad
