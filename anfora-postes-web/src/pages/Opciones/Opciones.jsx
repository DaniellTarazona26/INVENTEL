import React, { useState, useEffect } from 'react'
import usuariosService from '../../services/usuariosService'
import operadoresService from '../../services/operadoresService'
import ciudadesService from '../../services/ciudadesService'
import barriosService from '../../services/barriosService'
import proyectosService from '../../services/proyectosService'
import authService from '../../services/authService'
import FormularioUsuario from '../../components/FormularioUsuario'
import FormularioOperador from '../../components/FormularioOperador'
import FormularioCiudad from '../../components/FormularioCiudad'
import FormularioBarrio from '../../components/FormularioBarrio'
import FormularioProyecto from '../../components/FormularioProyecto'
import './Opciones.css'


const Opciones = () => {
  const [seccionActiva, setSeccionActiva] = useState('proyectos') // ← CAMBIO: Empieza en proyectos
  const [datos, setDatos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [itemSeleccionado, setItemSeleccionado] = useState(null)
  
  const usuario = authService.getUsuarioActual()
  const rol = usuario?.rol || 'CONSULTOR' // ← CAMBIO: Usar rol en mayúsculas
  const esAdmin = rol === 'ADMIN' // ← CAMBIO
  const esInspector = rol === 'INSPECTOR' // ← NUEVO

  // ============================================
  // NUEVO: Definir qué secciones puede ver cada rol
  // ============================================
  const seccionesPermitidas = {
    ADMIN: ['usuarios', 'operadores', 'ciudades', 'barrios', 'proyectos'],
    INSPECTOR: ['proyectos'],
    CONSULTOR: []
  }

  const puedeVerSeccion = (seccion) => {
    return seccionesPermitidas[rol]?.includes(seccion) || false
  }

  // ============================================
  // NUEVO: Si no tiene acceso, mostrar mensaje
  // ============================================
  if (!puedeVerSeccion(seccionActiva) && seccionesPermitidas[rol].length === 0) {
    return (
      <div className="opciones-page">
        <div className="access-denied">
          <span className="icon">🚫</span>
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    )
  }

  // ============================================
  // RESTO DEL CÓDIGO ORIGINAL (sin cambios)
  // ============================================
  useEffect(() => {
    cargarDatos()
  }, [seccionActiva])


  const cargarDatos = async () => {
    setCargando(true)
    setError('')
    
    try {
      let respuesta
      
      switch (seccionActiva) {
        case 'usuarios':
          respuesta = await usuariosService.obtenerTodos()
          break
        case 'operadores':
          respuesta = await operadoresService.obtenerTodos()
          break
        case 'ciudades':
          respuesta = await ciudadesService.obtenerTodas()
          break
        case 'barrios':
          respuesta = await barriosService.obtenerTodos()
          break
        case 'proyectos':
          respuesta = await proyectosService.obtenerTodos()
          break
        default:
          respuesta = []
      }
      
      console.log(`✅ Datos cargados para ${seccionActiva}:`, respuesta)
      
      if (Array.isArray(respuesta)) {
        setDatos(respuesta)
      } else if (respuesta && typeof respuesta === 'object') {
        const arrayKey = Object.keys(respuesta).find(key => Array.isArray(respuesta[key]))
        setDatos(arrayKey ? respuesta[arrayKey] : [])
      } else {
        setDatos([])
      }
      
    } catch (error) {
      console.error('❌ Error cargando datos:', error)
      setError(error.message || 'Error al cargar los datos')
      setDatos([])
    } finally {
      setCargando(false)
    }
  }


  const abrirModalNuevo = () => {
    setModoEdicion(false)
    setItemSeleccionado(null)
    setMostrarModal(true)
  }


  const abrirModalEditar = (item) => {
    setModoEdicion(true)
    setItemSeleccionado(item)
    setMostrarModal(true)
  }


  const cerrarModal = () => {
    setMostrarModal(false)
    setItemSeleccionado(null)
    setModoEdicion(false)
  }


  const eliminarItem = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este registro?')) return


    try {
      switch (seccionActiva) {
        case 'usuarios':
          await usuariosService.eliminar(id)
          break
        case 'operadores':
          await operadoresService.eliminar(id)
          break
        case 'ciudades':
          await ciudadesService.eliminar(id)
          break
        case 'barrios':
          await barriosService.eliminar(id)
          break
        case 'proyectos':
          await proyectosService.eliminar(id)
          break
      }
      
      alert('Registro eliminado exitosamente')
      cargarDatos()
    } catch (error) {
      alert(error.message || 'Error al eliminar')
    }
  }


  const renderTabla = () => {
    if (cargando) {
      return (
        <div className="opciones-loading">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      )
    }


    if (error) {
      return (
        <div className="opciones-error">
          <p>⚠️ {error}</p>
          <button onClick={cargarDatos} className="btn-reintentar">
            Reintentar
          </button>
        </div>
      )
    }


    if (!datos || datos.length === 0) {
      return (
        <div className="opciones-empty">
          <p>No hay registros para mostrar</p>
          {(esAdmin || esInspector) && ( // ← CAMBIO: Inspector también puede agregar proyectos
            <button onClick={abrirModalNuevo} className="btn-agregar">
              + Agregar Nuevo
            </button>
          )}
        </div>
      )
    }


    switch (seccionActiva) {
      case 'usuarios':
        return <TablaUsuarios datos={datos} onEditar={abrirModalEditar} onEliminar={eliminarItem} esAdmin={esAdmin} />
      case 'operadores':
        return <TablaOperadores datos={datos} onEditar={abrirModalEditar} onEliminar={eliminarItem} esAdmin={esAdmin} />
      case 'ciudades':
        return <TablaCiudades datos={datos} onEditar={abrirModalEditar} onEliminar={eliminarItem} esAdmin={esAdmin} />
      case 'barrios':
        return <TablaBarrios datos={datos} onEditar={abrirModalEditar} onEliminar={eliminarItem} esAdmin={esAdmin} />
      case 'proyectos':
        return <TablaProyectos datos={datos} onEditar={abrirModalEditar} onEliminar={eliminarItem} esAdmin={esAdmin || esInspector} /> 
      default:
        return null
    }
  }


  return (
    <div className="opciones-page">
      <div className="opciones-header">
        <h1>⚙️ Opciones y Configuración</h1>
        <p>Gestión de datos maestros del sistema</p>
      </div>


      <div className="opciones-tabs">
        {/* ============================================ */}
        {/* CAMBIO: Solo mostrar tabs permitidas */}
        {/* ============================================ */}
        {puedeVerSeccion('usuarios') && (
          <button 
            className={seccionActiva === 'usuarios' ? 'tab-active' : ''}
            onClick={() => setSeccionActiva('usuarios')}
          >
            👥 Usuarios
          </button>
        )}
        
        {puedeVerSeccion('operadores') && (
          <button 
            className={seccionActiva === 'operadores' ? 'tab-active' : ''}
            onClick={() => setSeccionActiva('operadores')}
          >
            📡 Operadores
          </button>
        )}
        
        {puedeVerSeccion('ciudades') && (
          <button 
            className={seccionActiva === 'ciudades' ? 'tab-active' : ''}
            onClick={() => setSeccionActiva('ciudades')}
          >
            🏙️ Ciudades
          </button>
        )}
        
        {puedeVerSeccion('barrios') && (
          <button 
            className={seccionActiva === 'barrios' ? 'tab-active' : ''}
            onClick={() => setSeccionActiva('barrios')}
          >
            🏘️ Barrios
          </button>
        )}
        
        {puedeVerSeccion('proyectos') && (
          <button 
            className={seccionActiva === 'proyectos' ? 'tab-active' : ''}
            onClick={() => setSeccionActiva('proyectos')}
          >
            📋 Proyectos
          </button>
        )}
      </div>


      <div className="opciones-content">
        <div className="opciones-toolbar">
          <h2>{getTituloSeccion(seccionActiva)}</h2>
          {(esAdmin || (esInspector && seccionActiva === 'proyectos')) && ( // ← CAMBIO
            <button onClick={abrirModalNuevo} className="btn-nuevo">
              + Nuevo {getNombreSeccion(seccionActiva)}
            </button>
          )}
        </div>


        {renderTabla()}
      </div>


      {mostrarModal && seccionActiva === 'usuarios' && (
        <FormularioUsuario
          modoEdicion={modoEdicion}
          usuario={itemSeleccionado}
          onCerrar={cerrarModal}
          onGuardar={cargarDatos}
        />
      )}


      {mostrarModal && seccionActiva === 'operadores' && (
        <FormularioOperador
          modoEdicion={modoEdicion}
          operador={itemSeleccionado}
          onCerrar={cerrarModal}
          onGuardar={cargarDatos}
        />
      )}


      {mostrarModal && seccionActiva === 'ciudades' && (
        <FormularioCiudad
          modoEdicion={modoEdicion}
          ciudad={itemSeleccionado}
          onCerrar={cerrarModal}
          onGuardar={cargarDatos}
        />
      )}


      {mostrarModal && seccionActiva === 'barrios' && (
        <FormularioBarrio
          modoEdicion={modoEdicion}
          barrio={itemSeleccionado}
          onCerrar={cerrarModal}
          onGuardar={cargarDatos}
        />
      )}


      {mostrarModal && seccionActiva === 'proyectos' && (
        <FormularioProyecto
          modoEdicion={modoEdicion}
          proyecto={itemSeleccionado}
          onCerrar={cerrarModal}
          onGuardar={cargarDatos}
        />
      )}
    </div>
  )
}


// ============================================
// TABLAS (sin cambios)
// ============================================

const TablaUsuarios = ({ datos, onEditar, onEliminar, esAdmin }) => (
  <table className="opciones-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Email</th>
        <th>Rol</th>
        <th>Estado</th>
        <th>Teléfono</th>
        {esAdmin && <th>Acciones</th>}
      </tr>
    </thead>
    <tbody>
      {datos.map(item => (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.nombre}</td>
          <td>{item.email}</td>
          <td><span className={`badge badge-${item.rol}`}>{item.rol}</span></td>
          <td><span className={`estado estado-${item.estado}`}>{item.estado}</span></td>
          <td>{item.telefono || '-'}</td>
          {esAdmin && (
            <td className="acciones">
              <button onClick={() => onEditar(item)} className="btn-editar">✏️</button>
              <button onClick={() => onEliminar(item.id)} className="btn-eliminar">🗑️</button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
)


const TablaOperadores = ({ datos, onEditar, onEliminar, esAdmin }) => (
  <table className="opciones-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>NIT</th>
        <th>Contacto</th>
        <th>Teléfono</th>
        <th>Estado</th>
        {esAdmin && <th>Acciones</th>}
      </tr>
    </thead>
    <tbody>
      {datos.map(item => (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.nombre}</td>
          <td>{item.nit || '-'}</td>
          <td>{item.contacto || '-'}</td>
          <td>{item.telefono || '-'}</td>
          <td><span className={`estado estado-${item.estado}`}>{item.estado}</span></td>
          {esAdmin && (
            <td className="acciones">
              <button onClick={() => onEditar(item)} className="btn-editar">✏️</button>
              <button onClick={() => onEliminar(item.id)} className="btn-eliminar">🗑️</button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
)


const TablaCiudades = ({ datos, onEditar, onEliminar, esAdmin }) => (
  <table className="opciones-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Código</th>
        <th>Departamento</th>
        {esAdmin && <th>Acciones</th>}
      </tr>
    </thead>
    <tbody>
      {datos.map(item => (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.nombre}</td>
          <td>{item.codigo || '-'}</td>
          <td>{item.departamento || '-'}</td>
          {esAdmin && (
            <td className="acciones">
              <button onClick={() => onEditar(item)} className="btn-editar">✏️</button>
              <button onClick={() => onEliminar(item.id)} className="btn-eliminar">🗑️</button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
)


const TablaBarrios = ({ datos, onEditar, onEliminar, esAdmin }) => (
  <table className="opciones-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Ciudad</th>
        {esAdmin && <th>Acciones</th>}
      </tr>
    </thead>
    <tbody>
      {datos.map(item => (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.nombre}</td>
          <td>{item.ciudad_nombre || '-'}</td>
          {esAdmin && (
            <td className="acciones">
              <button onClick={() => onEditar(item)} className="btn-editar">✏️</button>
              <button onClick={() => onEliminar(item.id)} className="btn-eliminar">🗑️</button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
)


const TablaProyectos = ({ datos, onEditar, onEliminar, esAdmin }) => (
  <table className="opciones-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Empresa</th>
        <th>Ciudad</th>
        <th>N° Solicitud</th>
        <th>Estado</th>
        {esAdmin && <th>Acciones</th>}
      </tr>
    </thead>
    <tbody>
      {datos.map(item => (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.nombre}</td>
          <td>{item.empresa_nombre || '-'}</td>
          <td>{item.ciudad_nombre || '-'}</td>
          <td>{item.numero_solicitud || '-'}</td>
          <td><span className={`estado estado-${item.estado}`}>{item.estado}</span></td>
          {esAdmin && (
            <td className="acciones">
              <button onClick={() => onEditar(item)} className="btn-editar">✏️</button>
              <button onClick={() => onEliminar(item.id)} className="btn-eliminar">🗑️</button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
)


const getTituloSeccion = (seccion) => {
  const titulos = {
    usuarios: 'Gestión de Usuarios',
    operadores: 'Gestión de Operadores',
    ciudades: 'Gestión de Ciudades',
    barrios: 'Gestión de Barrios',
    proyectos: 'Gestión de Proyectos'
  }
  return titulos[seccion] || ''
}


const getNombreSeccion = (seccion) => {
  const nombres = {
    usuarios: 'Usuario',
    operadores: 'Operador',
    ciudades: 'Ciudad',
    barrios: 'Barrio',
    proyectos: 'Proyecto'
  }
  return nombres[seccion] || ''
}


export default Opciones
