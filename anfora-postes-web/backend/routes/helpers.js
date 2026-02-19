const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const { verificarToken } = require('../middleware/authMiddleware')

router.get('/ciudades', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM ciudades WHERE estado = $1 ORDER BY nombre', ['activo'])
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/barrios/:ciudadId', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre FROM barrios WHERE ciudad_id = $1 AND estado = $2 ORDER BY nombre',
      [req.params.ciudadId, 'activo']
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/inspectores', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT inspector_nombre as nombre FROM inventarios WHERE inspector_nombre IS NOT NULL ORDER BY inspector_nombre'
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/operadores', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT operador_nombre as nombre
       FROM inventarios_operadores
       WHERE operador_nombre IS NOT NULL AND operador_nombre != ''
       ORDER BY operador_nombre`
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error obteniendo operadores:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/proyectos', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM empresas WHERE estado = $1 ORDER BY nombre', ['activo'])
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router

