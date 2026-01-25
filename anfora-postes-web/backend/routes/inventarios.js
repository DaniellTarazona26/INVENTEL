// backend/routes/inventarios.js
const express = require('express')
const router = express.Router()
const inventariosService = require('../services/inventariosService')
const { verificarToken, verificarRol } = require('../middleware/authMiddleware')

// Obtener todos los inventarios
router.get('/', verificarToken, async (req, res) => {
  try {
    const filtros = {
      ciudadId: req.query.ciudad_id,
      barrioId: req.query.barrio_id,
      proyectoId: req.query.proyecto_id
    }
    
    const inventarios = await inventariosService.obtenerTodos(filtros)
    
    res.json({
      success: true,
      inventarios
    })
  } catch (error) {
    console.error('Error obteniendo inventarios:', error)
    res.status(500).json({
      success: false,
      error: 'Error al obtener inventarios'
    })
  }
})

// Obtener un inventario por ID
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const inventario = await inventariosService.obtenerPorId(req.params.id)
    
    res.json({
      success: true,
      inventario
    })
  } catch (error) {
    console.error('Error obteniendo inventario:', error)
    res.status(404).json({
      success: false,
      error: error.message
    })
  }
})

// Crear nuevo inventario
router.post('/', verificarToken, async (req, res) => {
  try {
    const inventario = await inventariosService.crear(req.body, req.usuario.id)
    
    res.status(201).json({
      success: true,
      message: 'Inventario creado exitosamente',
      inventario
    })
  } catch (error) {
    console.error('Error creando inventario:', error)
    res.status(500).json({
      success: false,
      error: 'Error al crear inventario'
    })
  }
})

// Actualizar inventario
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const inventario = await inventariosService.actualizar(req.params.id, req.body)
    
    res.json({
      success: true,
      message: 'Inventario actualizado exitosamente',
      inventario
    })
  } catch (error) {
    console.error('Error actualizando inventario:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Eliminar inventario (solo admin)
router.delete('/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
  try {
    await inventariosService.eliminar(req.params.id)
    
    res.json({
      success: true,
      message: 'Inventario eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error eliminando inventario:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

module.exports = router
