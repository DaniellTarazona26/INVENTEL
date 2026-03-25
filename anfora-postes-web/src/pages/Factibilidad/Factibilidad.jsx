import React, { useState } from 'react'
import './Factibilidad.css'
import AgregarFactibilidad from './AgregarFactibilidad'
import VerRegistrosFactibilidad from './VerRegistrosFactibilidad'
import useConsultor from '../../hooks/useConsultor'

const Factibilidad = ({ setCurrentPage, factibilidadEditandoId }) => {
  const { esConsultor } = useConsultor()
  const [vistaActual, setVistaActual] = useState(esConsultor ? 'ver' : 'agregar')

  return (
    <div className="factibilidad-container">
      <h1 className="page-main-title">📊 Factibilidad</h1>

      <div className="tabs-principales">
        {!esConsultor && (
          <button
            className={`tab-btn ${vistaActual === 'agregar' ? 'active' : ''}`}
            onClick={() => setVistaActual('agregar')}
          >
            Agregar Registro
          </button>
        )}
        <button
          className={`tab-btn ${vistaActual === 'ver' ? 'active' : ''}`}
          onClick={() => setVistaActual('ver')}
        >
          Ver Registros
        </button>
      </div>

      <div className="factibilidad-content">
        {vistaActual === 'agregar' && !esConsultor && (
          <AgregarFactibilidad setCurrentPage={setCurrentPage} />
        )}
        {vistaActual === 'ver' && (
          <VerRegistrosFactibilidad setVistaActual={setVistaActual} />
        )}
      </div>
    </div>
  )
}

export default Factibilidad

