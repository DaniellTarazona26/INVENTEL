import React, { useState, useEffect } from 'react'
import './ReportesComun.css'
import ciudadesService from "../../services/ciudadesService";
import empresasService from "../../services/empresasService";
import inspectoresService from "../../services/inspectoresService";
import reportesService from '../../services/reportesService'

const ReporteInventarioInspector = () => {
  const [filtros, setFiltros] = useState({
    inspector: '',
    ciudad: '',
    empresa: '',
    fechaInicial: '',
    fechaFinal: ''
  })

  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [inspectores, setInspectores] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [proyectos, setProyectos] = useState([])

  useEffect(() => {
    cargarDatosIniciales()
  }, [])

  const cargarDatosIniciales = async () => {
    try {
      const [inspectoresData, ciudadesData, proyectosData] = await Promise.all([
        inspectoresService.obtenerTodos(),
        ciudadesService.obtenerTodas(),
        empresasService.obtenerTodas()
      ])

      const listaEmpresas = proyectosData.empresas || proyectosData;

      setInspectores(Array.isArray(inspectoresData) ? inspectoresData : []);
      setCiudades(Array.isArray(ciudadesData) ? ciudadesData : []);
      setProyectos(Array.isArray(listaEmpresas) ? listaEmpresas : []);

    } catch (error) {
      console.error('Error al cargar datos iniciales:', error)
      alert('Error al cargar listas de filtros')
    }
  }

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }

  const handleBuscar = async () => {
    setLoading(true)
    try {
      const datosObtenidos = await reportesService.getInventarioInspector(filtros)
      setDatos(Array.isArray(datosObtenidos) ? datosObtenidos : [])
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
      await reportesService.exportarInventarioInspector(filtros)
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
        <h2>📋 Reporte de Inventario por Inspector</h2>
      </div>

      <div className="filtros-container">
        <div className="filtro-group">
          <label>Inspector:</label>
          <select
            value={filtros.inspector}
            onChange={(e) => handleFiltroChange('inspector', e.target.value)}
          >
            <option value="">Todos los inspectores</option>
            {inspectores.map(insp => (
              <option key={insp.nombre} value={insp.nombre}>{insp.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Ciudad:</label>
          <select
            value={filtros.ciudad}
            onChange={(e) => handleFiltroChange('ciudad', e.target.value)}
          >
            <option value="">Todas las ciudades</option>
            {ciudades.map(c => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Empresa:</label>
          <select
            value={filtros.empresa}
            onChange={(e) => handleFiltroChange('empresa', e.target.value)}
          >
            <option value="">Todas las empresas</option>
            {proyectos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Fecha inicial:</label>
          <input
            type="date"
            value={filtros.fechaInicial}
            onChange={(e) => handleFiltroChange('fechaInicial', e.target.value)}
          />
        </div>

        <div className="filtro-group">
          <label>Fecha Final:</label>
          <input
            type="date"
            value={filtros.fechaFinal}
            onChange={(e) => handleFiltroChange('fechaFinal', e.target.value)}
          />
        </div>

        <div className="filtro-actions">
          <button
            className="btn-buscar"
            onClick={handleBuscar}
            disabled={loading}
          >
            {loading ? '🔄 Buscando...' : '🔍 Buscar'}
          </button>
          <button
            className="btn-exportar"
            onClick={handleExportar}
            disabled={exportando || datos.length === 0}
          >
            {exportando ? '⏳ Exportando...' : '📥 Exportar a Excel'}
          </button>
        </div>
      </div>

      <div className="reporte-resultados">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : datos.length > 0 ? (
          <>
            <p className="resultados-count">✅ Se encontraron {datos.length} registros</p>
            <div className="tabla-container">
              <table className="tabla-reporte">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>WayPoint</th>
                    <th>Ciudad</th>
                    <th>Barrio</th>
                    <th>Dirección</th>
                    <th>Inspector</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((registro, index) => (
                    <tr key={registro.id}>
                      <td>{index + 1}</td>
                      <td>{registro.fecha_registro ? new Date(registro.fecha_registro).toLocaleDateString('es-CO') : '-'}</td>
                      <td><strong>{registro.waypoint || '-'}</strong></td>
                      <td>{registro.ciudad || '-'}</td>
                      <td>{registro.barrio || '-'}</td>
                      <td>{registro.direccion_completa || '-'}</td>
                      <td>{registro.inspector_nombre || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="no-data">
            <p>ℹ️ No se encontraron registros con los filtros seleccionados</p>
            <p>Selecciona filtros y presiona "Buscar"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReporteInventarioInspector

