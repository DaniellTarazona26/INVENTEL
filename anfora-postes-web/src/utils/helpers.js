// Funciones auxiliares
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO')
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('es-CO')
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}