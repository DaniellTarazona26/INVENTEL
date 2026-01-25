// src/pages/Factibilidad/VerRegistrosFactibilidad.jsx
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
  const handleVerDetalles = (id) => {
    // Aquí puedes abrir un modal o navegar a otra página
    alert(`Ver detalles de factibilidad ID: ${id}\n\n(Implementar modal en el futuro)`)
  }

  // =============================================
  // FUNCIÓN: EDITAR
  // =============================================
  const handleEditar = (id) => {
    // Aquí puedes cargar los datos en el formulario
    alert(`Editar factibilidad ID: ${id}\n\n(Implementar edición en el futuro)`)
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
          placeholder="Buscar por propietario, código poste..."
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
                  <th>Propietario</th>
                  <th>Ciudad</th>
                  <th>Código Poste</th>
                  <th>Poste Plano</th>
                  <th>Tipo Cable</th>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {factibilidades.map((fact) => (
                  <tr key={fact.id}>
                    <td>{fact.id}</td>
                    <td>{fact.proyecto_nombre || 'N/A'}</td>
                    <td>{fact.propietario || 'N/A'}</td>
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
                    <td>{fact.usuario_nombre || 'N/A'}</td>
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
    </div>
  )
}

export default VerRegistrosFactibilidad