import React, { useState, useEffect } from 'react'
import usuariosService from '../services/usuariosService'
import empresasService from '../services/empresasService'
import './FormularioModal.css'

const FormularioUsuario = ({ modoEdicion, usuario, onCerrar, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'INSPECTOR',
    telefono: '',
    direccion: '',
    empresa_id: ''
  })
  const [empresas, setEmpresas] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarEmpresas()
  }, [])

  useEffect(() => {
    if (modoEdicion && usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        password: '',
        rol: usuario.rol || 'INSPECTOR',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        empresa_id: usuario.empresa_id || ''
      })
    }
  }, [modoEdicion, usuario])

  const cargarEmpresas = async () => {
    try {
      const response = await empresasService.obtenerTodas()
      if (response.success) setEmpresas(response.empresas)
    } catch (e) {
      console.error('Error cargando empresas:', e)
    }
  }

  const handleChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor,
      ...(campo === 'rol' && valor !== 'CONSULTOR' ? { empresa_id: '' } : {})
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      if (!formData.nombre || !formData.email || !formData.rol) {
        setError('Nombre, email y rol son obligatorios')
        setCargando(false)
        return
      }

      if (!modoEdicion && !formData.password) {
        setError('La contraseña es obligatoria para nuevos usuarios')
        setCargando(false)
        return
      }

      if (formData.rol === 'CONSULTOR' && !formData.empresa_id) {
        setError('La empresa es obligatoria para el rol CONSULTOR')
        setCargando(false)
        return
      }

      const datos = { ...formData }
      if (modoEdicion && !datos.password) delete datos.password
      if (datos.rol !== 'CONSULTOR') delete datos.empresa_id

      if (modoEdicion) {
        await usuariosService.actualizar(usuario.id, datos)
        alert('Usuario actualizado exitosamente')
      } else {
        await usuariosService.crear(datos)
        alert('Usuario creado exitosamente')
      }

      onGuardar()
      onCerrar()
    } catch (error) {
      console.error('Error guardando usuario:', error)
      setError(error.response?.data?.error || 'Error al guardar usuario')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{modoEdicion ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</h2>
          <button className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="formulario">
          {error && (
            <div className="form-error">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo <span className="required">*</span></label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: Juan Pérez"
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="usuario@example.com"
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña {!modoEdicion && <span className="required">*</span>}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder={modoEdicion ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'}
              disabled={cargando}
              required={!modoEdicion}
            />
            {modoEdicion && (
              <small className="form-hint">Dejar en blanco si no desea cambiar la contraseña</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="rol">Rol <span className="required">*</span></label>
            <select
              id="rol"
              value={formData.rol}
              onChange={(e) => handleChange('rol', e.target.value)}
              disabled={cargando}
              required
            >
              <option value="ADMIN">Administrador</option>
              <option value="INSPECTOR">Inspector</option>
              <option value="CONSULTOR">Consultor</option>
            </select>
          </div>

          {formData.rol === 'CONSULTOR' && (
            <div className="form-group">
              <label htmlFor="empresa_id">Empresa <span className="required">*</span></label>
              <select
                id="empresa_id"
                value={formData.empresa_id}
                onChange={(e) => handleChange('empresa_id', e.target.value)}
                disabled={cargando}
                required
              >
                <option value="">Seleccionar empresa...</option>
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="Ej: +57 300 123 4567"
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <textarea
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder="Dirección completa"
              rows="3"
              disabled={cargando}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secundario" onClick={onCerrar} disabled={cargando}>
              Cancelar
            </button>
            <button type="submit" className="btn-primario" disabled={cargando}>
              {cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioUsuario
