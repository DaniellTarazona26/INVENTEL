import React, { useState, useEffect } from 'react'
import './AgregarOperadores.css'
import inventarioService from '../../services/inventarioService'
import inventarioOperadoresService from '../../services/inventarioOperadoresService'

const OPCIONES = {
  herrajes: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  cables: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
  telefonico_utp_guaya: ['0', '1', '2', '3', '4', '5'],
  marquilla: ['', 'NO', 'SI'],
  cruce: ['', '0', '1'],
  cruce_estado: ['', 'BUENO', 'MAL ESTADO'],
  chipa_raqueta: ['', 'CHIPA', 'RAQUETA'],
  ubicacion: ['', 'POSTE', 'VANO'],
  caja_empalme: ['0', '1'],
  bajante_cables: ['', 'BUENO', 'MAL ESTADO'],
  bajante_diametro: ['', '1', '1.5', '2', '3', '4'],
  bajante_material: ['', 'GALVANIZADO', 'EMT', 'PVC']
}

const ACTIVOS_EXISTENTES = [
  'AMPLIFICADOR',
  'NODO OPTICO',
  'FUENTE DE PODER',
  'AMPLIFICADOR A 110V',
  'NODO OPTICO A 110V',
  'FUENTE DE PODER A 110V',
  'SWITCH A 110V'
]

const PASIVOS_EXISTENTES = [
  'CAJA NAP',
  'CAJA DE EMPALME',
  'RESERVA',
  'BAJANTE'
]

const OBSERVACIONES_PREDEFINIDAS = [
  'TENDIDO EN BUEN ESTADO',
  'CABLE PASA POR ENCIMA DE BAJA TENSIÓN',
  'CABLE DISTENSIONADO',
  'CABLE MUY TENSIONADO',
  'CABLE SIN ANCLAR AL POSTE',
  'ACTIVO NO CUMPLE CON DISTANCIAS DE SEGURIDAD CON PREDIO',
  'POSTE SATURADO POR ELEMENTOS DEL OPERADOR',
  'REDES EN DESUSO'
]

const AgregarOperadores = ({ setCurrentPage }) => {
  
  const inventarioId = localStorage.getItem('inventarioParcialId')
  const operadoresSeleccionados = JSON.parse(localStorage.getItem('operadoresSeleccionados') || '[]')

  const [inventario, setInventario] = useState(null)
  const [operadorActual, setOperadorActual] = useState(0)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [modoEdicion, setModoEdicion] = useState(false)
  const [allowNavigation, setAllowNavigation] = useState(false)

  const formDataInicial = {
    herrajes: '',
    coaxial: '',
    telefonico: '',
    fibra_optica: '',
    utp: '',
    guaya: '',
    marquilla: '',
    cruce_via: '',
    cruce_estado: '',
    cruce_diagonal: '',
    cruce_sin_red: '',
    cruce_acometida: '',
    cruce_desalineado: '',
    activo_amplificador: false,
    activo_nodo_optico: false,
    activo_fuente_poder: false,
    activo_amplificador_110v: false,
    activo_nodo_optico_110v: false,
    activo_fuente_poder_110v: false,
    activo_switch_110v: false,
    pasivo_caja_nap: false,
    pasivo_caja_empalme: false,
    pasivo_reserva: false,
    pasivo_bajante: false,
    reserva1: '',
    reserva1_chipa_raqueta: '',
    reserva1_ubicacion: '',
    reserva1_marquilla: '',
    reserva2: '',
    reserva2_chipa_raqueta: '',
    reserva2_ubicacion: '',
    reserva2_marquilla: '',
    caja1: '',
    caja1_ubicacion: '',
    caja1_marquilla: '',
    caja2: '',
    caja2_ubicacion: '',
    caja2_marquilla: '',
    caja3: '',
    caja3_ubicacion: '',
    caja3_marquilla: '',
    empalme1: '',
    empalme1_ubicacion: '',
    empalme1_marquilla: '',
    empalme2: '',
    empalme2_ubicacion: '',
    empalme2_marquilla: '',
    empalme3: '',
    empalme3_ubicacion: '',
    empalme3_marquilla: '',
    empalme4: '',
    empalme4_ubicacion: '',
    empalme4_marquilla: '',
    bajante1: '',
    bajante1_cables: '',
    bajante1_diametro: '',
    bajante1_material: '',
    bajante1_fibra: '',
    bajante1_telefonico: '',
    bajante1_utp: '',
    bajante1_coaxial: '',
    observaciones: '',
    observaciones_checkboxes: []
  }

  const [datosOperadores, setDatosOperadores] = useState({})

  useEffect(() => {
    const editarId = localStorage.getItem('editarInventarioId')
    
    if (editarId) {
      setModoEdicion(true)
      cargarDatosEdicion(editarId)
    } else {
      if (!inventarioId || operadoresSeleccionados.length === 0) {
        mostrarMensaje('error', 'No hay inventario o operadores seleccionados')
        setTimeout(() => setCurrentPage('agregar'), 2000)
        return
      }

      cargarInventario()
      inicializarDatosOperadores()
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!allowNavigation) {
        e.preventDefault()
        e.returnValue = '¿Estás seguro de que quieres salir? Los datos de operadores se perderán.'
        return e.returnValue
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [allowNavigation])

  const cargarInventario = async () => {
    try {
      const response = await inventarioService.obtenerPorId(inventarioId)
      if (response.success) {
        setInventario(response.inventario)
      }
    } catch (error) {
      console.error('Error cargando inventario:', error)
      mostrarMensaje('error', 'Error al cargar inventario')
    }
  }

  const cargarDatosEdicion = async (idInventario) => {
    try {
      setLoading(true)
      const response = await inventarioService.obtenerPorId(idInventario)
      
      if (response.success) {
        setInventario(response.inventario)
        
        if (response.inventario.operadores && response.inventario.operadores.length > 0) {
          const ops = response.inventario.operadores
          localStorage.setItem('operadoresSeleccionados', JSON.stringify(ops))
          
          const datosOps = {}
          ops.forEach(op => {
            datosOps[op] = { ...formDataInicial }
          })
          
          setDatosOperadores(datosOps)
        } else {
          inicializarDatosOperadores()
        }
      }
    } catch (error) {
      console.error('Error cargando datos para edición:', error)
      mostrarMensaje('error', 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const inicializarDatosOperadores = () => {
    const inicial = {}
    operadoresSeleccionados.forEach(operador => {
      inicial[operador] = { ...formDataInicial }
    })
    setDatosOperadores(inicial)
  }

  const calcularTotalCables = (datos) => {
    const coaxial = parseInt(datos.coaxial || 0)
    const telefonico = parseInt(datos.telefonico || 0)
    const fibra = parseInt(datos.fibra_optica || 0)
    const utp = parseInt(datos.utp || 0)
    return coaxial + telefonico + fibra + utp
  }

  const handleInputChange = (operador, campo, valor) => {
    setDatosOperadores(prev => ({
      ...prev,
      [operador]: {
        ...prev[operador],
        [campo]: valor
      }
    }))
  }

  const toggleCheckbox = (operador, campo) => {
    setDatosOperadores(prev => ({
      ...prev,
      [operador]: {
        ...prev[operador],
        [campo]: !prev[operador][campo]
      }
    }))
  }

  const toggleObservacion = (operador, obs) => {
    setDatosOperadores(prev => {
      const observacionesActuales = prev[operador].observaciones_checkboxes || []
      const nuevasObservaciones = observacionesActuales.includes(obs)
        ? observacionesActuales.filter(o => o !== obs)
        : [...observacionesActuales, obs]
      
      return {
        ...prev,
        [operador]: {
          ...prev[operador],
          observaciones_checkboxes: nuevasObservaciones
        }
      }
    })
  }

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => {
      setMensaje({ tipo: '', texto: '' })
    }, 5000)
  }

  const handleSiguiente = () => {
    if (operadorActual < operadoresSeleccionados.length - 1) {
      setOperadorActual(operadorActual + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleAnterior = () => {
    if (operadorActual > 0) {
      setOperadorActual(operadorActual - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleGuardarTodo = async () => {
    try {
      setLoading(true)

      for (const operador of operadoresSeleccionados) {
        const datos = datosOperadores[operador]
        
        await inventarioOperadoresService.crear(
          inventarioId,
          operador,
          datos
        )
      }

      await inventarioService.completarConOperadores(inventarioId)

      setAllowNavigation(true)

      mostrarMensaje('success', '✅ Inventario completado exitosamente')

      setTimeout(() => {
        localStorage.removeItem('inventarioParcialId')
        localStorage.removeItem('operadoresSeleccionados')
        localStorage.removeItem('editarInventarioId')
        setCurrentPage('inventario')
      }, 2000)

    } catch (error) {
      console.error('Error guardando datos:', error)
      mostrarMensaje('error', '❌ Error al guardar datos de operadores')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = () => {
    if (window.confirm('¿Está seguro de cancelar? Se perderán todos los datos de operadores ingresados.')) {
      setAllowNavigation(true)
      localStorage.removeItem('inventarioParcialId')
      localStorage.removeItem('operadoresSeleccionados')
      localStorage.removeItem('editarInventarioId')
      setCurrentPage('inventario')
    }
  }

  if (!inventarioId || operadoresSeleccionados.length === 0) {
    return (
      <div className="agregar-operadores-page">
        <div className="mensaje mensaje-error">
          No hay datos de inventario. Redirigiendo...
        </div>
      </div>
    )
  }

  const operadorNombre = operadoresSeleccionados[operadorActual]
  const datosActuales = datosOperadores[operadorNombre] || formDataInicial
  const totalCables = calcularTotalCables(datosActuales)

  return (
    <div className="agregar-operadores-page">
      <div className="header-section">
        <h2 className="page-title">
          📡 INFORMACIÓN DE OPERADORES
        </h2>
        {inventario && (
          <div className="inventario-info">
            <span><strong>WayPoint:</strong> {inventario.waypoint}</span>
            <span><strong>Dirección:</strong> {inventario.direccion_completa || '-'}</span>
          </div>
        )}
      </div>

      {mensaje.texto && (
        <div className={`mensaje mensaje-${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Guardando datos...</p>
        </div>
      )}

      <div className="operadores-navegacion">
        <button 
          className="btn-nav"
          onClick={handleAnterior}
          disabled={operadorActual === 0}
        >
          ← Anterior
        </button>

        <div className="operador-actual">
          <h3>{operadorNombre}</h3>
          <span className="operador-contador">
            Operador {operadorActual + 1} de {operadoresSeleccionados.length}
          </span>
        </div>

        <button 
          className="btn-nav"
          onClick={handleSiguiente}
          disabled={operadorActual === operadoresSeleccionados.length - 1}
        >
          Siguiente →
        </button>
      </div>

      <div className="operadores-tabs">
        {operadoresSeleccionados.map((op, idx) => (
          <button
            key={op}
            className={`tab ${idx === operadorActual ? 'active' : ''}`}
            onClick={() => {
              setOperadorActual(idx)
              window.scrollTo(0, 0)
            }}
          >
            {op}
          </button>
        ))}
      </div>

      <section className="form-section">
        <h3 className="section-title">NIVELES OCUPACIÓN</h3>
        <div className="section-content">
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Herrajes:</label>
              <select
                value={datosActuales.herrajes}
                onChange={(e) => handleInputChange(operadorNombre, 'herrajes', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.herrajes.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Coaxial:</label>
              <select
                value={datosActuales.coaxial}
                onChange={(e) => handleInputChange(operadorNombre, 'coaxial', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.cables.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Telefónico:</label>
              <select
                value={datosActuales.telefonico}
                onChange={(e) => handleInputChange(operadorNombre, 'telefonico', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.telefonico_utp_guaya.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Fibra Óptica:</label>
              <select
                value={datosActuales.fibra_optica}
                onChange={(e) => handleInputChange(operadorNombre, 'fibra_optica', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.cables.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>UTP:</label>
              <select
                value={datosActuales.utp}
                onChange={(e) => handleInputChange(operadorNombre, 'utp', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.telefonico_utp_guaya.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Guaya:</label>
              <select
                value={datosActuales.guaya}
                onChange={(e) => handleInputChange(operadorNombre, 'guaya', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.telefonico_utp_guaya.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group"></div>
            <div className="form-group"></div>
          </div>

          <div className="form-grid form-grid-1" style={{ textAlign: 'right' }}>
            <div className="form-group">
              <label style={{ textAlign: 'right', fontWeight: 'bold' }}>Total de Cables:</label>
              <input
                type="text"
                value={totalCables}
                readOnly
                disabled
                className="total-cables-display"
                style={{ textAlign: 'right', maxWidth: '200px', marginLeft: 'auto' }}
              />
            </div>
          </div>

          <div className="form-grid-marquilla">
            <div></div>
            <div className="form-group">
              <label>Marquilla:</label>
              <select
                value={datosActuales.marquilla}
                onChange={(e) => handleInputChange(operadorNombre, 'marquilla', e.target.value)}
              >
                {OPCIONES.marquilla.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="section-title">CRUCE EN VIA</h3>
        <div className="section-content">
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Cruce en vía:</label>
              <select
                value={datosActuales.cruce_via}
                onChange={(e) => handleInputChange(operadorNombre, 'cruce_via', e.target.value)}
              >
                {OPCIONES.cruce.map(opt => (
                  <option key={opt} value={opt}>{opt === '' ? '-' : opt === '0' ? 'NO' : 'SI'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Estado:</label>
              <select
                value={datosActuales.cruce_estado}
                onChange={(e) => handleInputChange(operadorNombre, 'cruce_estado', e.target.value)}
                disabled={datosActuales.cruce_via !== '1'}
              >
                {OPCIONES.cruce_estado.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Diagonal:</label>
              <select
                value={datosActuales.cruce_diagonal}
                onChange={(e) => handleInputChange(operadorNombre, 'cruce_diagonal', e.target.value)}
                disabled={datosActuales.cruce_via !== '1'}
              >
                {OPCIONES.cruce.map(opt => (
                  <option key={opt} value={opt}>{opt === '' ? '-' : opt === '0' ? 'NO' : 'SI'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Sin red:</label>
              <select
                value={datosActuales.cruce_sin_red}
                onChange={(e) => handleInputChange(operadorNombre, 'cruce_sin_red', e.target.value)}
                disabled={datosActuales.cruce_via !== '1'}
              >
                {OPCIONES.cruce.map(opt => (
                  <option key={opt} value={opt}>{opt === '' ? '-' : opt === '0' ? 'NO' : 'SI'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Acometida:</label>
              <select
                value={datosActuales.cruce_acometida}
                onChange={(e) => handleInputChange(operadorNombre, 'cruce_acometida', e.target.value)}
                disabled={datosActuales.cruce_via !== '1'}
              >
                {OPCIONES.cruce.map(opt => (
                  <option key={opt} value={opt}>{opt === '' ? '-' : opt === '0' ? 'NO' : 'SI'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Desalineado:</label>
              <select
                value={datosActuales.cruce_desalineado}
                onChange={(e) => handleInputChange(operadorNombre, 'cruce_desalineado', e.target.value)}
                disabled={datosActuales.cruce_via !== '1'}
              >
                {OPCIONES.cruce.map(opt => (
                  <option key={opt} value={opt}>{opt === '' ? '-' : opt === '0' ? 'NO' : 'SI'}</option>
                ))}
              </select>
            </div>
            <div className="form-group"></div>
            <div className="form-group"></div>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="section-title">ACTIVOS EXISTENTES</h3>
        <div className="section-content">
          <div className="checkboxes-grid">
            {ACTIVOS_EXISTENTES.map(activo => {
              const campo = `activo_${activo.toLowerCase().replace(/ /g, '_').replace(/ó/g, 'o')}`
              return (
                <div key={activo} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`${operadorNombre}-${campo}`}
                    checked={datosActuales[campo] || false}
                    onChange={() => toggleCheckbox(operadorNombre, campo)}
                  />
                  <label htmlFor={`${operadorNombre}-${campo}`}>{activo}</label>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="section-title">PASIVOS EXISTENTES</h3>
        <div className="section-content">
          <div className="checkboxes-grid">
            {PASIVOS_EXISTENTES.map(pasivo => {
              const campo = `pasivo_${pasivo.toLowerCase().replace(/ /g, '_')}`
              return (
                <div key={pasivo} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`${operadorNombre}-${campo}`}
                    checked={datosActuales[campo] || false}
                    onChange={() => toggleCheckbox(operadorNombre, campo)}
                  />
                  <label htmlFor={`${operadorNombre}-${campo}`}>{pasivo}</label>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="section-title">RESERVAS DE CABLE</h3>
        <div className="section-content">
          <h4 className="subsection-title">Reserva #1</h4>
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Reserva:</label>
              <select
                value={datosActuales.reserva1}
                onChange={(e) => handleInputChange(operadorNombre, 'reserva1', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.cables.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Chipa / Raqueta:</label>
              <select
                value={datosActuales.reserva1_chipa_raqueta}
                onChange={(e) => handleInputChange(operadorNombre, 'reserva1_chipa_raqueta', e.target.value)}
              >
                {OPCIONES.chipa_raqueta.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ubicación:</label>
              <select
                value={datosActuales.reserva1_ubicacion}
                onChange={(e) => handleInputChange(operadorNombre, 'reserva1_ubicacion', e.target.value)}
              >
                {OPCIONES.ubicacion.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Marquilla:</label>
              <select
                value={datosActuales.reserva1_marquilla}
                onChange={(e) => handleInputChange(operadorNombre, 'reserva1_marquilla', e.target.value)}
              >
                {OPCIONES.marquilla.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>
          </div>

          <h4 className="subsection-title">Reserva #2</h4>
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Reserva:</label>
              <select
                value={datosActuales.reserva2}
                onChange={(e) => handleInputChange(operadorNombre, 'reserva2', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.cables.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Chipa / Raqueta:</label>
              <select
                value={datosActuales.reserva2_chipa_raqueta}
                onChange={(e) => handleInputChange(operadorNombre, 'reserva2_chipa_raqueta', e.target.value)}
              >
                {OPCIONES.chipa_raqueta.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ubicación:</label>
              <select
                value={datosActuales.reserva2_ubicacion}
                onChange={(e) => handleInputChange(operadorNombre, 'reserva2_ubicacion', e.target.value)}
              >
                {OPCIONES.ubicacion.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Marquilla:</label>
              <select
                value={datosActuales.reserva2_marquilla}
                onChange={(e) => handleInputChange(operadorNombre, 'reserva2_marquilla', e.target.value)}
              >
                {OPCIONES.marquilla.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="section-title">CAJAS DE DISTRIBUCIÓN</h3>
        <div className="section-content">
          <h4 className="subsection-title">Caja #1</h4>
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Caja:</label>
              <select
                value={datosActuales.caja1}
                onChange={(e) => handleInputChange(operadorNombre, 'caja1', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.caja_empalme.map(opt => (
                  <option key={opt} value={opt}>{opt === '0' ? 'NO' : 'SI'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ubicación:</label>
              <select
                value={datosActuales.caja1_ubicacion}
                onChange={(e) => handleInputChange(operadorNombre, 'caja1_ubicacion', e.target.value)}
                disabled={datosActuales.caja1 !== '1'}
              >
                {OPCIONES.ubicacion.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Marquilla:</label>
              <select
                value={datosActuales.caja1_marquilla}
                onChange={(e) => handleInputChange(operadorNombre, 'caja1_marquilla', e.target.value)}
                disabled={datosActuales.caja1 !== '1'}
              >
                {OPCIONES.marquilla.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>
            <div className="form-group"></div>
          </div>

          <h4 className="subsection-title">Caja #2</h4>
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Caja:</label>
              <select
                value={datosActuales.caja2}
                onChange={(e) => handleInputChange(operadorNombre, 'caja2', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.caja_empalme.map(opt => (
                  <option key={opt} value={opt}>{opt === '0' ? 'NO' : 'SI'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ubicación:</label>
              <select
                value={datosActuales.caja2_ubicacion}
                onChange={(e) => handleInputChange(operadorNombre, 'caja2_ubicacion', e.target.value)}
                disabled={datosActuales.caja2 !== '1'}
              >
                {OPCIONES.ubicacion.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Marquilla:</label>
              <select
                value={datosActuales.caja2_marquilla}
                onChange={(e) => handleInputChange(operadorNombre, 'caja2_marquilla', e.target.value)}
                disabled={datosActuales.caja2 !== '1'}
              >
                {OPCIONES.marquilla.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>
            <div className="form-group"></div>
          </div>

          <h4 className="subsection-title">Caja #3</h4>
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Caja:</label>
              <select
                value={datosActuales.caja3}
                onChange={(e) => handleInputChange(operadorNombre, 'caja3', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.caja_empalme.map(opt => (
                  <option key={opt} value={opt}>{opt === '0' ? 'NO' : 'SI'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ubicación:</label>
              <select
                value={datosActuales.caja3_ubicacion}
                onChange={(e) => handleInputChange(operadorNombre, 'caja3_ubicacion', e.target.value)}
                disabled={datosActuales.caja3 !== '1'}
              >
                {OPCIONES.ubicacion.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Marquilla:</label>
              <select
                value={datosActuales.caja3_marquilla}
                onChange={(e) => handleInputChange(operadorNombre, 'caja3_marquilla', e.target.value)}
                disabled={datosActuales.caja3 !== '1'}
              >
                {OPCIONES.marquilla.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>
            <div className="form-group"></div>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="section-title">EMPALMES</h3>
        <div className="section-content">
          {[1, 2, 3, 4].map(num => (
            <div key={num}>
              <h4 className="subsection-title">Empalme #{num}</h4>
              <div className="form-grid form-grid-4">
                <div className="form-group">
                  <label>Empalme:</label>
                  <select
                    value={datosActuales[`empalme${num}`]}
                    onChange={(e) => handleInputChange(operadorNombre, `empalme${num}`, e.target.value)}
                  >
                    <option value="">-</option>
                    {OPCIONES.caja_empalme.map(opt => (
                      <option key={opt} value={opt}>{opt === '0' ? 'NO' : 'SI'}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ubicación:</label>
                  <select
                    value={datosActuales[`empalme${num}_ubicacion`]}
                    onChange={(e) => handleInputChange(operadorNombre, `empalme${num}_ubicacion`, e.target.value)}
                    disabled={datosActuales[`empalme${num}`] !== '1'}
                  >
                    {OPCIONES.ubicacion.map(opt => (
                      <option key={opt} value={opt}>{opt || '-'}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Marquilla:</label>
                  <select
                    value={datosActuales[`empalme${num}_marquilla`]}
                    onChange={(e) => handleInputChange(operadorNombre, `empalme${num}_marquilla`, e.target.value)}
                    disabled={datosActuales[`empalme${num}`] !== '1'}
                  >
                    {OPCIONES.marquilla.map(opt => (
                      <option key={opt} value={opt}>{opt || '-'}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="form-section">
        <h3 className="section-title">BAJANTES</h3>
        <div className="section-content">
          <h4 className="subsection-title">Bajante #1</h4>
          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Bajante:</label>
              <select
                value={datosActuales.bajante1}
                onChange={(e) => handleInputChange(operadorNombre, 'bajante1', e.target.value)}
              >
                <option value="">-</option>
                {OPCIONES.caja_empalme.map(opt => (
                  <option key={opt} value={opt}>{opt === '0' ? 'NO' : 'SI'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Estado Cables:</label>
              <select
                value={datosActuales.bajante1_cables}
                onChange={(e) => handleInputChange(operadorNombre, 'bajante1_cables', e.target.value)}
                disabled={datosActuales.bajante1 !== '1'}
              >
                {OPCIONES.bajante_cables.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Diámetro:</label>
              <select
                value={datosActuales.bajante1_diametro}
                onChange={(e) => handleInputChange(operadorNombre, 'bajante1_diametro', e.target.value)}
                disabled={datosActuales.bajante1 !== '1'}
              >
                {OPCIONES.bajante_diametro.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Material:</label>
              <select
                value={datosActuales.bajante1_material}
                onChange={(e) => handleInputChange(operadorNombre, 'bajante1_material', e.target.value)}
                disabled={datosActuales.bajante1 !== '1'}
              >
                {OPCIONES.bajante_material.map(opt => (
                  <option key={opt} value={opt}>{opt || '-'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid form-grid-4">
            <div className="form-group">
              <label>Fibra:</label>
              <select
                value={datosActuales.bajante1_fibra}
                onChange={(e) => handleInputChange(operadorNombre, 'bajante1_fibra', e.target.value)}
                disabled={datosActuales.bajante1 !== '1'}
              >
                <option value="">-</option>
                {OPCIONES.cables.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Telefónico:</label>
              <select
                value={datosActuales.bajante1_telefonico}
                onChange={(e) => handleInputChange(operadorNombre, 'bajante1_telefonico', e.target.value)}
                disabled={datosActuales.bajante1 !== '1'}
              >
                <option value="">-</option>
                {OPCIONES.cables.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>UTP:</label>
              <select
                value={datosActuales.bajante1_utp}
                onChange={(e) => handleInputChange(operadorNombre, 'bajante1_utp', e.target.value)}
                disabled={datosActuales.bajante1 !== '1'}
              >
                <option value="">-</option>
                {OPCIONES.cables.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Coaxial:</label>
              <select
                value={datosActuales.bajante1_coaxial}
                onChange={(e) => handleInputChange(operadorNombre, 'bajante1_coaxial', e.target.value)}
                disabled={datosActuales.bajante1 !== '1'}
              >
                <option value="">-</option>
                {OPCIONES.cables.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="section-title">OBSERVACIONES OPERADOR</h3>
        <div className="section-content">
          <div className="checkboxes-grid">
            {OBSERVACIONES_PREDEFINIDAS.map(obs => (
              <div key={obs} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`${operadorNombre}-obs-${obs}`}
                  checked={datosActuales.observaciones_checkboxes?.includes(obs) || false}
                  onChange={() => toggleObservacion(operadorNombre, obs)}
                />
                <label htmlFor={`${operadorNombre}-obs-${obs}`}>{obs}</label>
              </div>
            ))}
          </div>

          <div className="form-grid form-grid-1">
            <div className="form-group">
              <label>Observaciones adicionales:</label>
              <textarea
                rows="4"
                placeholder="Escribe observaciones adicionales..."
                value={datosActuales.observaciones}
                onChange={(e) => handleInputChange(operadorNombre, 'observaciones', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="botones-accion">
        <button 
          className="btn-cancelar"
          onClick={handleCancelar}
          disabled={loading}
        >
          ✖ Cancelar
        </button>

        <div className="botones-navegacion">
          <button 
            type="button"
            className="btn-secondary"
            onClick={() => {
              setAllowNavigation(true)
              const editarId = localStorage.getItem('editarInventarioId')
              if (editarId) {
                localStorage.setItem('editarInventarioId', editarId)
              }
              setCurrentPage('agregar-poste')
            }}
            disabled={loading}
          >
            ← Anterior Página
          </button>

          {operadorActual < operadoresSeleccionados.length - 1 ? (
            <button 
              className="btn-primary"
              onClick={handleSiguiente}
              disabled={loading}
            >
              Siguiente Operador →
            </button>
          ) : (
            <button 
              className="btn-guardar"
              onClick={handleGuardarTodo}
              disabled={loading}
            >
              💾 Guardar Todo
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgregarOperadores
