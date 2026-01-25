// backend/routes/barriosRoutes.js
const express = require('express');
const router = express.Router();
const barriosController = require('../controllers/barriosController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', barriosController.obtenerBarrios);
router.get('/:id', barriosController.obtenerBarrioPorId);
router.post('/', verificarRol('admin', 'supervisor'), barriosController.crearBarrio);
router.put('/:id', verificarRol('admin', 'supervisor'), barriosController.actualizarBarrio);
router.delete('/:id', verificarRol('admin'), barriosController.eliminarBarrio);

module.exports = router;
