import React from 'react'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Bienvenido al Sistema</h2>
      <p>Ha ingresado correctamente al Sistema de Captura de Inventarios para Estructuras.</p>
      <p>Inicie el uso de la aplicación seleccionando la opción deseada en el menú principal.</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📦 Inventario Total</h3>
          <p className="card-value">1,248</p>
          <p className="card-label">Postes registrados</p>
        </div>
        <div className="dashboard-card">
          <h3>✅ Estado Bueno</h3>
          <p className="card-value">1,105</p>
          <p className="card-label">88.5% del total</p>
        </div>
        <div className="dashboard-card">
          <h3>⚠️ Requieren Atención</h3>
          <p className="card-value">143</p>
          <p className="card-label">11.5% del total</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard