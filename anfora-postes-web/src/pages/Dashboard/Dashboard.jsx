import React, { useState, useEffect } from 'react'
import reportesService from '../../services/reportesService'
import './Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_postes: 0,
    inventario_completo: 0,
    pendiente_operadores: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarStats()
  }, [])

  const cargarStats = async () => {
    try {
      const data = await reportesService.getDashboardStats()
      setStats({
        total_postes: parseInt(data.total_postes) || 0,
        inventario_completo: parseInt(data.inventario_completo) || 0,
        pendiente_operadores: parseInt(data.pendiente_operadores) || 0
      })
    } catch (error) {
      console.error('Error cargando stats del dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const porcentajeCompleto = stats.total_postes > 0
    ? ((stats.inventario_completo / stats.total_postes) * 100).toFixed(1)
    : 0

  const porcentajePendiente = stats.total_postes > 0
    ? ((stats.pendiente_operadores / stats.total_postes) * 100).toFixed(1)
    : 0

  return (
    <div className="dashboard">
      <h2>Bienvenido al Sistema</h2>
      <p>Ha ingresado correctamente al Sistema de Captura de Inventarios para Estructuras.</p>
      <p>Inicie el uso de la aplicación seleccionando la opción deseada en el menú principal.</p>

      {loading ? (
        <div className="dashboard-loading">
          <p>Cargando estadísticas...</p>
        </div>
      ) : (
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>📦 Inventario Total</h3>
            <p className="card-value">{stats.total_postes.toLocaleString('es-CO')}</p>
            <p className="card-label">Postes registrados</p>
          </div>

          <div className="dashboard-card card-success">
            <h3>✅ Inventario Completo</h3>
            <p className="card-value">{stats.inventario_completo.toLocaleString('es-CO')}</p>
            <p className="card-label">{porcentajeCompleto}% del total</p>
          </div>

          <div className="dashboard-card card-warning">
            <h3>⚠️ Requieren Atención</h3>
            <p className="card-value">{stats.pendiente_operadores.toLocaleString('es-CO')}</p>
            <p className="card-label">{porcentajePendiente}% — Pendiente info operadores</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
