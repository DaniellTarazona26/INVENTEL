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
  const [expandido, setExpandido] = useState(null);

  useEffect(() => { cargarDatosIniciales() }, []);

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
        proyectosService.obtenerTodos(),
        operadoresService.obtenerTodos()
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
    setExpandido(null);
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

  // ── Helpers ──
  const getNivelesTension = r => [
    r.nivel_tension_at && 'AT',
    r.nivel_tension_mt && 'MT',
    r.nivel_tension_bt && 'BT',
    r.nivel_tension_ap && 'AP',
  ].filter(Boolean).join(', ') || '-';

  const getElementos = r => [
    r.elem_transformador && 'Transf.',
    r.elem_seccionador && 'Secc.',
    r.elem_corta_circuito && 'C.Circ.',
    r.elem_medidor && 'Medidor',
    r.elem_bajante_electrico && 'Bajante',
  ].filter(Boolean).join(', ') || '-';

  const parseCheck = val => {
    try {
      const arr = typeof val === 'string' ? JSON.parse(val) : (val || []);
      return Array.isArray(arr) && arr.length > 0 ? arr.join(', ') : '-';
    } catch { return '-'; }
  };

  const estadoColor = estado => {
    if (!estado) return '#6b7280';
    if (estado === 'BUENO') return '#16a34a';
    if (estado === 'MALO') return '#dc2626';
    return '#d97706';
  };

  const toggleExpandido = id => setExpandido(prev => prev === id ? null : id);

  return (
    <div className="reporte-container">
      <div className="reporte-header">
        <h2>📑 Reporte de Factibilidad</h2>
      </div>

      {/* ── FILTROS ── */}
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
          <label>Proyecto:</label>
          <select value={filtros.proyecto} onChange={e => handleFiltroChange("proyecto", e.target.value)}>
            <option value="">Todos los proyectos</option>
            {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>

        <div className="filtro-group">
          <label>Operador:</label>
          <select value={filtros.operador} onChange={e => handleFiltroChange("operador", e.target.value)}>
            <option value="">Todos los operadores</option>
            {operadores.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
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

      {/* ── RESULTADOS ── */}
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
                    <th>Material</th>
                    <th>Altura</th>
                    <th>Estado Poste</th>
                    <th>Tensión</th>
                    <th>Elementos Eléc.</th>
                    <th>Tierra</th>
                    <th>Cables Tel.</th>
                    <th>Activos Tel.</th>
                    <th>Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((r, index) => {
                    const rowKey = r.id || index;
                    const isOpen = expandido === rowKey;

                    const activosTel = [
                      r.telp_act_amplificadores && 'Amplif.',
                      r.telp_act_fuentes && 'Fuentes',
                      r.telp_act_nodooptico && 'Nodo Ópt.',
                      r.telp_act_antena && 'Antena',
                      r.telp_act_camara_vigil && 'Cámara',
                    ].filter(Boolean).join(', ') || '-';

                    const cablesTel = [
                      r.telp_pas_c_coaxial && `Coax:${r.telp_pas_c_coaxial}`,
                      r.telp_pas_c_fibra && `Fib:${r.telp_pas_c_fibra}`,
                      r.telp_pas_c_drop && `Drop:${r.telp_pas_c_drop}`,
                    ].filter(Boolean).join(' | ') || '-';

                    return (
                      <React.Fragment key={rowKey}>
                        {/* Fila principal */}
                        <tr>
                          <td>{index + 1}</td>
                          <td>{r.created_at ? new Date(r.created_at).toLocaleDateString('es-CO') : '-'}</td>
                          <td><strong>{r.codigo_poste || '-'}</strong></td>
                          <td>{r.ciudad || '-'}</td>
                          <td>{r.barrio || '-'}</td>
                          <td>{r.direccion || '-'}</td>
                          <td>{r.operador || '-'}</td>
                          <td>{r.proyecto || '-'}</td>
                          <td>{r.poste_material || '-'}</td>
                          <td>{r.poste_altura || '-'}</td>
                          <td>
                            <span style={{ color: estadoColor(r.poste_estado), fontWeight: 'bold' }}>
                              {r.poste_estado || '-'}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: getNivelesTension(r) !== '-' ? '#1d4ed8' : '#6b7280', fontSize: '0.85rem' }}>
                              {getNivelesTension(r)}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>{getElementos(r)}</td>
                          <td>
                            <span style={{ color: r.tierra_electrica ? '#16a34a' : '#6b7280', fontWeight: 'bold' }}>
                              {r.tierra_electrica ? 'SI' : 'NO'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>{cablesTel}</td>
                          <td style={{ fontSize: '0.8rem' }}>{activosTel}</td>
                          <td>
                            <button
                              onClick={() => toggleExpandido(rowKey)}
                              style={{
                                background: 'none', border: '1px solid #cbd5e1',
                                borderRadius: '4px', cursor: 'pointer',
                                padding: '2px 8px', fontSize: '0.8rem',
                                color: '#475569'
                              }}
                            >
                              {isOpen ? '▲ Cerrar' : '▼ Ver más'}
                            </button>
                          </td>
                        </tr>

                        {/* Fila de detalle expandible */}
                        {isOpen && (
                          <tr className="fila-detalle">
                            <td colSpan={17}>
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                gap: '12px',
                                padding: '14px 18px',
                                background: '#f8fafc',
                                borderTop: '2px solid #e2e8f0'
                              }}>

                                {/* Poste */}
                                <div className="detalle-grupo">
                                  <strong>🏗️ Poste</strong>
                                  <span>Resistencia: {r.poste_resistencia || '-'}</span>
                                  <span>Uso/Carga: {r.poste_uso_carga || '-'}</span>
                                  <span>Retenida: {r.poste_retenida || '-'}</span>
                                  <span>Coordenadas: {r.coordenadas || '-'}</span>
                                </div>

                                {/* Telecomunicaciones Pasivos */}
                                <div className="detalle-grupo">
                                  <strong>📡 Telec. Pasivos</strong>
                                  <span>Total cables: {r.telp_pas_cables ?? '-'}</span>
                                  <span>RG11: {r.telp_pas_c_rg11 ?? '-'}</span>
                                  <span>Caj. Empalme: {r.telp_pas_cajempalme ?? '-'}</span>
                                  <span>Caj. GPON: {r.telp_pas_cajgpon ?? '-'}</span>
                                  <span>STP: {r.telp_pas_stp ?? '-'}</span>
                                  <span>Bajantes: {r.telp_pas_bajantes ?? '-'}</span>
                                  <span>Reservas: {r.telp_pas_reservas ?? '-'}</span>
                                </div>

                                {/* Método de Tendido */}
                                <div className="detalle-grupo">
                                  <strong>🔧 Método Tendido</strong>
                                  <span>MTH Retención: {r.telp_mth_retencion ?? '-'}</span>
                                  <span>MTH Suspensión: {r.telp_mth_suspencion ?? '-'}</span>
                                  <span>Retención: {r.telp_retencion ?? '-'}</span>
                                  <span>Cable Coaxial: {r.telp_ccoaxial ?? '-'}</span>
                                  <span>Cable Fibra: {r.telp_cfibra ?? '-'}</span>
                                  <span>Tipo Cable: {r.tipo_cable || '-'}</span>
                                  <span>Fijación Herraje: {r.fijacion_herraje || '-'}</span>
                                </div>

                                {/* Observaciones */}
                                <div className="detalle-grupo">
                                  <strong>📝 Observaciones</strong>
                                  <span>Obs. Tendido: {r.observacion_tendido || '-'}</span>
                                  <span style={{ color: parseCheck(r.checkboxes_tendido) !== '-' ? '#dc2626' : 'inherit' }}>
                                    Restricciones: {parseCheck(r.checkboxes_tendido)}
                                  </span>
                                  <span style={{ color: parseCheck(r.checkboxes_sugerencias) !== '-' ? '#d97706' : 'inherit' }}>
                                    Sugerencias: {parseCheck(r.checkboxes_sugerencias)}
                                  </span>
                                  <span>Observaciones: {r.observaciones || '-'}</span>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
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
