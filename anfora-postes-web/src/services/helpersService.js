import api from './api'

const helpersService = {
  obtenerOperadores: async () => {
    try {
      const response = await api.get('/helpers/operadores')
      return response.data.data || []
    } catch (error) {
      console.error('Error obteniendo operadores:', error)
      return []
    }
  },

  obtenerCiudades: async () => {
    try {
      const response = await api.get('/helpers/ciudades')
      return response.data.data || []
    } catch (error) {
      console.error('Error obteniendo ciudades:', error)
      return []
    }
  },

  obtenerBarriosPorCiudad: async (ciudadId) => {
    try {
      const response = await api.get(`/helpers/barrios/${ciudadId}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error obteniendo barrios:', error)
      return []
    }
  },

  obtenerInspectores: async () => {
    try {
      const response = await api.get('/helpers/inspectores')
      return response.data.data || []
    } catch (error) {
      console.error('Error obteniendo inspectores:', error)
      return []
    }
  },

  obtenerProyectos: async () => {
    try {
      const response = await api.get('/helpers/proyectos')
      return response.data.data || []
    } catch (error) {
      console.error('Error obteniendo proyectos:', error)
      return []
    }
  }
}

export default helpersService

