// backend/routes/inventariosOperadores.js

const express = require('express')
const router = express.Router()
const inventariosOperadoresService = require('../services/inventariosOperadoresService')
const { verificarToken } = require('../middleware/authMiddleware')

// ==========================================
// CREAR DATOS DE OPERADOR
// ==========================================
router.post('/', verificarToken, async (req, res) => {
  try {
    const { inventarioId, operadorNombre, datos } = req.body
    
    if (!inventarioId || !operadorNombre) {
      return res.status(400).json({
        success: false,
        error: 'inventarioId y operadorNombre son obligatorios'
      })
    }
    
    const operador = await inventariosOperadoresService.crear(
      inventarioId,
      operadorNombre,
      datos,
      req.usuario.id
    )
    
    res.status(201).json({
      success: true,
      message: 'Datos de operador guardados exitosamente',
      operador
    })
  } catch (error) {
    console.error('Error guardando datos de operador:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Error al guardar datos de operador'
    })
  }
})

// ==========================================
// OBTENER OPERADORES DE UN INVENTARIO
// ==========================================
router.get('/inventario/:inventarioId', verificarToken, async (req, res) => {
  try {
    const operadores = await inventariosOperadoresService.obtenerPorInventario(
      req.params.inventarioId
    )
    
    res.json({
      success: true,
      operadores
    })
  } catch (error) {
    console.error('Error obteniendo operadores:', error)
    res.status(500).json({
      success: false,
      error: 'Error al obtener operadores'
    })
  }
})

// ==========================================
// ACTUALIZAR DATOS DE OPERADOR
// ==========================================
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const operador = await inventariosOperadoresService.actualizar(
      req.params.id,
      req.body,
      req.usuario.id
    )
    
    res.json({
      success: true,
      message: 'Datos actualizados exitosamente',
      operador
    })
  } catch (error) {
    console.error('Error actualizando operador:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Error al actualizar datos'
    })
  }
})

// ==========================================
// ELIMINAR DATOS DE OPERADOR
// ==========================================
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    await inventariosOperadoresService.eliminar(req.params.id)
    
    res.json({
      success: true,
      message: 'Datos eliminados exitosamente'
    })
  } catch (error) {
    console.error('Error eliminando operador:', error)
    res.status(500).json({
      success: false,
      error: 'Error al eliminar datos'
    })
  }
})

module.exports = router
