import React, { useState, useEffect } from 'react'
import './OpcionesComun.css'
import usuariosService from '../../services/usuariosService'
import FormularioUsuario from '../../components/FormularioUsuario'

const VerUsuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalCrear, setModalCrear] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      setLoading(true)
      const response = await usuariosService.obtenerTodos()
      if (response.success) setUsuarios(response.usuarios)
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      alert('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleEditar = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setModalEditar(true)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return
    try {
      await usuariosService.eliminar(id)
      alert('Usuario eliminado')
      cargarUsuarios()
    } catch (error) {
      alert('Error al eliminar usuario')
    }
  }

  const handleActivar = async (id) => {
    try {
      await usuariosService.activar(id)
      cargarUsuarios()
    } catch (error) {
      alert('Error al activar usuario')
    }
  }

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.rol?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="tabla-container">
      <h2 className="seccion-titulo">Ver Usuarios</h2>

      <div className="busqueda-container">
        <input
          type="text"
          className="busqueda-input"
          placeholder="Buscar por nombre, email o rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn-buscar-tabla" onClick={cargarUsuarios}>Recargar</button>
        <button className="btn-primary" onClick={() => setModalCrear(true)}>➕ Nuevo Usuario</button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <div className="tabla-wrapper">
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Empresa</th>
                <th>Estado</th>
                <th>Último Acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay usuarios para mostrar
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario, index) => (
                  <tr key={usuario.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td>{index + 1}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.rol}</td>
                    <td>{usuario.rol === 'CONSULTOR' ? (usuario.empresa_nombre || '⚠️ Sin empresa') : '-'}</td>
                    <td>
                      <span className={`estado-badge ${usuario.estado?.toLowerCase()}`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td>
                      {usuario.ultimo_acceso
                        ? new Date(usuario.ultimo_acceso).toLocaleDateString('es-CO')
                        : '-'}
                    </td>
                    <td>
                      <div className="acciones-btns">
                        <button
                          className="btn-link btn-editar"
                          onClick={() => handleEditar(usuario)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        {usuario.estado === 'activo' ? (
                          <button
                            className="btn-link btn-eliminar"
                            onClick={() => handleEliminar(usuario.id)}
                            title="Desactivar"
                          >
                            🔴
                          </button>
                        ) : (
                          <button
                            className="btn-link btn-activar"
                            onClick={() => handleActivar(usuario.id)}
                            title="Activar"
                          >
                            🟢
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalCrear && (
        <FormularioUsuario
          modoEdicion={false}
          usuario={null}
          onCerrar={() => setModalCrear(false)}
          onGuardar={cargarUsuarios}
        />
      )}

      {modalEditar && usuarioSeleccionado && (
        <FormularioUsuario
          modoEdicion={true}
          usuario={usuarioSeleccionado}
          onCerrar={() => { setModalEditar(false); setUsuarioSeleccionado(null) }}
          onGuardar={cargarUsuarios}
        />
      )}
    </div>
  )
}

export default VerUsuarios