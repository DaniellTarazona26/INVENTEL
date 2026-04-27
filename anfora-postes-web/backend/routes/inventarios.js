const express = require('express')
const router = express.Router()
const inventariosService = require('../services/inventariosService')
const { verificarToken, verificarRol } = require('../middleware/authMiddleware')


router.post('/parcial', verificarToken, async (req, res) => {
  try {
    const inventario = await inventariosService.crearParcial(req.body, req.usuario.id)
    
    res.status(201).json({
      success: true,
      message: '✅ Parte eléctrica guardada. Continúe con datos de operadores',
      inventario
    })
  } catch (error) {
    console.error('Error creando inventario parcial:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Error al guardar inventario parcial'
    })
  }
})


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
      error: error.message || 'Error al crear inventario'
    })
  }
})


router.patch('/:id/completar', verificarToken, async (req, res) => {
  try {
    const inventario = await inventariosService.completarConOperadores(
      req.params.id,
      req.usuario.id
    )
    
    res.json({
      success: true,
      message: '✅ Inventario completado exitosamente',
      inventario
    })
  } catch (error) {
    console.error('Error completando inventario:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Error al completar inventario'
    })
  }
})


router.put('/:id', verificarToken, async (req, res) => {
  try {
    const inventario = await inventariosService.actualizar(
      req.params.id, 
      req.body, 
      req.usuario.id
    )
    
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


router.get('/', verificarToken, async (req, res) => {
  try {
    const filtros = {
      ciudadId: req.query.ciudad_id,
      barrioId: req.query.barrio_id,
      proyectoId: req.query.proyecto_id,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin
    }

    if (req.usuario.rol === 'CONSULTOR') {
      filtros.empresaId = req.usuario.empresa_id
    }

    const inventarios = await inventariosService.obtenerTodos(filtros)
    res.json({ success: true, inventarios })
  } catch (error) {
    console.error('Error obteniendo inventarios:', error)
    res.status(500).json({ success: false, error: 'Error al obtener inventarios' })
  }
})


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


router.delete('/:id', verificarToken, verificarRol('ADMIN', 'INSPECTOR'), async (req, res) => {
  try {
    await inventariosService.eliminar(req.params.id, req.usuario.id)
    
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
