// backend/routes/operadoresRoutes.js
const express = require('express');
const router = express.Router();
const operadoresController = require('../controllers/operadoresController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', operadoresController.obtenerOperadores);
router.get('/:id', operadoresController.obtenerOperadorPorId);
router.post('/', verificarRol('admin', 'supervisor'), operadoresController.crearOperador);
router.put('/:id', verificarRol('admin', 'supervisor'), operadoresController.actualizarOperador);
router.delete('/:id', verificarRol('admin'), operadoresController.eliminarOperador);

module.exports = router;
