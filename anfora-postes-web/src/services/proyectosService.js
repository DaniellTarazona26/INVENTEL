// frontend/src/services/proyectosService.js

import api from './api'

const proyectosService = {
  obtenerTodos: async () => {
    const response = await api.get('/proyectos')
    // ✅ Si viene envuelto en { success, proyectos }
    return response.data.proyectos || response.data || []
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/proyectos/${id}`)
    return response.data.proyecto || response.data
  },

  crear: async (proyecto) => {
    const response = await api.post('/proyectos', proyecto)
    return response.data
  },

  actualizar: async (id, proyecto) => {
    const response = await api.put(`/proyectos/${id}`, proyecto)
    return response.data
  },

  eliminar: async (id) => {
    const response = await api.delete(`/proyectos/${id}`)
    return response.data
  }
}

export default proyectosService
