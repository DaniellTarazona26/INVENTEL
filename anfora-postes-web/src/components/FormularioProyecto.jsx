import React, { useState, useEffect } from 'react'
import proyectosService from '../services/proyectosService'
import empresasService from '../services/empresasService'
import operadoresService from '../services/operadoresService'
import ciudadesService from '../services/ciudadesService'
import usuariosService from '../services/usuariosService'
import './FormularioModal.css'

const FormularioProyecto = ({ modoEdicion, proyecto, onCerrar, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa_id: '',
    operador_id: '',
    ciudad_id: '',
    numero_solicitud: '',
    fecha_radicado: '',
    fecha_revision: '',
    supervisor_id: '',
    estado: 'activo',
    descripcion: ''
  })
 
  const [empresas, setEmpresas] = useState([])
  const [operadores, setOperadores] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [supervisores, setSupervisores] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    if (modoEdicion && proyecto) {
      setFormData({
        nombre: proyecto.nombre || '',
        empresa_id: proyecto.empresa_id || '',
        operador_id: proyecto.operador_id || '',
        ciudad_id: proyecto.ciudad_id || '',
        numero_solicitud: proyecto.numero_solicitud || '',
        fecha_radicado: proyecto.fecha_radicado || '',
        fecha_revision: proyecto.fecha_revision || '',
        supervisor_id: proyecto.supervisor_id || '',
        estado: proyecto.estado || 'activo',
        descripcion: proyecto.descripcion || ''
      })
    }
  }, [modoEdicion, proyecto])

  const cargarDatos = async () => {
    try {
      const [respEmpresas, respOperadores, respCiudades, respUsuarios] = await Promise.all([
        empresasService.obtenerTodas(),
        operadoresService.obtenerTodos(),
        ciudadesService.obtenerTodas(),
        usuariosService.obtenerTodos()
      ])

      const empresasList = Array.isArray(respEmpresas)
        ? respEmpresas
        : (respEmpresas.empresas || [])

      const operadoresList = Array.isArray(respOperadores)
        ? respOperadores
        : (respOperadores.operadores || [])
     
      const ciudadesList = Array.isArray(respCiudades)
        ? respCiudades
        : (respCiudades.ciudades || [])
     
      const usuariosList = Array.isArray(respUsuarios)
        ? respUsuarios
        : (respUsuarios.usuarios || [])

      setEmpresas(empresasList)
      setOperadores(operadoresList)
      setCiudades(ciudadesList)
     
      const supervisoresList = usuariosList.filter(
        u => u.rol === 'supervisor' || u.rol === 'admin'
      )
      setSupervisores(supervisoresList)

      console.log('Datos cargados:', {
        empresas: empresasList.length,
        operadores: operadoresList.length,
        ciudades: ciudadesList.length,
        supervisores: supervisoresList.length
      })
    } catch (error) {
      console.error('Error cargando datos:', error)
      setEmpresas([])
      setOperadores([])
      setCiudades([])
      setSupervisores([])
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
      if (!formData.nombre) {
        setError('El nombre del proyecto es obligatorio')
        setCargando(false)
        return
      }

      if (!formData.empresa_id) {
        setError('La empresa es obligatoria')
        setCargando(false)
        return
      }

      if (!formData.operador_id) {
        setError('El operador es obligatorio')
        setCargando(false)
        return
      }

      if (!formData.ciudad_id) {
        setError('La ciudad es obligatoria')
        setCargando(false)
        return
      }

      if (modoEdicion) {
        await proyectosService.actualizar(proyecto.id, formData)
        alert('Proyecto actualizado exitosamente')
      } else {
        await proyectosService.crear(formData)
        alert('Proyecto creado exitosamente')
      }

      onGuardar()
      onCerrar()

    } catch (error) {
      console.error('Error guardando proyecto:', error)
      setError(error.response?.data?.error || error.message || 'Error al guardar proyecto')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{modoEdicion ? '✏️ Editar Proyecto' : '➕ Nuevo Proyecto'}</h2>
          <button className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="formulario">
          {error && (
            <div className="form-error">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">
                Nombre del Proyecto <span className="required">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Nombre descriptivo del proyecto"
                disabled={cargando}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="numero_solicitud">Número de Solicitud</label>
              <input
                type="text"
                id="numero_solicitud"
                value={formData.numero_solicitud}
                onChange={(e) => handleChange('numero_solicitud', e.target.value)}
                placeholder="Ej: SOL-2026-001"
                disabled={cargando}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="empresa_id">Empresa <span className="required">*</span></label>
              <select
                id="empresa_id"
                value={formData.empresa_id}
                onChange={(e) => handleChange('empresa_id', e.target.value)}
                disabled={cargando}
                required
              >
                <option value="">Seleccione una empresa</option>
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="operador_id">Operador <span className="required">*</span></label>
              <select
                id="operador_id"
                value={formData.operador_id}
                onChange={(e) => handleChange('operador_id', e.target.value)}
                disabled={cargando}
                required
              >
                <option value="">Seleccione un operador</option>
                {operadores.map(op => (
                  <option key={op.id} value={op.id}>{op.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ciudad_id">Ciudad <span className="required">*</span></label>
              <select
                id="ciudad_id"
                value={formData.ciudad_id}
                onChange={(e) => handleChange('ciudad_id', e.target.value)}
                disabled={cargando}
                required
              >
                <option value="">Seleccione una ciudad</option>
                {ciudades.map(ciudad => (
                  <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="supervisor_id">Supervisor</label>
              <select
                id="supervisor_id"
                value={formData.supervisor_id}
                onChange={(e) => handleChange('supervisor_id', e.target.value)}
                disabled={cargando}
              >
                <option value="">Seleccione un supervisor</option>
                {supervisores.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fecha_radicado">Fecha de Radicado</label>
              <input
                type="date"
                id="fecha_radicado"
                value={formData.fecha_radicado}
                onChange={(e) => handleChange('fecha_radicado', e.target.value)}
                disabled={cargando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha_revision">Fecha de Revisión</label>
              <input
                type="date"
                id="fecha_revision"
                value={formData.fecha_revision}
                onChange={(e) => handleChange('fecha_revision', e.target.value)}
                disabled={cargando}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                value={formData.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
                disabled={cargando}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              placeholder="Descripción detallada del proyecto"
              rows="4"
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
              {cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Proyecto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioProyecto
