// src/components/FormularioCiudad.jsx
import React, { useState, useEffect } from 'react'
import ciudadesService from '../services/ciudadesService'
import './FormularioModal.css'

const FormularioCiudad = ({ modoEdicion, ciudad, onCerrar, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    departamento: ''
  })
  
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (modoEdicion && ciudad) {
      setFormData({
        nombre: ciudad.nombre || '',
        codigo: ciudad.codigo || '',
        departamento: ciudad.departamento || ''
      })
    }
  }, [modoEdicion, ciudad])

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
        await ciudadesService.actualizar(ciudad.id, formData)
        alert('Ciudad actualizada exitosamente')
      } else {
        await ciudadesService.crear(formData)
        alert('Ciudad creada exitosamente')
      }

      onGuardar()
      onCerrar()

    } catch (error) {
      console.error('Error guardando ciudad:', error)
      setError(error.response?.data?.error || 'Error al guardar ciudad')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{modoEdicion ? '✏️ Editar Ciudad' : '➕ Nueva Ciudad'}</h2>
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
              Nombre de la Ciudad <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: BUCARAMANGA, CUCUTA"
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigo">Código</label>
            <input
              type="text"
              id="codigo"
              value={formData.codigo}
              onChange={(e) => handleChange('codigo', e.target.value)}
              placeholder="Código DANE o interno"
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="departamento">Departamento</label>
            <input
              type="text"
              id="departamento"
              value={formData.departamento}
              onChange={(e) => handleChange('departamento', e.target.value)}
              placeholder="Ej: Santander, Norte de Santander"
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
              {cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Ciudad')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioCiudad
