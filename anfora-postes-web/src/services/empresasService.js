// src/services/empresasService.js
import api from './api'

const empresasService = {

  obtenerTodas: async () => {
    const response = await api.get('/empresas')
    return response.data
  },

  obtenerTodasAdmin: async () => {
    const response = await api.get('/empresas/todos')
    return response.data
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/empresas/${id}`)
    return response.data
  },

  crear: async (empresa) => {
    const response = await api.post('/empresas', empresa)
    return response.data
  },

  actualizar: async (id, empresa) => {
    const response = await api.put(`/empresas/${id}`, empresa)
    return response.data
  },

  eliminar: async (id) => {
    const response = await api.delete(`/empresas/${id}`)
    return response.data
  }
}

export default empresasService
