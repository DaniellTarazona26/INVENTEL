const pool = require('../config/database');

const obtenerOperadores = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, nit, contacto, telefono, email, estado, fecha_creacion 
       FROM operadores WHERE estado = 'activo' ORDER BY nombre ASC`
    );
    res.json({ success: true, operadores: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener operadores' });
  }
};

const obtenerOperadorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM operadores WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Operador no encontrado' });
    res.json({ success: true, operador: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener operador' });
  }
};

const obtenerTodos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, nit, contacto, telefono, email, estado, fecha_creacion 
       FROM operadores ORDER BY nombre ASC`
    );
    res.json({ success: true, operadores: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener operadores' });
  }
};

const crearOperador = async (req, res) => {
  const { nombre, nit, contacto, telefono, email } = req.body;
  try {
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

    const existe = await pool.query('SELECT id FROM operadores WHERE nombre = $1', [nombre]);
    if (existe.rows.length > 0)
      return res.status(400).json({ error: 'Ya existe un operador con ese nombre' });

    const result = await pool.query(
      `INSERT INTO operadores (nombre, nit, contacto, telefono, email)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, nit || null, contacto || null, telefono || null, email || null]
    );
    res.status(201).json({ success: true, message: 'Operador creado exitosamente', operador: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear operador' });
  }
};

const actualizarOperador = async (req, res) => {
  const { id } = req.params;
  const { nombre, nit, contacto, telefono, email, estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE operadores 
       SET nombre = COALESCE($1, nombre),
           nit = COALESCE($2, nit),
           contacto = COALESCE($3, contacto),
           telefono = COALESCE($4, telefono),
           email = COALESCE($5, email),
           estado = COALESCE($6, estado)
       WHERE id = $7 RETURNING *`,
      [nombre, nit, contacto, telefono, email, estado, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Operador no encontrado' });
    res.json({ success: true, message: 'Operador actualizado exitosamente', operador: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar operador' });
  }
};

const eliminarOperador = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM operadores WHERE id = $1 RETURNING id, nombre',
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Operador no encontrado' });
    res.json({ success: true, message: 'Operador eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar operador' });
  }
};

module.exports = {
  obtenerOperadores,
  obtenerOperadorPorId,
  obtenerTodos,
  crearOperador,
  actualizarOperador,
  eliminarOperador
};
