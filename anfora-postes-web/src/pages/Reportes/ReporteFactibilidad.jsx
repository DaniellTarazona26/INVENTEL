import React, { useState, useEffect } from "react";
import "./ReportesComun.css";
import ciudadesService from "../../services/ciudadesService";
import proyectosService from "../../services/proyectosService";
import operadoresService from "../../services/operadoresService";
import reportesService from "../../services/reportesService";

const ReporteFactibilidad = () => {
  const [filtros, setFiltros] = useState({
    ciudad: "",
    barrio: "",
    operador: "",
    proyecto: "",
    fechaInicial: "",
    fechaFinal: ""
  });

  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [ciudades, setCiudades] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [operadores, setOperadores] = useState([]);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    if (filtros.ciudad) {
      cargarBarrios(filtros.ciudad);
    } else {
      setBarrios([]);
      setFiltros(prev => ({ ...prev, barrio: "" }));
    }
  }, [filtros.ciudad]);

  const cargarDatosIniciales = async () => {
    try {
      const [ciudadesData, proyectosData, operadoresData] = await Promise.all([
        ciudadesService.obtenerTodas(),
        proyectosService.obtenerTodos(),   // ← proyectos reales (idk, pqr, etc)
        operadoresService.obtenerTodos()   // ← operadores (CLARO, ETB, etc)
      ]);

      const listaProyectos = Array.isArray(proyectosData) ? proyectosData : (proyectosData.proyectos || []);
      const listaOperadores = Array.isArray(operadoresData) ? operadoresData : (operadoresData.operadores || []);

      setCiudades(Array.isArray(ciudadesData) ? ciudadesData : []);
      setProyectos(listaProyectos);
      setOperadores(listaOperadores);

    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
      alert("Error al cargar listas de filtros");
    }
  };

  const cargarBarrios = async ciudadNombre => {
    try {
      const ciudad = ciudades.find(c => c.nombre === ciudadNombre);
      if (!ciudad) { setBarrios([]); return; }
      const barriosData = await ciudadesService.obtenerBarrios(ciudad.id);
      setBarrios(barriosData || []);
    } catch (error) {
      console.error("Error al cargar barrios:", error);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const datosObtenidos = await reportesService.getReporteFactibilidad(filtros);
      setDatos(Array.isArray(datosObtenidos) ? datosObtenidos : []);
    } catch (error) {
      console.error("Error al buscar:", error);
      alert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleExportar = async () => {
    setExportando(true);
    try {
      await reportesService.exportarReporteFactibilidad(filtros);
    } catch (error) {
      console.error("Error al exportar:", error);
      alert("Error al exportar el reporte");
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="reporte-container">
      <div className="reporte-header">
        <h2>📑 Reporte de Factibilidad</h2>
      </div>

      <div className="filtros-container">
        <div className="filtro-group">
          <label>Ciudad:</label>
          <select value={filtros.ciudad} onChange={e => handleFiltroChange("ciudad", e.target.value)}>
            <option value="">Todas las ciudades</option>
            {ciudades.map(c => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Barrio:</label>
          <select
            value={filtros.barrio}
            onChange={e => handleFiltroChange("barrio", e.target.value)}
            disabled={!filtros.ciudad}
          >
            <option value="">
              {!filtros.ciudad ? "Selecciona primero una ciudad" : "Todos los barrios"}
            </option>
            {barrios.map(b => (
              <option key={b.id} value={b.nombre}>{b.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Proyecto:</label>
          <select value={filtros.proyecto} onChange={e => handleFiltroChange("proyecto", e.target.value)}>
            <option value="">Todos los proyectos</option>
            {proyectos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label>Operador:</label>
          <select value={filtros.operador} onChange={e => handleFiltroChange("operador", e.target.value)}>
            <option value="">Todos los operadores</option>
            {operadores.map(o => (
              <option key={o.id} value={o.id}>{o.nombre}</option>
            ))}
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
                    <th>Código Poste</th>
                    <th>Ciudad</th>
                    <th>Barrio</th>
                    <th>Dirección</th>
                    <th>Operador</th>
                    <th>Proyecto</th>
                    <th>Tipo Poste</th>
                    <th>Altura Poste</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((registro, index) => (
                    <tr key={registro.id || index}>
                      <td>{index + 1}</td>
                      <td>{registro.created_at ? new Date(registro.created_at).toLocaleDateString("es-CO") : "-"}</td>
                      <td><strong>{registro.codigo_poste || "-"}</strong></td>
                      <td>{registro.ciudad || "-"}</td>
                      <td>{registro.barrio || "-"}</td>
                      <td>{registro.direccion || "-"}</td>
                      <td>{registro.operador || "-"}</td>
                      <td>{registro.proyecto || "-"}</td>
                      <td>{registro.tipo_poste || "-"}</td>
                      <td>{registro.altura_poste || "-"}</td>
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
  );
};

export default ReporteFactibilidad;
