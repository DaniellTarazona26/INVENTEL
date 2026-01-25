// src/pages/Opciones/CambiarDatos.jsx
import React, { useState } from 'react'
import './OpcionesComun.css'

const CambiarDatos = () => {
  const [menuSeleccionado, setMenuSeleccionado] = useState('identificacion')
  const [datos, setDatos] = useState({
    nombre: 'GEÖRLIN',
    direccion: '',
    telefono: '',
    correo: ''
  })

  const menuOpciones = [
    { id: 'identificacion', label: 'Cambiar Identificación' },
    { id: 'contrasena', label: 'Cambiar Contraseña' },
    { id: 'correo', label: 'Cambiar Correo' },
    { id: 'pregunta', label: 'Cambiar Pregunta y Respuesta' }
  ]

  return (
    <div className="cambiar-datos-container">
      <h2 className="seccion-titulo">Cambiar Datos</h2>

      <div className="cambiar-datos-content">
        {/* Menú lateral izquierdo */}
        <aside className="cambiar-datos-menu">
          {menuOpciones.map(opcion => (
            <div
              key={opcion.id}
              className={`cambiar-datos-menu-item ${menuSeleccionado === opcion.id ? 'active' : ''}`}
              onClick={() => setMenuSeleccionado(opcion.id)}
            >
              {opcion.label}
            </div>
          ))}
        </aside>

        {/* Contenido derecho */}
        <div className="cambiar-datos-form">
          <div className="info-general-box">
            <h3>INFORMACIÓN GENERAL</h3>
            
            <div className="form-group-horizontal">
              <label>Nombre:</label>
              <span className="dato-valor">{datos.nombre}</span>
            </div>

            <div className="form-group-horizontal">
              <label>Dirección:</label>
              <input 
                type="text" 
                value={datos.direccion}
                onChange={(e) => setDatos({...datos, direccion: e.target.value})}
              />
            </div>

            <div className="form-group-horizontal">
              <label>Teléfono:</label>
              <input 
                type="text" 
                value={datos.telefono}
                onChange={(e) => setDatos({...datos, telefono: e.target.value})}
              />
            </div>

            <div className="form-group-horizontal">
              <label>Correo:</label>
              <input 
                type="email" 
                value={datos.correo}
                onChange={(e) => setDatos({...datos, correo: e.target.value})}
              />
            </div>
          </div>

          <div className="info-message-privacidad">
            <span className="info-icon">ℹ️</span>
            <span>En el proceso de cambio de datos se mostrará información privada. Continúe con este procedimiento solo si no existe el riesgo de que su información sea plagiada.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CambiarDatos
