// backend/controllers/empresasController.js
const empresasService = require('../services/empresasService')

const empresasController = {

  obtenerTodas: async (req, res) => {
    try {
      const empresas = await empresasService.obtenerTodas()
      res.json({ success: true, empresas })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error al obtener empresas' })
    }
  },

  obtenerTodasAdmin: async (req, res) => {
    try {
      const empresas = await empresasService.obtenerTodasAdmin()
      res.json({ success: true, empresas })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error al obtener empresas' })
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const empresa = await empresasService.obtenerPorId(req.params.id)
      res.json({ success: true, empresa })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error al obtener empresa' })
    }
  },

  crear: async (req, res) => {
    try {
      const empresa = await empresasService.crear(req.body)
      res.status(201).json({ success: true, empresa })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error al crear empresa' })
    }
  },

  actualizar: async (req, res) => {
    try {
      const empresa = await empresasService.actualizar(req.params.id, req.body)
      res.json({ success: true, empresa })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error al actualizar empresa' })
    }
  },

  eliminar: async (req, res) => {
    try {
      await empresasService.eliminar(req.params.id)
      res.json({ success: true, message: 'Empresa desactivada exitosamente' })
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error al eliminar empresa' })
    }
  }
}

module.exports = empresasController
