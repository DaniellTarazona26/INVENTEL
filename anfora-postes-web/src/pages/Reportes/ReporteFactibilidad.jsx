// src/pages/Reportes/ReporteFactibilidad.jsx
import React, { useState, useEffect } from 'react'
import './ReportesComun.css'
import helpersService from '../../services/helpersService'
import reportesService from '../../services/reportesService'

const ReporteFactibilidad = () => {
  const [filtros, setFiltros] = useState({
    ciudad: '',
    barrio: '',
    operario: '',
    proyecto: '',
    fechaInicial: '2026-01-01',
    fechaFinal: '2026-01-31'
  })

  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [ciudades, setCiudades] = useState([])
  const [barrios, setBarrios] = useState([])
  const [inspectores, setInspectores] = useState([])
  const [proyectos, setProyectos] = useState([])

  useEffect(() => {
    cargarDatosIniciales()
  }, [])

  useEffect(() => {
    if (filtros.ciudad) {
      cargarBarrios()
    } else {
      setBarrios([])
      setFiltros(prev => ({ ...prev, barrio: '' }))
    }
  }, [filtros.ciudad])

  const cargarDatosIniciales = async () => {
    try {
      const [ciudadesData, inspectoresData, proyectosData] = await Promise.all([
        helpersService.obtenerCiudades(),
        helpersService.obtenerInspectores(),
        helpersService.obtenerProyectos()
      ])
      setCiudades(ciudadesData)
      setInspectores(inspectoresData)
      setProyectos(proyectosData)
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error)
    }
  }

  const cargarBarrios = async () => {
    try {
      const ciudadSeleccionada = ciudades.find(c => c.nombre === filtros.ciudad)
      if (ciudadSeleccionada) {
        const barriosData = await helpersService.obtenerBarriosPorCiudad(ciudadSeleccionada.id)
        setBarrios(barriosData)
      }
    } catch (error) {
      console.error('Error al cargar barrios:', error)
      setBarrios([])
    }
  }

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }

  const handleBuscar = async () => {
    setLoading(true)
    try {
      const datosObtenidos = await reportesService.getReporteFactibilidad(filtros)
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
      await reportesService.exportarReporteFactibilidad(filtros)
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
        <h2>Reporte de Factibilidad</h2>
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
          <label>Barrio:</label>
          <select value={filtros.barrio} onChange={(e) => handleFiltroChange('barrio', e.target.value)} disabled={!filtros.ciudad}>
            <option value="">{!filtros.ciudad ? 'Primero seleccione una ciudad' : 'Seleccione un barrio'}</option>
            {barrios.map(b => (
              <option key={b.id} value={b.nombre}>{b.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Operario:</label>
          <select value={filtros.operario} onChange={(e) => handleFiltroChange('operario', e.target.value)}>
            <option value="">Seleccione un operario</option>
            {inspectores.map(insp => (
              <option key={insp.id} value={insp.nombre}>{insp.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Proyecto:</label>
          <select value={filtros.proyecto} onChange={(e) => handleFiltroChange('proyecto', e.target.value)}>
            <option value="">Seleccione un proyecto</option>
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
                    <th>Código Poste</th>
                    <th>Ciudad</th>
                    <th>Barrio</th>
                    <th>Dirección</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((registro, index) => (
                    <tr key={registro.id}>
                      <td>{index + 1}</td>
                      <td>{registro.created_at ? new Date(registro.created_at).toLocaleDateString('es-CO') : ''}</td>
                      <td>{registro.codigo_poste || ''}</td>
                      <td>{registro.ciudad || ''}</td>
                      <td>{registro.barrio || ''}</td>
                      <td>{registro.direccion || ''}</td>
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

export default ReporteFactibilidad
