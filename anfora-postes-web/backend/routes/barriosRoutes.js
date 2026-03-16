// backend/routes/barriosRoutes.js
const express = require('express');
const router = express.Router();
const barriosController = require('../controllers/barriosController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/todos', verificarRol('ADMIN'), barriosController.obtenerTodosBarrios);
router.get('/', barriosController.obtenerBarrios);
router.get('/:id', barriosController.obtenerBarrioPorId);
router.post('/', verificarRol('ADMIN', 'INSPECTOR'), barriosController.crearBarrio);
router.put('/:id', verificarRol('ADMIN', 'INSPECTOR'), barriosController.actualizarBarrio);
router.delete('/:id', verificarRol('ADMIN'), barriosController.eliminarBarrio);

module.exports = router;
