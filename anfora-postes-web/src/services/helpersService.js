// src/services/helpersService.js
import api from './api'

const helpersService = {
  obtenerOperadores: async () => {
    const response = await api.get('/helpers/operadores')
    return response.data.data || []
  },

  obtenerCiudades: async () => {
    const response = await api.get('/helpers/ciudades')
    return response.data.data || []
  },

  obtenerBarriosPorCiudad: async (ciudadId) => {
    const response = await api.get(`/helpers/barrios/${ciudadId}`)
    return response.data.data || []
  },

  obtenerInspectores: async () => {
    const response = await api.get('/helpers/inspectores')
    return response.data.data || []
  },

  obtenerProyectos: async () => {
    const response = await api.get('/helpers/proyectos')
    return response.data.data || []
  }
}

export default helpersService
