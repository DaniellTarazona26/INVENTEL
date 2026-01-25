// backend/routes/proyectosRoutes.js
const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', proyectosController.obtenerProyectos);
router.get('/:id', proyectosController.obtenerProyectoPorId);
router.post('/', verificarRol('admin', 'supervisor'), proyectosController.crearProyecto);
router.put('/:id', verificarRol('admin', 'supervisor'), proyectosController.actualizarProyecto);
router.delete('/:id', verificarRol('admin'), proyectosController.eliminarProyecto);

module.exports = router;
