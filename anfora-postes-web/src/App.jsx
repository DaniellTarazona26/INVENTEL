import { useState, useEffect } from 'react'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Inventario from './pages/Inventario/Inventario'
import AgregarPoste from './pages/AgregarPoste/AgregarPoste'
import Reportes from './pages/Reportes/Reportes'
import Factibilidad from './pages/Factibilidad/Factibilidad'
import Importar from './pages/Importar/Importar'
import Opciones from './pages/Opciones/Opciones'
import authService from './services/authService'
import ConfirmModal from './components/common/ConfirmModal'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('inicio')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingDestination, setPendingDestination] = useState(null)
  

  // Verificar si hay sesión al cargar
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

  const handleNavegacion = (destino) => {
    const enEdicion = localStorage.getItem('editarInventarioId')
    
    if (currentPage === 'agregar' && enEdicion) {
      // Guardar destino pendiente y mostrar modal
      setPendingDestination(destino)
      setShowConfirmModal(true)
    } else {
      setCurrentPage(destino)
    }
  }

  const confirmarNavegacion = () => {
    localStorage.removeItem('editarInventarioId')
    setCurrentPage(pendingDestination)
    setShowConfirmModal(false)
    setPendingDestination(null)
  }

  const cancelarNavegacion = () => {
    setShowConfirmModal(false)
    setPendingDestination(null)
  }

  // Mostrar loading mientras verifica
  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  // Renderizar contenido según la página activa
  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <Dashboard />
      case 'inventario':
        return <Inventario setCurrentPage={handleNavegacion} />
      case 'agregar':
        return <AgregarPoste setCurrentPage={handleNavegacion} />
      case 'factibilidad':
        return <Factibilidad />
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
    <>
      <ConfirmModal
        show={showConfirmModal}
        message="Estás editando un registro. Si sales ahora, los cambios no guardados se perderán. ¿Deseas continuar?"
        onConfirm={confirmarNavegacion}
        onCancel={cancelarNavegacion}
      />
      
      <MainLayout 
        currentPage={currentPage} 
        setCurrentPage={handleNavegacion}
        onLogout={handleLogout}
        usuario={usuario}
      >
        {renderPage()}
      </MainLayout>
    </>
  )
}

export default App
