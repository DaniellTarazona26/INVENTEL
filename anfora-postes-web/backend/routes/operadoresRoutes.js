// backend/routes/operadoresRoutes.js
const express = require('express');
const router = express.Router();
const operadoresController = require('../controllers/operadoresController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', operadoresController.obtenerOperadores);
router.get('/todos', operadoresController.obtenerTodos);
router.get('/:id', operadoresController.obtenerOperadorPorId);
router.post('/', operadoresController.crearOperador);
router.put('/:id', operadoresController.actualizarOperador);
router.delete('/:id', operadoresController.eliminarOperador);

module.exports = router;
