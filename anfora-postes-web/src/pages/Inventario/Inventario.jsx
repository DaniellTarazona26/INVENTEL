import React, { useState, useEffect } from 'react'
import './Inventario.css'
import inventarioService from '../../services/inventarioService'

const Inventario = ({ setCurrentPage }) => {
  const [inventarios, setInventarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    busqueda: ''
  })
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const esConsultor = usuario.rol === 'CONSULTOR'

  useEffect(() => {
    cargarInventarios()
  }, [])

  const cargarInventarios = async () => {
    try {
      setLoading(true)
      const response = await inventarioService.obtenerTodos()
      
      if (response.success) {
        setInventarios(response.inventarios)
      }
    } catch (error) {
      console.error('Error cargando inventarios:', error)
      alert('Error al cargar inventarios')
    } finally {
      setLoading(false)
    }
  }

  const handleEditar = (id) => {
    localStorage.setItem('editarInventarioId', id)
    setCurrentPage('agregar')
  }

  const handleContinuar = (id) => {
    const inventario = inventarios.find(inv => inv.id === id)
    if (inventario && inventario.operadores) {
      localStorage.setItem('inventarioParcialId', id)
      localStorage.setItem('operadoresSeleccionados', JSON.stringify(inventario.operadores))
      setCurrentPage('agregar-operadores')
    }
  }

  const handleVer = (id) => {
  localStorage.setItem('verInventarioId', id)
  setCurrentPage('ver-inventario')
}


  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este inventario?')) {
      try {
        await inventarioService.eliminar(id)
        alert('Inventario eliminado')
        cargarInventarios()
      } catch (error) {
        console.error('Error eliminando:', error)
        alert('Error al eliminar')
      }
    }
  }

  const inventariosFiltrados = inventarios.filter(inv => {
    const busqueda = filtros.busqueda.toLowerCase()
    return (
      inv.waypoint?.toLowerCase().includes(busqueda) ||
      inv.codigo_estructura?.toLowerCase().includes(busqueda) ||
      inv.consecutivo_poste?.toLowerCase().includes(busqueda)
    )
  })

  return (
    <div className="inventario-page">
      <div className="inventario-header">
        <h2>📋 Inventarios Registrados</h2>
        {!esConsultor && (
          <button
            className="btn-primary"
            onClick={() => {
              localStorage.removeItem('editarInventarioId')
              setCurrentPage('agregar')
            }}
          >
            ➕ Nuevo Inventario
          </button>
        )}
      </div>

      <div className="inventario-filtros">
        <div>
          <label>Buscar (WayPoint / Código / Poste)</label>
          <input 
            type="text" 
            placeholder="Buscar..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
          />
        </div>
        <button 
          className="btn-secondary"
          onClick={cargarInventarios}
        >
          🔄 Recargar
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando inventarios...</p>
        </div>
      ) : (
        <>
          <div className="inventario-stats">
            <span>Total de registros: <strong>{inventariosFiltrados.length}</strong></span>
            <span className="pendientes-count">
              Pendientes de completar: <strong>
                {inventariosFiltrados.filter(inv => inv.estado_completitud === 'pendiente_operadores').length}
              </strong>
            </span>
          </div>

          <div className="inventario-tabla">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Estado</th>
                <th>Código</th>
                <th>WayPoint</th>
                <th>Dirección</th>
                <th>Tipo</th>
                <th>Material</th>
                <th>Altura</th>
                <th>Operadores</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{textAlign: 'center', padding: '2rem'}}>
                    {inventarios.length === 0 
                      ? '📭 No hay inventarios registrados' 
                      : '🔍 No se encontraron resultados'}
                  </td>
                </tr>
              ) : (
                inventariosFiltrados.map((inv) => (
                  <tr 
                    key={inv.id}
                    className={inv.estado_completitud === 'pendiente_operadores' ? 'fila-pendiente' : ''}
                  >
                    <td>{inv.id}</td>
                    <td>
                      {inv.estado_completitud === 'pendiente_operadores' ? (
                        <span className="badge badge-warning">⚠️ Pendiente</span>
                      ) : (
                        <span className="badge badge-success">✅ Completo</span>
                      )}
                    </td>
                    <td><strong>{inv.codigo_estructura || '-'}</strong></td>
                    <td><strong>{inv.waypoint || '-'}</strong></td>
                    <td>{inv.direccion_completa || '-'}</td>
                    <td>{inv.tipo || '-'}</td>
                    <td>{inv.material || '-'}</td>
                    <td>{inv.altura || '-'}</td>
                    <td>
                      {inv.operadores && inv.operadores.length > 0 
                        ? inv.operadores.slice(0, 2).join(', ') + 
                          (inv.operadores.length > 2 ? '...' : '')
                        : '-'}
                    </td>
                    <td>
                      {inv.fecha_registro 
                        ? new Date(inv.fecha_registro).toLocaleDateString('es-CO')
                        : '-'}
                    </td>
                    <td>
                      <div className="acciones-btns">
                        <button
                          className="btn-link btn-ver"
                          onClick={() => handleVer(inv.id)}
                          title="Ver detalles"
                        >
                          👁️
                        </button>

                        {!esConsultor && (
                          <>
                            {inv.estado_completitud === 'pendiente_operadores' ? (
                              <button
                                className="btn-link btn-continuar"
                                onClick={() => handleContinuar(inv.id)}
                                title="Continuar con operadores"
                              >
                                ▶️
                              </button>
                            ) : (
                              <button
                                className="btn-link btn-editar"
                                onClick={() => handleEditar(inv.id)}
                                title="Editar"
                              >
                                ✏️
                              </button>
                            )}

                            <button
                              className="btn-link btn-eliminar"
                              onClick={() => handleEliminar(inv.id)}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        </>
      )}
    </div>
  )
}

export default Inventario
