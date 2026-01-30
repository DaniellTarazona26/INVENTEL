// backend/routes/ciudadesRoutes.js
const express = require('express');
const router = express.Router();
const ciudadesController = require('../controllers/ciudadesController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', ciudadesController.obtenerCiudades);
router.get('/:id', ciudadesController.obtenerCiudadPorId);
router.get('/:id/barrios', ciudadesController.obtenerBarriosPorCiudad);
router.post('/', verificarRol('ADMIN', 'supervisor'), ciudadesController.crearCiudad);
router.put('/:id', verificarRol('ADMIN', 'supervisor'), ciudadesController.actualizarCiudad);
router.delete('/:id', verificarRol('ADMIN'), ciudadesController.eliminarCiudad);

module.exports = router;
