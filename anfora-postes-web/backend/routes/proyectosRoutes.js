// backend/routes/proyectosRoutes.js
const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', proyectosController.obtenerProyectos);
router.get('/:id', proyectosController.obtenerProyectoPorId);
router.post('/', verificarRol('ADMIN', 'supervisor'), proyectosController.crearProyecto);
router.put('/:id', verificarRol('ADMIN', 'supervisor'), proyectosController.actualizarProyecto);
router.delete('/:id', verificarRol('ADMIN'), proyectosController.eliminarProyecto);

module.exports = router;
