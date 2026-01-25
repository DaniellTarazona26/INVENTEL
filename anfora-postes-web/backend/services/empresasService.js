// backend/services/empresasService.js

const pool = require('../config/database')

const empresasService = {
  
  // Obtener todas las empresas activas
  obtenerTodas: async () => {
    const query = `
      SELECT id, nombre, nit, contacto, telefono, email, estado
      FROM empresas
      WHERE estado = 'activo'
      ORDER BY nombre ASC
    `
    
    const result = await pool.query(query)
    return result.rows
  },

  // Obtener por ID
  obtenerPorId: async (id) => {
    const query = `
      SELECT id, nombre, nit, contacto, telefono, email, estado
      FROM empresas
      WHERE id = $1 AND estado = 'activo'
    `
    
    const result = await pool.query(query, [id])
    
    if (result.rows.length === 0) {
      throw new Error('Empresa no encontrada')
    }
    
    return result.rows[0]
  },

  // Crear empresa
  crear: async (datos) => {
    const query = `
      INSERT INTO empresas (nombre, nit, contacto, telefono, email, estado)
      VALUES ($1, $2, $3, $4, $5, 'activo')
      RETURNING *
    `
    
    const values = [
      datos.nombre,
      datos.nit || null,
      datos.contacto || null,
      datos.telefono || null,
      datos.email || null
    ]
    
    const result = await pool.query(query, values)
    return result.rows[0]
  }
}

module.exports = empresasService
