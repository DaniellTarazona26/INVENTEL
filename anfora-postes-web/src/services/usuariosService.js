// src/services/usuariosService.js
import api from './api';

const usuariosService = {
  // Obtener todos los usuarios
  obtenerTodos: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  // Obtener usuario por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Crear usuario
  crear: async (usuario) => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },

  // Actualizar usuario
  actualizar: async (id, usuario) => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  // Eliminar usuario (desactivar)
  eliminar: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  // Activar usuario
  activar: async (id) => {
    const response = await api.patch(`/usuarios/${id}/activar`);
    return response.data;
  }
};

export default usuariosService;
