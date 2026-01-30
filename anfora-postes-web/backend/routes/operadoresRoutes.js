// backend/routes/operadoresRoutes.js
const express = require('express');
const router = express.Router();
const operadoresController = require('../controllers/operadoresController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', operadoresController.obtenerOperadores);
router.get('/:id', operadoresController.obtenerOperadorPorId);
router.post('/', verificarRol('ADMIN', 'supervisor'), operadoresController.crearOperador);
router.put('/:id', verificarRol('ADMIN', 'supervisor'), operadoresController.actualizarOperador);
router.delete('/:id', verificarRol('ADMIN'), operadoresController.eliminarOperador);

module.exports = router;
