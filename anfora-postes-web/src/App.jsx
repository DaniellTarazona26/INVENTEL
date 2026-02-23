import { useState, useEffect } from 'react'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Inventario from './pages/Inventario/Inventario'
import VerInventario from './pages/Inventario/VerInventario'
import AgregarPoste from './pages/AgregarPoste/AgregarPoste'
import AgregarOperadores from './pages/AgregarOperadores/AgregarOperadores'
import Reportes from './pages/Reportes/Reportes'
import Factibilidad from './pages/Factibilidad/Factibilidad'
import Importar from './pages/Importar/Importar'
import Opciones from './pages/Opciones/Opciones'
import authService from './services/authService'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('inicio')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [factibilidadEditandoId, setFactibilidadEditandoId] = useState(null)

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        if (authService.isAuthenticated()) {
          const usuarioGuardado = authService.getUsuarioActual()
          setUsuario(usuarioGuardado)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error verificando sesión:', error)
        authService.logout()
      } finally {
        setCargando(false)
      }
    }

    verificarSesion()
  }, [])

  const handleLogin = (usuarioData) => {
    setUsuario(usuarioData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUsuario(null)
    setCurrentPage('inicio')
  }

  const handleNavegacion = (destino, factibilidadId = null) => {
    if (factibilidadId) {
      setFactibilidadEditandoId(factibilidadId)
    } else {
      setFactibilidadEditandoId(null)
    }
    setCurrentPage(destino)
  }

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <Dashboard />
      case 'inventario':
        return <Inventario setCurrentPage={handleNavegacion} />
      case 'ver-inventario':
        return <VerInventario setCurrentPage={handleNavegacion} />
      case 'agregar':
        return <AgregarPoste setCurrentPage={handleNavegacion} />
      case 'agregar-operadores':
        return <AgregarOperadores setCurrentPage={handleNavegacion} />
      case 'factibilidad':
        return (
          <Factibilidad 
            setCurrentPage={handleNavegacion}
            factibilidadEditandoId={factibilidadEditandoId}
          />
        )
      case 'reportes':
        return <Reportes />
      case 'importar':
        return <Importar />
      case 'opciones':
        return <Opciones />
      default:
        return <Dashboard />
    }
  }

  return (
    <MainLayout 
      currentPage={currentPage} 
      setCurrentPage={handleNavegacion}
      onLogout={handleLogout}
      usuario={usuario}
    >
      {renderPage()}
    </MainLayout>
  )
}

export default App

