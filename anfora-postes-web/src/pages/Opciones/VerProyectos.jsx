// src/pages/Opciones/VerProyectos.jsx
import React, { useState } from 'react'
import './OpcionesComun.css'

const VerProyectos = () => {
  const [busqueda, setBusqueda] = useState('')


  return (
    <div className="tabla-container">
      <h2 className="seccion-titulo">Ver Proyectos</h2>

      <div className="busqueda-container">
        <input 
          type="text"
          className="busqueda-input"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn-buscar-tabla">Buscar</button>
      </div>

      <div className="ver-todo-link">
        <a href="#" onClick={(e) => e.preventDefault()}>Ver Todo</a>
      </div>

      <div className="tabla-wrapper">
        <table className="tabla-datos">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>#</th>
              <th>Proyecto</th>
              <th>Operador</th>
              <th>Localidad</th>
              <th># Solicitud</th>
              <th>F. Radicado</th>
              <th>Supervisor</th>
              <th>F. Revisión</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.map((proyecto, index) => (
              <tr key={proyecto.id}>
                <td><input type="checkbox" /></td>
                <td>{index + 1}</td>
                <td>{proyecto.nombre}</td>
                <td>{proyecto.operador}</td>
                <td>{proyecto.localidad}</td>
                <td>{proyecto.solicitud}</td>
                <td>{proyecto.fechaRadicado}</td>
                <td>{proyecto.supervisor}</td>
                <td>{proyecto.fechaRevision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VerProyectos
