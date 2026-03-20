// backend/routes/proyectosRoutes.js
const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/todos', verificarRol('ADMIN', 'INSPECTOR'), proyectosController.obtenerTodosProyectos);
router.get('/', proyectosController.obtenerProyectos);
router.get('/:id', proyectosController.obtenerProyectoPorId);
router.post('/', verificarRol('ADMIN', 'INSPECTOR'), proyectosController.crearProyecto);
router.put('/:id', verificarRol('ADMIN', 'INSPECTOR'), proyectosController.actualizarProyecto);
router.delete('/:id', verificarRol('ADMIN'), proyectosController.eliminarProyecto);

module.exports = router;
