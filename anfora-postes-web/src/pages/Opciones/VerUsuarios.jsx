// src/pages/Opciones/VerUsuarios.jsx
import React, { useState } from 'react'
import './OpcionesComun.css'

const VerUsuarios = () => {
  const [busqueda, setBusqueda] = useState('')


  return (
    <div className="tabla-container">
      <h2 className="seccion-titulo">Ver Usuarios</h2>

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
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último Acceso</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={usuario.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td><input type="checkbox" /></td>
                <td>{index + 1}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td>
                  <span className={`estado-badge ${usuario.estado.toLowerCase()}`}>
                    {usuario.estado}
                  </span>
                </td>
                <td>{usuario.ultimoAcceso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VerUsuarios
