// src/services/barriosService.js
import api from './api';

const barriosService = {
  obtenerTodos: async () => {
    const response = await api.get('/barrios');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/barrios/${id}`);
    return response.data;
  },

  crear: async (barrio) => {
    const response = await api.post('/barrios', barrio);
    return response.data;
  },

  actualizar: async (id, barrio) => {
    const response = await api.put(`/barrios/${id}`, barrio);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/barrios/${id}`);
    return response.data;
  }
};

export default barriosService;
