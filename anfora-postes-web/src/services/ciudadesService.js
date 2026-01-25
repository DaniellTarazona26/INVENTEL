// src/services/ciudadesService.js

import api from './api'

const ciudadesService = {
  obtenerTodas: async () => {
    const response = await api.get('/ciudades')
    // ✅ Si viene envuelto en { success, ciudades }
    return response.data.ciudades || response.data || []
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/ciudades/${id}`)
    return response.data.ciudad || response.data
  },

  crear: async (ciudad) => {
    const response = await api.post('/ciudades', ciudad)
    return response.data
  },

  actualizar: async (id, ciudad) => {
    const response = await api.put(`/ciudades/${id}`, ciudad)
    return response.data
  },

  eliminar: async (id) => {
    const response = await api.delete(`/ciudades/${id}`)
    return response.data
  },

  obtenerBarrios: async (ciudadId) => {
    const response = await api.get(`/ciudades/${ciudadId}/barrios`)
    // ✅ Si viene envuelto en { success, barrios }
    return response.data.barrios || response.data || []
  }
}

export default ciudadesService
