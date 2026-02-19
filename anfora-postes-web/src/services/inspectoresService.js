import api from './api';

const inspectoresService = {
  obtenerTodos: async () => {
    try {
      const response = await api.get('/helpers/inspectores');
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo inspectores:', error);
      return [];
    }
  }
};

export default inspectoresService;
