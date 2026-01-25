// frontend/src/services/factibilidadService.js
import api from './api';

// =============================================
// OBTENER TODAS (con filtros)
// =============================================
export const obtenerTodas = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    // Agregar filtros a los query params
    if (filtros.proyecto_id) params.append('proyecto_id', filtros.proyecto_id);
    if (filtros.ciudad_id) params.append('ciudad_id', filtros.ciudad_id);
    if (filtros.barrio_id) params.append('barrio_id', filtros.barrio_id);
    if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id);
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
    if (filtros.completo !== undefined) params.append('completo', filtros.completo);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.limit) params.append('limit', filtros.limit);
    if (filtros.offset) params.append('offset', filtros.offset);

    const queryString = params.toString();
    const url = queryString ? `/factibilidades?${queryString}` : '/factibilidades';

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerTodas:', error);
    throw new Error(
      error.response?.data?.error || 
      'Error al obtener factibilidades'
    );
  }
};

// =============================================
// OBTENER POR ID
// =============================================
export const obtenerPorId = async (id) => {
  try {
    const response = await api.get(`/factibilidades/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error en obtenerPorId(${id}):`, error);
    throw new Error(
      error.response?.data?.error || 
      'Error al obtener factibilidad'
    );
  }
};

// =============================================
// CREAR
// =============================================
export const crear = async (datos) => {
  try {
    const response = await api.post('/factibilidades', datos);
    return response.data;
  } catch (error) {
    console.error('Error en crear:', error);
    throw new Error(
      error.response?.data?.error || 
      'Error al crear factibilidad'
    );
  }
};

// =============================================
// ACTUALIZAR
// =============================================
export const actualizar = async (id, datos) => {
  try {
    const response = await api.put(`/factibilidades/${id}`, datos);
    return response.data;
  } catch (error) {
    console.error(`Error en actualizar(${id}):`, error);
    throw new Error(
      error.response?.data?.error || 
      'Error al actualizar factibilidad'
    );
  }
};

// =============================================
// ELIMINAR
// =============================================
export const eliminar = async (id) => {
  try {
    const response = await api.delete(`/factibilidades/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error en eliminar(${id}):`, error);
    throw new Error(
      error.response?.data?.error || 
      'Error al eliminar factibilidad'
    );
  }
};

// =============================================
// OBTENER ESTADÍSTICAS (opcional)
// =============================================
export const obtenerEstadisticas = async () => {
  try {
    const response = await api.get('/factibilidades/stats/resumen');
    return response.data;
  } catch (error) {
    console.error('Error en obtenerEstadisticas:', error);
    throw new Error(
      error.response?.data?.error || 
      'Error al obtener estadísticas'
    );
  }
};

// =============================================
// EXPORTAR POR DEFECTO (opcional)
// =============================================
const factibilidadService = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  obtenerEstadisticas
};

export default factibilidadService;
