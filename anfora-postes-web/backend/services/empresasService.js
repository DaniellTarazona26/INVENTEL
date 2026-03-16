const pool = require('../config/database')

const empresasService = {
  obtenerTodas: async () => {
    const result = await pool.query(
      `SELECT id, nombre, nit, contacto, telefono, email, estado
       FROM empresas WHERE estado = 'activo' ORDER BY nombre ASC`
    )
    return result.rows
  },

  obtenerTodasAdmin: async () => {
    const result = await pool.query(
      `SELECT id, nombre, nit, contacto, telefono, email, estado
       FROM empresas ORDER BY nombre ASC`
    )
    return result.rows
  },

  obtenerPorId: async (id) => {
    const result = await pool.query(
      `SELECT id, nombre, nit, contacto, telefono, email, estado
       FROM empresas WHERE id = $1`, [id]
    )
    if (result.rows.length === 0) throw new Error('Empresa no encontrada')
    return result.rows[0]
  },

  crear: async (datos) => {
    const result = await pool.query(
      `INSERT INTO empresas (nombre, nit, contacto, telefono, email, estado)
       VALUES ($1, $2, $3, $4, $5, 'activo') RETURNING *`,
      [datos.nombre, datos.nit || null, datos.contacto || null,
       datos.telefono || null, datos.email || null]
    )
    return result.rows[0]
  },

  actualizar: async (id, datos) => {
    const result = await pool.query(
      `UPDATE empresas SET
         nombre = COALESCE($1, nombre),
         nit = COALESCE($2, nit),
         contacto = COALESCE($3, contacto),
         telefono = COALESCE($4, telefono),
         email = COALESCE($5, email),
         estado = COALESCE($6, estado)
       WHERE id = $7 RETURNING *`,
      [datos.nombre, datos.nit, datos.contacto,
       datos.telefono, datos.email, datos.estado, id]
    )
    if (result.rows.length === 0) throw new Error('Empresa no encontrada')
    return result.rows[0]
  },

  eliminar: async (id) => {
    const result = await pool.query(
      'DELETE FROM empresas WHERE id = $1 RETURNING id', [id]
    )
    if (result.rows.length === 0) throw new Error('Empresa no encontrada')
    return result.rows[0]
  }
}

module.exports = empresasService

