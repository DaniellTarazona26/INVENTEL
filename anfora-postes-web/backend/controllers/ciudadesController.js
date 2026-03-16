const pool = require('../config/database');

const obtenerCiudades = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, codigo, departamento, estado, fecha_creacion 
       FROM ciudades WHERE estado = 'activo' ORDER BY nombre ASC`
    );
    res.json({ success: true, ciudades: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ciudades' });
  }
};

const obtenerTodasCiudades = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, codigo, departamento, estado, fecha_creacion 
       FROM ciudades ORDER BY nombre ASC`
    );
    res.json({ success: true, ciudades: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ciudades' });
  }
};

const obtenerCiudadPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM ciudades WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json({ success: true, ciudad: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ciudad' });
  }
};

const crearCiudad = async (req, res) => {
  const { nombre, codigo, departamento } = req.body;
  try {
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

    const existe = await pool.query('SELECT id FROM ciudades WHERE nombre = $1', [nombre]);
    if (existe.rows.length > 0)
      return res.status(400).json({ error: 'Ya existe una ciudad con ese nombre' });

    const result = await pool.query(
      `INSERT INTO ciudades (nombre, codigo, departamento) VALUES ($1, $2, $3) RETURNING *`,
      [nombre, codigo || null, departamento || null]
    );
    res.status(201).json({ success: true, message: 'Ciudad creada exitosamente', ciudad: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ciudad' });
  }
};

const actualizarCiudad = async (req, res) => {
  const { id } = req.params;
  const { nombre, codigo, departamento, estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE ciudades 
       SET nombre = COALESCE($1, nombre),
           codigo = COALESCE($2, codigo),
           departamento = COALESCE($3, departamento),
           estado = COALESCE($4, estado)
       WHERE id = $5 RETURNING *`,
      [nombre, codigo, departamento, estado, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json({ success: true, message: 'Ciudad actualizada exitosamente', ciudad: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ciudad' });
  }
};

const eliminarCiudad = async (req, res) => {
  const { id } = req.params;
  try {
    const barrios = await pool.query(
      `SELECT COUNT(*) FROM barrios WHERE ciudad_id = $1 AND estado = 'activo'`, [id]
    );
    if (parseInt(barrios.rows[0].count) > 0)
      return res.status(400).json({ error: 'No se puede eliminar la ciudad porque tiene barrios activos asociados' });

    const result = await pool.query(
      'DELETE FROM ciudades WHERE id = $1 RETURNING nombre', [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json({ success: true, message: 'Ciudad eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ciudad' });
  }
};

const obtenerBarriosPorCiudad = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT b.id, b.nombre, b.fecha_creacion
       FROM barrios b
       WHERE b.ciudad_id = $1 AND b.estado = 'activo'
       ORDER BY b.nombre ASC`,
      [id]
    );
    res.json({ success: true, barrios: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener barrios' });
  }
};

module.exports = {
  obtenerCiudades,
  obtenerTodasCiudades,
  obtenerCiudadPorId,
  crearCiudad,
  actualizarCiudad,
  eliminarCiudad,
  obtenerBarriosPorCiudad
};
