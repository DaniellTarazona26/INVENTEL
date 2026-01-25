// backend/routes/usuariosRoutes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener todos los usuarios
router.get('/', usuariosController.obtenerUsuarios);

// Obtener usuario por ID
router.get('/:id', usuariosController.obtenerUsuarioPorId);

// Crear usuario (solo admin)
router.post('/', verificarRol('admin'), usuariosController.crearUsuario);

// Actualizar usuario (solo admin)
router.put('/:id', verificarRol('admin'), usuariosController.actualizarUsuario);

// Desactivar usuario (solo admin)
router.delete('/:id', verificarRol('admin'), usuariosController.eliminarUsuario);

// Activar usuario (solo admin)
router.patch('/:id/activar', verificarRol('admin'), usuariosController.activarUsuario);

module.exports = router;
