// src/pages/Opciones/VerBarrios.jsx
import React, { useState } from 'react'
import './OpcionesComun.css'

const VerBarrios = () => {
  const [busqueda, setBusqueda] = useState('')

  return (
    <div className="tabla-container">
      <h2 className="seccion-titulo">Ver Barrios</h2>

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

      <div className="tabla-wrapper">
        <table className="tabla-datos">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>#</th>
              <th>Ciudad</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {barrios.map((barrio, index) => (
              <tr key={barrio.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td><input type="checkbox" /></td>
                <td>{index + 1}</td>
                <td>{barrio.ciudad}</td>
                <td>{barrio.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VerBarrios
