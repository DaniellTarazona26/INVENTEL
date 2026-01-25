// src/services/operadoresService.js
import api from './api';

const operadoresService = {
  obtenerTodos: async () => {
    const response = await api.get('/operadores');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/operadores/${id}`);
    return response.data;
  },

  crear: async (operador) => {
    const response = await api.post('/operadores', operador);
    return response.data;
  },

  actualizar: async (id, operador) => {
    const response = await api.put(`/operadores/${id}`, operador);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/operadores/${id}`);
    return response.data;
  }
};

export default operadoresService;
