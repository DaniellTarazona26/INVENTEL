// src/pages/Reportes/Reportes.jsx
import React, { useState } from 'react'
import './Reportes.css'

// Importar todos los reportes
import ReporteEstructuras from './ReporteEstructuras'
import ReporteFactibilidad from './ReporteFactibilidad'
import ReportePerdidas from './ReportePerdidas'
import ReporteRedes from './ReporteRedes'
import ReportePoda from './ReportePoda'
import ReporteInventarioInspector from './ReporteInventarioInspector'
import ReporteInventarioOperador from './ReporteInventarioOperador'

const Reportes = () => {
  const [reporteActivo, setReporteActivo] = useState('estructuras')

  const reportes = [
    { id: 'estructuras', label: 'Reporte de Estructuras' },
    { id: 'factibilidad', label: 'Reporte de Factibilidad' },
    { id: 'perdidas', label: 'Reporte de Perdidas Adicionales' },
    { id: 'redes', label: 'Reporte de Redes' },
    { id: 'poda', label: 'Reporte de Poda de Arboles' },
    { id: 'inventario-inspector', label: 'Reporte de inventario por Inspector' },
    { id: 'inventario-operador', label: 'Reporte de inventario por Operador' }
  ]

  const renderReporte = () => {
    switch(reporteActivo) {
      case 'estructuras':
        return <ReporteEstructuras />
      case 'factibilidad':
        return <ReporteFactibilidad />
      case 'perdidas':
        return <ReportePerdidas />
      case 'redes':
        return <ReporteRedes />
      case 'poda':
        return <ReportePoda />
      case 'inventario-inspector':
        return <ReporteInventarioInspector />
      case 'inventario-operador':
        return <ReporteInventarioOperador />
      default:
        return <ReporteEstructuras />
    }
  }

  return (
    <div className="reportes-page">
      {/* Selector de Reporte */}
      <div className="reportes-selector">
        <label htmlFor="selector-reporte">Seleccionar Reporte:</label>
        <select 
          id="selector-reporte"
          value={reporteActivo}
          onChange={(e) => setReporteActivo(e.target.value)}
          className="reporte-select"
        >
          {reportes.map(reporte => (
            <option key={reporte.id} value={reporte.id}>
              {reporte.label}
            </option>
          ))}
        </select>
      </div>

      {/* Contenido del reporte activo */}
      <div className="reporte-content">
        {renderReporte()}
      </div>
    </div>
  )
}

export default Reportes
