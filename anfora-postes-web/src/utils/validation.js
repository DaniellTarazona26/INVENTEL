// Funciones de validación para formularios
export const validateRequired = (value) => {
  return value && value.trim() !== ''
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validateCodigoPoste = (codigo) => {
  // Validar formato de código de poste (ajustar según necesidad)
  return codigo && codigo.length >= 3
}