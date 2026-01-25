// src/services/authService.js
import api from './api';

const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        // Guardar token y usuario en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        return response.data;
      }
      
      throw new Error(response.data.error || 'Error en login');
    } catch (error) {
      throw error.response?.data?.error || 'Error al conectar con el servidor';
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  // Obtener usuario actual
  getUsuarioActual: () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Verificar sesión con el servidor
  verificarSesion: async () => {
    try {
      const response = await api.get('/auth/verificar');
      return response.data;
    } catch (error) {
      authService.logout();
      throw error;
    }
  }
};

export default authService;
