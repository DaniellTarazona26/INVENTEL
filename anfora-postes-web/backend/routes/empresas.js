// backend/routes/empresas.js
const express = require('express')
const router = express.Router()
const empresasController = require('../controllers/empresasController')
const { verificarToken, verificarRol } = require('../middleware/authMiddleware')

router.use(verificarToken)

router.get('/todos', verificarRol('ADMIN'), empresasController.obtenerTodasAdmin)
router.get('/', empresasController.obtenerTodas)
router.get('/:id', empresasController.obtenerPorId)
router.post('/', verificarRol('ADMIN'), empresasController.crear)
router.put('/:id', verificarRol('ADMIN'), empresasController.actualizar)
router.delete('/:id', verificarRol('ADMIN'), empresasController.eliminar)

module.exports = router
