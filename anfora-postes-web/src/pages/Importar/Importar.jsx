import React from 'react'
import './Importar.css'

const Importar = () => {
  return (
    <div className="importar-page">
      <h2>Importar Datos</h2>
      <p>Suba sus archivos</p>
      
      <div className="upload-box">
        <div className="upload-icon">📤</div>
        <p>Arrastre un archivo aquí o haga clic para seleccionar</p>
        <input type="file" accept=".xlsx,.xls" style={{display: 'none'}} />
        <button className="btn-primary">Seleccionar archivo</button>
      </div>
    </div>
  )
}

export default Importar
