// frontend/src/services/inventarioOperadoresService.js

import axios from 'axios'

const API_URL = 'https://inventel-production.up.railway.app/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const inventarioOperadoresService = {
  // Crear datos de operador
  crear: async (inventarioId, operadorNombre, datos) => {
    try {
      const response = await axios.post(
        `${API_URL}/inventarios-operadores`,
        { inventarioId, operadorNombre, datos },
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Obtener operadores de un inventario
  obtenerPorInventario: async (inventarioId) => {
    try {
      const response = await axios.get(
        `${API_URL}/inventarios-operadores/inventario/${inventarioId}`,
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Actualizar datos de operador
  actualizar: async (id, datos) => {
    try {
      const response = await axios.put(
        `${API_URL}/inventarios-operadores/${id}`,
        datos,
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Eliminar datos de operador
  eliminar: async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/inventarios-operadores/${id}`,
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default inventarioOperadoresService
