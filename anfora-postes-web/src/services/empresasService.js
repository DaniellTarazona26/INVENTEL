// frontend/src/services/empresasService.js
import api from './api'

export const obtenerTodas = async () => {
  try {
    const response = await api.get('/empresas')
    return response.data
  } catch (error) {
    console.error('Error en obtenerTodas:', error)
    throw new Error(
      error.response?.data?.error || 
      'Error al obtener empresas'
    )
  }
}

export const obtenerPorId = async (id) => {
  try {
    const response = await api.get(`/empresas/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error en obtenerPorId(${id}):`, error)
    throw new Error(
      error.response?.data?.error || 
      'Error al obtener empresa'
    )
  }
}

export const crear = async (datos) => {
  try {
    const response = await api.post('/empresas', datos)
    return response.data
  } catch (error) {
    console.error('Error en crear:', error)
    throw new Error(
      error.response?.data?.error || 
      'Error al crear empresa'
    )
  }
}

const empresasService = {
  obtenerTodas,
  obtenerPorId,
  crear
}

export default empresasService
