// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');

// Rutas públicas (sin token)
router.post('/login', authController.login);

// Rutas protegidas (requieren token)
router.get('/verificar', verificarToken, authController.verificarSesion);
router.post('/cambiar-password', verificarToken, authController.cambiarPassword);

// Solo ADMIN puede registrar usuarios
router.post('/registro', verificarToken, authController.registro);

module.exports = router;
