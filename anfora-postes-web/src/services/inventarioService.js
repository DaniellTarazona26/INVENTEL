// frontend/src/services/inventarioService.js
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Obtener token del localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const inventarioService = {
  // Crear nuevo inventario
  crear: async (datos) => {
    try {
      const response = await axios.post(
        `${API_URL}/inventarios`,
        datos,
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Obtener todos los inventarios
  obtenerTodos: async (filtros = {}) => {
    try {
      const params = new URLSearchParams()
      if (filtros.ciudadId) params.append('ciudad_id', filtros.ciudadId)
      if (filtros.barrioId) params.append('barrio_id', filtros.barrioId)
      if (filtros.proyectoId) params.append('proyecto_id', filtros.proyectoId)
      
      const response = await axios.get(
        `${API_URL}/inventarios?${params.toString()}`,
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Obtener inventario por ID
  obtenerPorId: async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/inventarios/${id}`,
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Actualizar inventario
  actualizar: async (id, datos) => {
    try {
      const response = await axios.put(
        `${API_URL}/inventarios/${id}`,
        datos,
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Eliminar inventario
  eliminar: async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/inventarios/${id}`,
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default inventarioService
