// backend/controllers/empresasController.js

const empresasService = require('../services/empresasService')

const empresasController = {
  
  obtenerTodas: async (req, res) => {
    try {
      const empresas = await empresasService.obtenerTodas()
      res.json({
        success: true,
        empresas
      })
    } catch (error) {
      console.error('Error al obtener empresas:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener las empresas'
      })
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const empresa = await empresasService.obtenerPorId(req.params.id)
      res.json({
        success: true,
        empresa
      })
    } catch (error) {
      console.error('Error al obtener empresa:', error)
      res.status(500).json({
        success: false,
        error: 'Error al obtener la empresa'
      })
    }
  },

  crear: async (req, res) => {
    try {
      const empresa = await empresasService.crear(req.body)
      res.status(201).json({
        success: true,
        empresa
      })
    } catch (error) {
      console.error('Error al crear empresa:', error)
      res.status(500).json({
        success: false,
        error: 'Error al crear la empresa'
      })
    }
  }
}

module.exports = empresasController
