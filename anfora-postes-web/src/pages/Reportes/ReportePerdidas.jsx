// src/pages/Reportes/ReportePerdidas.jsx
import React, { useState, useEffect } from 'react'
import './ReportesComun.css'
import helpersService from '../../services/helpersService'
import reportesService from '../../services/reportesService'

const ReportePerdidas = () => {
  const [filtros, setFiltros] = useState({
    ciudad: '',
    empresa: '',
    fechaInicial: '2026-01-01',
    fechaFinal: '2026-01-31'
  })

  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [ciudades, setCiudades] = useState([])
  const [proyectos, setProyectos] = useState([])

  useEffect(() => {
    cargarDatosIniciales()
  }, [])

  const cargarDatosIniciales = async () => {
    try {
      const [ciudadesData, proyectosData] = await Promise.all([
        helpersService.obtenerCiudades(),
        helpersService.obtenerProyectos()
      ])
      setCiudades(ciudadesData)
      setProyectos(proyectosData)
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error)
    }
  }

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }

  const handleBuscar = async () => {
    setLoading(true)
    try {
      const datosObtenidos = await reportesService.getReportePerdidas(filtros)
      setDatos(datosObtenidos)
    } catch (error) {
      console.error('Error al buscar:', error)
      alert('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleExportar = async () => {
    setExportando(true)
    try {
      await reportesService.exportarReportePerdidas(filtros)
      alert('Reporte exportado exitosamente')
    } catch (error) {
      console.error('Error al exportar:', error)
      alert('Error al exportar el reporte')
    } finally {
      setExportando(false)
    }
  }

  return (
    <div className="reporte-container">
      <div className="reporte-header">
        <h2>Reporte de Pérdidas</h2>
      </div>

      <div className="filtros-container">
        <div className="filtro-group">
          <label>Ciudad:</label>
          <select value={filtros.ciudad} onChange={(e) => handleFiltroChange('ciudad', e.target.value)}>
            <option value="">Seleccione una ciudad</option>
            {ciudades.map(c => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Empresa:</label>
          <select value={filtros.empresa} onChange={(e) => handleFiltroChange('empresa', e.target.value)}>
            <option value="">Seleccione una Empresa</option>
            {proyectos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Fecha inicial:</label>
          <input type="date" value={filtros.fechaInicial} onChange={(e) => handleFiltroChange('fechaInicial', e.target.value)} />
        </div>

        <div className="filtro-group">
          <label>Fecha Final:</label>
          <input type="date" value={filtros.fechaFinal} onChange={(e) => handleFiltroChange('fechaFinal', e.target.value)} />
        </div>

        <div className="filtro-actions">
          <button className="btn-buscar" onClick={handleBuscar} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button className="btn-exportar" onClick={handleExportar} disabled={exportando || datos.length === 0}>
            {exportando ? 'Exportando...' : 'Exportar'}
          </button>
        </div>
      </div>

      <div className="reporte-resultados">
        {loading ? (
          <div className="loading">Cargando datos...</div>
        ) : datos.length > 0 ? (
          <>
            <p className="resultados-count">Se encontraron {datos.length} registros</p>
            <div className="tabla-container">
              <table className="tabla-reporte">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Estructura</th>
                    <th>Ciudad</th>
                    <th>Barrio</th>
                    <th>Dirección</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((registro, index) => (
                    <tr key={registro.id}>
                      <td>{index + 1}</td>
                      <td>{registro.fecha_registro ? new Date(registro.fecha_registro).toLocaleDateString('es-CO') : ''}</td>
                      <td>{registro.waypoint || ''}</td>
                      <td>{registro.ciudad || ''}</td>
                      <td>{registro.barrio || ''}</td>
                      <td>{registro.direccion_completa || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="no-data">
            <p>ℹ️ No se ha encontrado información disponible para mostrar.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportePerdidas
