// backend/routes/empresas.js

const express = require('express')
const router = express.Router()
const empresasController = require('../controllers/empresasController')

router.get('/', empresasController.obtenerTodas)
router.get('/:id', empresasController.obtenerPorId)
router.post('/', empresasController.crear)

module.exports = router
