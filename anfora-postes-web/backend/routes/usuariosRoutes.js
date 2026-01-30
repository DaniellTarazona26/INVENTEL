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

// Crear usuario (solo ADMIN)
router.post('/', verificarRol('ADMIN'), usuariosController.crearUsuario);

// Actualizar usuario (solo ADMIN)
router.put('/:id', verificarRol('ADMIN'), usuariosController.actualizarUsuario);

// Desactivar usuario (solo ADMIN)
router.delete('/:id', verificarRol('ADMIN'), usuariosController.eliminarUsuario);

// Activar usuario (solo ADMIN)
router.patch('/:id/activar', verificarRol('ADMIN'), usuariosController.activarUsuario);

module.exports = router;
