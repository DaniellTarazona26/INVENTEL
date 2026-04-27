import axios from 'axios'


const API_URL = 'https://inventel-production.up.railway.app/api'


const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}


const inventarioService = {

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


  obtenerTodos: async (filtros = {}) => {
    try {
      const hoy = new Date().toISOString().split('T')[0]
      const params = new URLSearchParams()
      if (filtros.ciudadId) params.append('ciudad_id', filtros.ciudadId)
      if (filtros.barrioId) params.append('barrio_id', filtros.barrioId)
      params.append('fechaInicio', filtros.fechaInicio || hoy)
      params.append('fechaFin',    filtros.fechaFin    || hoy)

      const response = await axios.get(
        `${API_URL}/inventarios?${params.toString()}`,
        { headers: getAuthHeader() }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },


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

