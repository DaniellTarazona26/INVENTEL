// src/components/FormularioEmpresa.jsx
import React, { useState, useEffect } from 'react'
import empresasService from '../services/empresasService'
import './FormularioModal.css'

const FormularioEmpresa = ({ modoEdicion, empresa, onCerrar, onGuardar }) => {
  const [formData, setFormData] = useState({ nombre: '', nit: '', contacto: '', telefono: '', email: '' })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (modoEdicion && empresa) {
      setFormData({
        nombre: empresa.nombre || '', nit: empresa.nit || '',
        contacto: empresa.contacto || '', telefono: empresa.telefono || '',
        email: empresa.email || ''
      })
    }
  }, [modoEdicion, empresa])

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nombre) { setError('El nombre es obligatorio'); return }
    setCargando(true)
    try {
      if (modoEdicion) {
        await empresasService.actualizar(empresa.id, formData)
        alert('Empresa actualizada exitosamente')
      } else {
        await empresasService.crear(formData)
        alert('Empresa creada exitosamente')
      }
      onGuardar(); onCerrar()
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar empresa')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{modoEdicion ? '✏️ Editar Empresa' : '➕ Nueva Empresa'}</h2>
          <button className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="formulario">
          {error && <div className="form-error"><span>⚠️</span><p>{error}</p></div>}
          <div className="form-group">
            <label>Nombre <span className="required">*</span></label>
            <input type="text" value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} placeholder="Ej: CENS, ESSA" disabled={cargando} required />
          </div>
          <div className="form-group">
            <label>NIT</label>
            <input type="text" value={formData.nit} onChange={e => handleChange('nit', e.target.value)} placeholder="900123456-7" disabled={cargando} />
          </div>
          <div className="form-group">
            <label>Contacto</label>
            <input type="text" value={formData.contacto} onChange={e => handleChange('contacto', e.target.value)} placeholder="Nombre del contacto" disabled={cargando} />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" value={formData.telefono} onChange={e => handleChange('telefono', e.target.value)} placeholder="+57 300 123 4567" disabled={cargando} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="contacto@empresa.com" disabled={cargando} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secundario" onClick={onCerrar} disabled={cargando}>Cancelar</button>
            <button type="submit" className="btn-primario" disabled={cargando}>
              {cargando ? 'Guardando...' : modoEdicion ? 'Actualizar' : 'Crear Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioEmpresa
