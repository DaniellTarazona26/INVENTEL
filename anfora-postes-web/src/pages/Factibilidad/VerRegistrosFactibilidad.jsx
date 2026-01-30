// src/pages/Factibilidad/Factibilidad.jsx
import React, { useState, useEffect } from 'react'
import './VerRegistros.css'
import factibilidadService from '../../services/factibilidadService'



const VerRegistrosFactibilidad = () => {
  const [fechaInicial, setFechaInicial] = useState('')
  const [fechaFinal, setFechaFinal] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [factibilidades, setFactibilidades] = useState([])
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [paginaActual, setPaginaActual] = useState(1)
  const registrosPorPagina = 50



  // =============================================
  // CARGAR DATOS AL MONTAR
  // =============================================
  useEffect(() => {
    cargarFactibilidades()
  }, [paginaActual])



  // =============================================
  // FUNCIÓN: CARGAR FACTIBILIDADES
  // =============================================
  const cargarFactibilidades = async () => {
    try {
      setCargando(true)
      setMensaje({ tipo: '', texto: '' })



      const filtros = {
        fecha_inicio: fechaInicial || undefined,
        fecha_fin: fechaFinal || undefined,
        busqueda: busqueda || undefined,
        estado: 'activo',
        limit: registrosPorPagina,
        offset: (paginaActual - 1) * registrosPorPagina
      }



      const respuesta = await factibilidadService.obtenerTodas(filtros)



      if (respuesta.success) {
        setFactibilidades(respuesta.factibilidades)
        setTotal(respuesta.total)
      }
    } catch (error) {
      console.error('Error al cargar factibilidades:', error)
      setMensaje({
        tipo: 'error',
        texto: 'Error al cargar los registros: ' + (error.message || 'Error desconocido')
      })
    } finally {
      setCargando(false)
    }
  }



  // =============================================
  // FUNCIÓN: BUSCAR
  // =============================================
  const handleBuscar = () => {
    setPaginaActual(1) // Resetear a página 1
    cargarFactibilidades()
  }



  // =============================================
  // FUNCIÓN: LIMPIAR FILTROS
  // =============================================
  const handleLimpiarFiltros = () => {
    setFechaInicial('')
    setFechaFinal('')
    setBusqueda('')
    setPaginaActual(1)
    setTimeout(() => cargarFactibilidades(), 100)
  }



  // =============================================
  // FUNCIÓN: ELIMINAR
  // =============================================
  const handleEliminar = async (id, codigoPoste) => {
    if (!window.confirm(`¿Está seguro de eliminar la factibilidad "${codigoPoste}"?`)) {
      return
    }



    try {
      setCargando(true)
      await factibilidadService.eliminar(id)
     
      setMensaje({ tipo: 'success', texto: '✅ Factibilidad eliminada exitosamente' })
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
     
      cargarFactibilidades()
    } catch (error) {
      console.error('Error al eliminar:', error)
      setMensaje({
        tipo: 'error',
        texto: 'Error al eliminar: ' + (error.message || 'Error desconocido')
      })
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000)
    } finally {
      setCargando(false)
    }
  }



  // =============================================
  // FUNCIÓN: VER DETALLES
  // =============================================
  const [modalDetalles, setModalDetalles] = useState(null)
const [cargandoDetalles, setCargandoDetalles] = useState(false)



// Función para ver detalles
const handleVerDetalles = async (id) => {
  try {
    setCargandoDetalles(true)
    const respuesta = await factibilidadService.obtenerPorId(id)
   
    if (respuesta.success) {
      setModalDetalles(respuesta.factibilidad)
    } else {
      setModalDetalles(respuesta)
    }
  } catch (error) {
    console.error('Error al cargar detalles:', error)
    setMensaje({
      tipo: 'error',
      texto: 'Error al cargar detalles: ' + (error.message || 'Error desconocido')
    })
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
  } finally {
    setCargandoDetalles(false)
  }
}



// Función para cerrar modal
const cerrarModalDetalles = () => {
  setModalDetalles(null)
}



  // =============================================
  // FUNCIÓN: EDITAR
  // =============================================
  const handleEditar = (id) => {
    localStorage.setItem('editarFactibilidadId', id);
    setMensaje({ 
      tipo: 'info', 
      texto: '🔄 Cargando factibilidad para edición...' 
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }



  // =============================================
  // PAGINACIÓN
  // =============================================
  const totalPaginas = Math.ceil(total / registrosPorPagina)



  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1)
    }
  }



  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1)
    }
  }



  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="ver-registros-container">
      <h2 className="page-subtitle">Ver Registros Factibilidad</h2>



      {/* Mensaje de estado */}
      {mensaje.texto && (
        <div className={`mensaje-estado mensaje-${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}



      {/* Filtros */}
      <div className="filtros-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por código poste o proyecto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
        />
       
        <div className="fecha-group">
          <label>Fecha inicial:</label>
          <input
            type="date"
            value={fechaInicial}
            onChange={(e) => setFechaInicial(e.target.value)}
          />
        </div>



        <div className="fecha-group">
          <label>Fecha final:</label>
          <input
            type="date"
            value={fechaFinal}
            onChange={(e) => setFechaFinal(e.target.value)}
          />
        </div>



        <button
          className="btn-buscar"
          onClick={handleBuscar}
          disabled={cargando}
        >
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>



        <button
          className="btn-limpiar"
          onClick={handleLimpiarFiltros}
          disabled={cargando}
        >
          Limpiar
        </button>
      </div>



      {/* Indicador de resultados */}
      <div className="resultados-info">
        {total > 0 ? (
          <p>
            Mostrando <strong>{(paginaActual - 1) * registrosPorPagina + 1}</strong> a{' '}
            <strong>{Math.min(paginaActual * registrosPorPagina, total)}</strong> de{' '}
            <strong>{total}</strong> registros
          </p>
        ) : (
          <p>No hay registros para mostrar</p>
        )}
      </div>



      {/* Tabla */}
      {cargando ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando registros...</p>
        </div>
      ) : factibilidades.length === 0 ? (
        <div className="info-message">
          <span className="info-icon">ℹ️</span>
          <span>No se ha encontrado información disponible para mostrar.</span>
        </div>
      ) : (
        <>
          <div className="tabla-container">
            <table className="tabla-registros">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Proyecto</th>
                  <th>Empresa</th>
                  <th>Operador</th>
                  <th>Ciudad</th>
                  <th>Código Poste</th>
                  <th>Poste Plano</th>
                  <th>Tipo Cable</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {factibilidades.map((fact) => (
                  <tr key={fact.id}>
                    <td>{fact.id}</td>
                    <td>{fact.proyecto_nombre || 'N/A'}</td>
                    <td>{fact.empresa_nombre || 'N/A'}</td>
                    <td>{fact.operador_nombre || 'N/A'}</td>
                    <td>{fact.ciudad_nombre || 'N/A'}</td>
                    <td className="codigo-poste">{fact.codigo_poste || 'N/A'}</td>
                    <td>{fact.poste_plano || 'N/A'}</td>
                    <td>
                      {fact.tipo_cable ? (
                        <span className="badge badge-nuevo">{fact.tipo_cable}</span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{new Date(fact.created_at).toLocaleDateString('es-CO')}</td>
                    <td>
                      <div className="acciones-grupo">
                        <button
                          className="btn-accion btn-ver"
                          onClick={() => handleVerDetalles(fact.id)}
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                        <button
                          className="btn-accion btn-editar"
                          onClick={() => handleEditar(fact.id)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-accion btn-eliminar"
                          onClick={() => handleEliminar(fact.id, fact.codigo_poste)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>



          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="paginacion">
              <button
                className="btn-paginacion"
                onClick={handlePaginaAnterior}
                disabled={paginaActual === 1}
              >
                ← Anterior
              </button>
             
              <span className="paginacion-info">
                Página {paginaActual} de {totalPaginas}
              </span>
             
              <button
                className="btn-paginacion"
                onClick={handlePaginaSiguiente}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}



      {/* Modal de detalles */}
      {modalDetalles && (
        <div className="modal-overlay" onClick={cerrarModalDetalles}>
          <div className="modal-detalles" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Detalles de Factibilidad #{modalDetalles.id}</h2>
              <button className="btn-cerrar-modal" onClick={cerrarModalDetalles}>✕</button>
            </div>
           
            <div className="modal-body">
              {/* Sección 1: Información General */}
              <div className="detalle-seccion">
                <h3>📍 Información General</h3>
                <div className="detalle-grid">
                  <div><strong>Proyecto:</strong> {modalDetalles.proyecto_nombre || 'N/A'}</div>
                  <div><strong>Empresa:</strong> {modalDetalles.empresa_nombre || 'N/A'}</div>
                  <div><strong>Operador:</strong> {modalDetalles.operador_nombre || 'N/A'}</div>
                  <div><strong>Ciudad:</strong> {modalDetalles.ciudad_nombre || 'N/A'}</div>
                  <div><strong>Barrio:</strong> {modalDetalles.barrio_nombre || 'N/A'}</div>
                </div>
              </div>



              {/* Sección 2: Ubicación */}
              <div className="detalle-seccion">
                <h3>🗺️ Ubicación</h3>
                <div className="detalle-grid">
                  <div><strong>Dirección:</strong> {modalDetalles.direccion_via} {modalDetalles.direccion_numero} {modalDetalles.direccion_coordenada}</div>
                  <div><strong>Código Poste:</strong> {modalDetalles.codigo_poste || 'N/A'}</div>
                  <div><strong>Poste en Plano:</strong> {modalDetalles.poste_plano || 'N/A'}</div>
                  <div><strong>Tipo Cable:</strong> {modalDetalles.tipo_cable || 'N/A'}</div>
                  <div><strong>Latitud:</strong> {modalDetalles.latitud || 'N/A'}</div>
                  <div><strong>Longitud:</strong> {modalDetalles.longitud || 'N/A'}</div>
                </div>
              </div>



              {/* Sección 3: Características del Poste */}
              <div className="detalle-seccion">
                <h3>🏗️ Características del Poste</h3>
                <div className="detalle-grid">
                  <div><strong>Material:</strong> {modalDetalles.poste_material || 'N/A'}</div>
                  <div><strong>Altura:</strong> {modalDetalles.poste_altura || 'N/A'}</div>
                  <div><strong>Resistencia:</strong> {modalDetalles.poste_resistencia || 'N/A'}</div>
                  <div><strong>Uso por Carga:</strong> {modalDetalles.poste_uso_carga || 'N/A'}</div>
                  <div><strong>Retenidas:</strong> {modalDetalles.poste_retenida || '0'}</div>
                  <div><strong>Estado:</strong> {modalDetalles.poste_estado || 'N/A'}</div>
                </div>
              </div>



              {/* Sección 4: Red Eléctrica */}
              <div className="detalle-seccion">
                <h3>⚡ Red Eléctrica</h3>
                <div className="detalle-checkboxes">
                  {modalDetalles.nivel_tension_at && <span className="badge-check">✓ AT</span>}
                  {modalDetalles.nivel_tension_mt && <span className="badge-check">✓ MT</span>}
                  {modalDetalles.nivel_tension_bt && <span className="badge-check">✓ BT</span>}
                  {modalDetalles.nivel_tension_ap && <span className="badge-check">✓ AP</span>}
                  {modalDetalles.elem_transformador && <span className="badge-check">✓ Transformador</span>}
                  {modalDetalles.elem_seccionador && <span className="badge-check">✓ Seccionador</span>}
                  {modalDetalles.elem_corta_circuito && <span className="badge-check">✓ Corta circuito</span>}
                  {modalDetalles.tierra_electrica && <span className="badge-check">✓ Tierra eléctrica</span>}
                </div>
              </div>



              {/* Sección 5: Observaciones */}
              {modalDetalles.observaciones && (
                <div className="detalle-seccion">
                  <h3>📝 Observaciones</h3>
                  <p>{modalDetalles.observaciones}</p>
                </div>
              )}



              {/* Sección 6: Fechas */}
              <div className="detalle-seccion">
                <h3>📅 Fechas</h3>
                <div className="detalle-grid">
                  <div><strong>Creado:</strong> {new Date(modalDetalles.created_at).toLocaleString('es-CO')}</div>
                  {modalDetalles.updated_at && (
                    <div><strong>Actualizado:</strong> {new Date(modalDetalles.updated_at).toLocaleString('es-CO')}</div>
                  )}
                </div>
              </div>
            </div>



            <div className="modal-footer">
              <button className="btn-cerrar" onClick={cerrarModalDetalles}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}




    </div>
  )
}



export default VerRegistrosFactibilidad
