import React, { useState, useEffect } from "react";
import "./ReportesComun.css";
import ciudadesService from "../../services/ciudadesService";
import empresasService from "../../services/empresasService";
import reportesService from "../../services/reportesService";

const ReporteRedes = () => {
  const [filtros, setFiltros] = useState({
    ciudad: "",
    barrio: "",
    empresa: "",
    fechaInicial: "",
    fechaFinal: ""
  });

  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [ciudades, setCiudades] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => { cargarDatosIniciales() }, [])

  useEffect(() => {
    if (filtros.ciudad) {
      cargarBarrios(filtros.ciudad)
    } else {
      setBarrios([])
      setFiltros(prev => ({ ...prev, barrio: "" }))
    }
  }, [filtros.ciudad])

  const cargarDatosIniciales = async () => {
    try {
      const [ciudadesData, proyectosData] = await Promise.all([
        ciudadesService.obtenerTodas(),
        empresasService.obtenerTodas()
      ])
      const listaEmpresas = proyectosData.empresas || proyectosData
      setCiudades(Array.isArray(ciudadesData) ? ciudadesData : [])
      setProyectos(Array.isArray(listaEmpresas) ? listaEmpresas : [])
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error)
      alert("Error al cargar listas de filtros")
    }
  }

  const cargarBarrios = async ciudadNombre => {
    try {
      const ciudad = ciudades.find(c => c.nombre === ciudadNombre)
      if (!ciudad) { setBarrios([]); return }
      const barriosData = await ciudadesService.obtenerBarrios(ciudad.id)
      setBarrios(barriosData || [])
    } catch (error) {
      console.error("Error al cargar barrios:", error)
    }
  }

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }

  const handleBuscar = async () => {
    setLoading(true)
    try {
      const datosObtenidos = await reportesService.getReporteRedes(filtros)
      setDatos(Array.isArray(datosObtenidos) ? datosObtenidos : [])
    } catch (error) {
      console.error("Error al buscar:", error)
      alert("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleExportar = async () => {
    setExportando(true)
    try {
      await reportesService.exportarReporteRedes(filtros)
    } catch (error) {
      console.error("Error al exportar:", error)
      alert("Error al exportar el reporte")
    } finally {
      setExportando(false)
    }
  }

  return (
    <div className="reporte-container">
      <div className="reporte-header">
        <h2>🔌 Reporte de Redes</h2>
      </div>

      <div className="filtros-container">
        <div className="filtro-group">
          <label>Ciudad:</label>
          <select value={filtros.ciudad} onChange={e => handleFiltroChange("ciudad", e.target.value)}>
            <option value="">Todas las ciudades</option>
            {ciudades.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </select>
        </div>

        <div className="filtro-group">
          <label>Barrio:</label>
          <select
            value={filtros.barrio}
            onChange={e => handleFiltroChange("barrio", e.target.value)}
            disabled={!filtros.ciudad}
          >
            <option value="">{!filtros.ciudad ? "Selecciona primero una ciudad" : "Todos los barrios"}</option>
            {barrios.map(b => <option key={b.id} value={b.nombre}>{b.nombre}</option>)}
          </select>
        </div>

        <div className="filtro-group">
          <label>Empresa:</label>
          <select value={filtros.empresa} onChange={e => handleFiltroChange("empresa", e.target.value)}>
            <option value="">Todas las empresas</option>
            {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>

        <div className="filtro-group">
          <label>Fecha inicial:</label>
          <input type="date" value={filtros.fechaInicial} onChange={e => handleFiltroChange("fechaInicial", e.target.value)} />
        </div>

        <div className="filtro-group">
          <label>Fecha final:</label>
          <input type="date" value={filtros.fechaFinal} onChange={e => handleFiltroChange("fechaFinal", e.target.value)} />
        </div>

        <div className="filtro-actions">
          <button className="btn-buscar" onClick={handleBuscar} disabled={loading}>
            {loading ? "🔄 Buscando..." : "🔍 Buscar"}
          </button>
          <button className="btn-exportar" onClick={handleExportar} disabled={exportando || datos.length === 0}>
            {exportando ? "⏳ Exportando..." : "📥 Exportar a Excel"}
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
                    <th>Tipo</th>
                    <th>Material</th>
                    <th>Altura</th>
                    <th>Templete</th>
                    <th>Baja</th>
                    <th>Tipo Cable Baja</th>
                    <th>Alumbrado</th>
                    <th>Tipo Cable Alum.</th>
                    <th>Tierra</th>
                    <th>Estado Estructura</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((r, index) => (
                    <tr key={r.id || index}>
                      <td>{index + 1}</td>
                      <td>{r.fecha_registro ? new Date(r.fecha_registro).toLocaleDateString("es-CO") : "-"}</td>
                      <td><strong>{r.waypoint || "-"}</strong></td>
                      <td>{r.ciudad || "-"}</td>
                      <td>{r.barrio || "-"}</td>
                      <td>{r.direccion_completa || "-"}</td>
                      <td>{r.tipo || "-"}</td>
                      <td>{r.material || "-"}</td>
                      <td>{r.altura || "-"}</td>
                      <td>{r.templete || "-"}</td>
                      <td>
                        <span style={{ color: r.baja === 'SI' ? '#16a34a' : '#6b7280', fontWeight: r.baja === 'SI' ? 'bold' : 'normal' }}>
                          {r.baja || "-"}
                        </span>
                      </td>
                      <td>{r.baja_tipo_cable || "-"}</td>
                      <td>
                        <span style={{ color: r.alumbrado === 'SI' ? '#16a34a' : '#6b7280', fontWeight: r.alumbrado === 'SI' ? 'bold' : 'normal' }}>
                          {r.alumbrado || "-"}
                        </span>
                      </td>
                      <td>{r.alumbrado_tipo_cable || "-"}</td>
                      <td>
                        <span style={{ color: r.tierra_electrica === 'SI' ? '#16a34a' : '#6b7280' }}>
                          {r.tierra_electrica || "-"}
                        </span>
                      </td>
                      <td>{r.estado_estructura || "-"}</td>
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

export default ReporteRedes

