import React, { useState, useEffect } from 'react'
import barriosService from '../services/barriosService'
import ciudadesService from '../services/ciudadesService'
import './FormularioModal.css'

const FormularioBarrio = ({ modoEdicion, barrio, onCerrar, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    ciudad_id: ''
  })
  
  const [ciudades, setCiudades] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarCiudades()
    
    if (modoEdicion && barrio) {
      setFormData({
        nombre: barrio.nombre || '',
        ciudad_id: barrio.ciudad_id || ''
      })
    }
  }, [modoEdicion, barrio])

  const cargarCiudades = async () => {
    try {
      const respuesta = await ciudadesService.obtenerTodas()
      // CORREGIDO: respuesta es array directo, no {ciudades: [...]}
      setCiudades(Array.isArray(respuesta) ? respuesta : [])
      console.log('Ciudades cargadas:', respuesta)
    } catch (error) {
      console.error('Error cargando ciudades:', error)
      setCiudades([])
    }
  }

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
      if (!formData.nombre || !formData.ciudad_id) {
        setError('El nombre y la ciudad son obligatorios')
        setCargando(false)
        return
      }

      if (modoEdicion) {
        await barriosService.actualizar(barrio.id, formData)
        alert('Barrio actualizado exitosamente')
      } else {
        await barriosService.crear(formData)
        alert('Barrio creado exitosamente')
      }

      onGuardar()
      onCerrar()

    } catch (error) {
      console.error('Error guardando barrio:', error)
      setError(error.response?.data?.error || error.message || 'Error al guardar barrio')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{modoEdicion ? '✏️ Editar Barrio' : '➕ Nuevo Barrio'}</h2>
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
            <label htmlFor="ciudad_id">
              Ciudad <span className="required">*</span>
            </label>
            <select
              id="ciudad_id"
              value={formData.ciudad_id}
              onChange={(e) => handleChange('ciudad_id', e.target.value)}
              disabled={cargando}
              required
            >
              <option value="">Seleccione una ciudad</option>
              {ciudades.map(ciudad => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="nombre">
              Nombre del Barrio <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: CABECERA, CENTRO, PROVENZA"
              disabled={cargando}
              required
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
              {cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Barrio')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioBarrio
