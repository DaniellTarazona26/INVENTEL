// src/components/FormularioOperador.jsx
import React, { useState, useEffect } from 'react'
import operadoresService from '../services/operadoresService'
import './FormularioModal.css'

const FormularioOperador = ({ modoEdicion, operador, onCerrar, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    contacto: '',
    telefono: '',
    email: ''
  })
  
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (modoEdicion && operador) {
      setFormData({
        nombre: operador.nombre || '',
        nit: operador.nit || '',
        contacto: operador.contacto || '',
        telefono: operador.telefono || '',
        email: operador.email || ''
      })
    }
  }, [modoEdicion, operador])

  const handleChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      if (!formData.nombre) {
        setError('El nombre es obligatorio')
        setCargando(false)
        return
      }

      if (modoEdicion) {
        await operadoresService.actualizar(operador.id, formData)
        alert('Operador actualizado exitosamente')
      } else {
        await operadoresService.crear(formData)
        alert('Operador creado exitosamente')
      }

      onGuardar()
      onCerrar()

    } catch (error) {
      console.error('Error guardando operador:', error)
      setError(error.response?.data?.error || 'Error al guardar operador')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{modoEdicion ? '✏️ Editar Operador' : '➕ Nuevo Operador'}</h2>
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
            <label htmlFor="nombre">
              Nombre del Operador <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: CLARO, MOVISTAR, TIGO"
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nit">NIT</label>
            <input
              type="text"
              id="nit"
              value={formData.nit}
              onChange={(e) => handleChange('nit', e.target.value)}
              placeholder="Ej: 900123456-7"
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contacto">Persona de Contacto</label>
            <input
              type="text"
              id="contacto"
              value={formData.contacto}
              onChange={(e) => handleChange('contacto', e.target.value)}
              placeholder="Nombre del contacto principal"
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="+57 300 123 4567"
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contacto@operador.com"
              disabled={cargando}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secundario" 
              onClick={onCerrar}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primario"
              disabled={cargando}
            >
              {cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Operador')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioOperador
