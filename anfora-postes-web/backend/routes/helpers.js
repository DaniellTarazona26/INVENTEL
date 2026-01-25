// backend/routes/helpers.js
const express = require('express');
const router = express.Router();
const helpersController = require('../controllers/helpersController');

// Obtener lista de operadores activos
router.get('/operadores', helpersController.getOperadores);

// Obtener lista de ciudades
router.get('/ciudades', helpersController.getCiudades);

// Obtener barrios por ciudad
router.get('/barrios/:ciudadId', helpersController.getBarriosPorCiudad);

// Obtener lista de inspectores/usuarios
router.get('/inspectores', helpersController.getInspectores);

// Obtener lista de proyectos/empresas
router.get('/proyectos', helpersController.getProyectos);

module.exports = router;
