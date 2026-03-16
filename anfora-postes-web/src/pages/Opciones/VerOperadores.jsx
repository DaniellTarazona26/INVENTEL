import React, { useState, useEffect } from 'react'
import operadoresService from '../../services/operadoresService'
import FormularioOperador from '../../components/FormularioOperador'
import './OpcionesComun.css'

const VerOperadores = () => {
  const [busqueda, setBusqueda] = useState('')
  const [operadores, setOperadores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [operadorEditar, setOperadorEditar] = useState(null)

  useEffect(() => {
    cargarOperadores()
  }, [])

  const cargarOperadores = async () => {
    try {
      setCargando(true)
      const data = await operadoresService.obtenerTodosAdmin()
      setOperadores(data.operadores || [])
    } catch (error) {
      console.error('Error cargando operadores:', error)
    } finally {
      setCargando(false)
    }
  }

  const toggleEstado = async (operador) => {
    const nuevoEstado = operador.estado === 'activo' ? 'inactivo' : 'activo'
    try {
      await operadoresService.actualizar(operador.id, { estado: nuevoEstado })
      setOperadores(prev =>
        prev.map(op =>
          op.id === operador.id ? { ...op, estado: nuevoEstado } : op
        )
      )
    } catch (error) {
      console.error('Error cambiando estado:', error)
      alert('Error al cambiar estado del operador')
    }
  }

  const operadoresFiltrados = operadores.filter(op =>
    op.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="tabla-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="seccion-titulo">Operadores</h2>
        <button className="btn-primario" onClick={() => {
          setOperadorEditar(null)
          setMostrarFormulario(true)
        }}>
          + Nuevo Operador
        </button>
      </div>

      <div className="busqueda-container">
        <input
          type="text"
          className="busqueda-input"
          placeholder="Buscar operador..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="tabla-wrapper">
        {cargando ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Cargando...</p>
        ) : (
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>NIT</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {operadoresFiltrados.map((operador, index) => (
                <tr key={operador.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td>{index + 1}</td>
                  <td>{operador.nombre}</td>
                  <td>{operador.nit || '-'}</td>
                  <td>{operador.contacto || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          className="toggle-input"
                          checked={operador.estado === 'activo'}
                          onChange={() => toggleEstado(operador)}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: operador.estado === 'activo' ? '#4CAF50' : '#ccc',
                          borderRadius: '24px', transition: '0.3s'
                        }}>
                          <span style={{
                            position: 'absolute', height: '18px', width: '18px',
                            left: operador.estado === 'activo' ? '23px' : '3px',
                            bottom: '3px', backgroundColor: 'white',
                            borderRadius: '50%', transition: '0.3s'
                          }} />
                        </span>
                      </label>
                      <span style={{
                        fontSize: '12px', fontWeight: '600',
                        color: operador.estado === 'activo' ? '#4CAF50' : '#999'
                      }}>
                        {operador.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => {
                        setOperadorEditar(operador)
                        setMostrarFormulario(true)
                      }}
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
              {operadoresFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                    No se encontraron operadores
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {mostrarFormulario && (
        <FormularioOperador
          modoEdicion={!!operadorEditar}
          operador={operadorEditar}
          onCerrar={() => setMostrarFormulario(false)}
          onGuardar={cargarOperadores}
        />
      )}
    </div>
  )
}

export default VerOperadores

