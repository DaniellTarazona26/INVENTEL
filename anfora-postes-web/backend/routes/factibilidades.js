// backend/routes/factibilidades.js
const express = require('express');
const router = express.Router();
const factibilidadesService = require('../services/factibilidadesService');

// =============================================
// GET /api/factibilidades - Listar con filtros
// =============================================
router.get('/', async (req, res) => {
  try {
    const filtros = {
      proyecto_id: req.query.proyecto_id,
      ciudad_id: req.query.ciudad_id,
      barrio_id: req.query.barrio_id,
      usuario_id: req.query.usuario_id,
      fecha_inicio: req.query.fecha_inicio,
      fecha_fin: req.query.fecha_fin,
      busqueda: req.query.busqueda,
      completo: req.query.completo,
      estado: req.query.estado || 'activo',
      limit: parseInt(req.query.limit) || 100,
      offset: parseInt(req.query.offset) || 0
    };

    const resultado = await factibilidadesService.obtenerTodas(filtros);

    res.json({
      success: true,
      factibilidades: resultado.factibilidades,
      total: resultado.total,
      filtros: filtros
    });
  } catch (error) {
    console.error('Error en GET /factibilidades:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener factibilidades'
    });
  }
});

// =============================================
// GET /api/factibilidades/:id - Obtener por ID
// =============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    const factibilidad = await factibilidadesService.obtenerPorId(parseInt(id));

    if (!factibilidad) {
      return res.status(404).json({
        success: false,
        error: 'Factibilidad no encontrada'
      });
    }

    res.json({
      success: true,
      factibilidad: factibilidad
    });
  } catch (error) {
    console.error(`Error en GET /factibilidades/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener factibilidad'
    });
  }
});

// =============================================
// POST /api/factibilidades - Crear
// =============================================
router.post('/', async (req, res) => {
  try {
    const datos = req.body;

    // Validaciones obligatorias
    if (!datos.proyecto_id) {
      return res.status(400).json({
        success: false,
        error: 'El proyecto es obligatorio'
      });
    }

    if (!datos.empresa_id) {
      return res.status(400).json({
        success: false,
        error: 'La empresa es obligatoria'
      });
    }

    if (!datos.operador_id) {
      return res.status(400).json({
        success: false,
        error: 'El operador es obligatorio'
      });
    }

    // Obtener usuario_id del token/sesión
    const usuario_id = req.user?.id || req.body.usuario_id || null;
    
    if (usuario_id) {
      datos.usuario_id = usuario_id;
    }

    const nuevaFactibilidad = await factibilidadesService.crear(datos);

    res.status(201).json({
      success: true,
      message: 'Factibilidad creada exitosamente',
      factibilidad: nuevaFactibilidad
    });
  } catch (error) {
    console.error('Error en POST /factibilidades:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al crear factibilidad'
    });
  }
});

// =============================================
// PUT /api/factibilidades/:id - Actualizar
// =============================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    // Verificar que existe
    const existe = await factibilidadesService.obtenerPorId(parseInt(id));
    if (!existe) {
      return res.status(404).json({
        success: false,
        error: 'Factibilidad no encontrada'
      });
    }

    const factibilidadActualizada = await factibilidadesService.actualizar(parseInt(id), datos);

    res.json({
      success: true,
      message: 'Factibilidad actualizada exitosamente',
      factibilidad: factibilidadActualizada
    });
  } catch (error) {
    console.error(`Error en PUT /factibilidades/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al actualizar factibilidad'
    });
  }
});

// =============================================
// DELETE /api/factibilidades/:id - Eliminar
// =============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    // Verificar que existe
    const existe = await factibilidadesService.obtenerPorId(parseInt(id));
    if (!existe) {
      return res.status(404).json({
        success: false,
        error: 'Factibilidad no encontrada'
      });
    }

    await factibilidadesService.eliminar(parseInt(id));

    res.json({
      success: true,
      message: 'Factibilidad eliminada exitosamente'
    });
  } catch (error) {
    console.error(`Error en DELETE /factibilidades/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al eliminar factibilidad'
    });
  }
});

// =============================================
// GET /api/factibilidades/stats/resumen - Estadísticas
// =============================================
router.get('/stats/resumen', async (req, res) => {
  try {
    const stats = await factibilidadesService.obtenerEstadisticas();

    res.json({
      success: true,
      estadisticas: stats
    });
  } catch (error) {
    console.error('Error en GET /factibilidades/stats/resumen:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener estadísticas'
    });
  }
});

module.exports = router;
