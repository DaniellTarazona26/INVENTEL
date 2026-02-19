import api from './api'

const reportesService = {

  getInventarioOperador: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/inventario-operador?${params}`)
    return response.data.data || []
  },

  getInventarioInspector: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/inventario-inspector?${params}`)
    return response.data.data || []
  },

  getReporteRedes: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/redes?${params}`)
    return response.data.data || []
  },

  getReporteEstructuras: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/estructuras?${params}`)
    return response.data.data || []
  },

  getReportePoda: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/poda?${params}`)
    return response.data.data || []
  },

  getReporteFactibilidad: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/factibilidad?${params}`)
    return response.data.data || []
  },

  getReportePerdidas: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/perdidas?${params}`)
    return response.data.data || []
  },

  exportarInventarioOperador: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/inventario-operador/exportar?${params}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `REPORTE_OPERADOR_${filtros.operador || 'TODOS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  exportarInventarioInspector: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/inventario-inspector/exportar?${params}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `REPORTE_INSPECTOR_${filtros.inspector || 'TODOS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  exportarReporteRedes: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/redes/exportar?${params}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `REPORTE_REDES_${filtros.ciudad || 'TODAS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  exportarReporteEstructuras: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/estructuras/exportar?${params}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `REPORTE_ESTRUCTURAS_${filtros.ciudad || 'TODAS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  exportarReportePoda: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/poda/exportar?${params}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `REPORTE_PODA_${filtros.ciudad || 'TODAS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  exportarReporteFactibilidad: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/factibilidad/exportar?${params}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `REPORTE_FACTIBILIDAD_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  exportarReportePerdidas: async (filtros) => {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/reportes/perdidas/exportar?${params}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `REPORTE_PERDIDAS_${filtros.ciudad || 'TODAS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  getDashboardStats: async () => {
  const response = await api.get('/reportes/dashboard-stats')
  return response.data.data || {}
  }

}

export default reportesService
