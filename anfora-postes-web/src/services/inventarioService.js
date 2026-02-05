// frontend/src/services/inventarioService.js

import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const inventarioService = {
  // Crear nuevo inventario COMPLETO
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

  // Crear inventario PARCIAL (solo eléctrica)
  crearParcial: async (datos) => {
    try {
      const response = await axios.post(
        `${API_URL}/inventarios/parcial`,
        datos,
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Completar inventario (marcar como completo)
  completarConOperadores: async (inventarioId) => {
    try {
      const response = await axios.patch(
        `${API_URL}/inventarios/${inventarioId}/completar`,
        {},
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

