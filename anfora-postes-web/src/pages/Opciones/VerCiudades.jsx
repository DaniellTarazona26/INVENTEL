// src/pages/Opciones/VerCiudades.jsx
import React, { useState } from 'react'
import './OpcionesComun.css'

const VerCiudades = () => {
  const [busqueda, setBusqueda] = useState('')


  return (
    <div className="tabla-container">
      <h2 className="seccion-titulo">Ver Ciudades</h2>

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
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {ciudades.map((ciudad, index) => (
              <tr key={ciudad.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td><input type="checkbox" /></td>
                <td>{index + 1}</td>
                <td>{ciudad.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VerCiudades
