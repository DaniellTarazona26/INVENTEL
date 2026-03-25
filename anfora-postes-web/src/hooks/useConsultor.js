const useConsultor = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const esConsultor = usuario.rol === 'CONSULTOR'
  const empresaId = usuario.empresa_id ? String(usuario.empresa_id) : ''
  return { esConsultor, empresaId }
}

export default useConsultor