// backend/controllers/ciudadesController.js
const pool = require('../config/database');

// Obtener todas las ciudades
const obtenerCiudades = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, codigo, departamento, fecha_creacion 
       FROM ciudades 
       ORDER BY nombre ASC`
    );

    res.json({
      success: true,
      ciudades: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo ciudades:', error);
    res.status(500).json({ error: 'Error al obtener ciudades' });
  }
};

// Obtener ciudad por ID
const obtenerCiudadPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM ciudades WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }

    res.json({
      success: true,
      ciudad: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo ciudad:', error);
    res.status(500).json({ error: 'Error al obtener ciudad' });
  }
};

// Crear ciudad
const crearCiudad = async (req, res) => {
  const { nombre, codigo, departamento } = req.body;

  try {
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    // Verificar si ya existe
    const existe = await pool.query(
      'SELECT id FROM ciudades WHERE nombre = $1',
      [nombre]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Ya existe una ciudad con ese nombre' 
      });
    }

    const result = await pool.query(
      `INSERT INTO ciudades (nombre, codigo, departamento)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre, codigo || null, departamento || null]
    );

    res.status(201).json({
      success: true,
      message: 'Ciudad creada exitosamente',
      ciudad: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando ciudad:', error);
    res.status(500).json({ error: 'Error al crear ciudad' });
  }
};

// Actualizar ciudad
const actualizarCiudad = async (req, res) => {
  const { id } = req.params;
  const { nombre, codigo, departamento } = req.body;

  try {
    const result = await pool.query(
      `UPDATE ciudades 
       SET nombre = COALESCE($1, nombre),
           codigo = COALESCE($2, codigo),
           departamento = COALESCE($3, departamento)
       WHERE id = $4
       RETURNING *`,
      [nombre, codigo, departamento, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }

    res.json({
      success: true,
      message: 'Ciudad actualizada exitosamente',
      ciudad: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando ciudad:', error);
    res.status(500).json({ error: 'Error al actualizar ciudad' });
  }
};

// Eliminar ciudad
const eliminarCiudad = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si tiene barrios asociados
    const barrios = await pool.query(
      'SELECT COUNT(*) FROM barrios WHERE ciudad_id = $1',
      [id]
    );

    if (parseInt(barrios.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la ciudad porque tiene barrios asociados' 
      });
    }

    const result = await pool.query(
      'DELETE FROM ciudades WHERE id = $1 RETURNING nombre',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }

    res.json({
      success: true,
      message: 'Ciudad eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando ciudad:', error);
    res.status(500).json({ error: 'Error al eliminar ciudad' });
  }
};

// Obtener barrios de una ciudad
const obtenerBarriosPorCiudad = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT b.id, b.nombre, b.fecha_creacion
       FROM barrios b
       WHERE b.ciudad_id = $1
       ORDER BY b.nombre ASC`,
      [id]
    );

    res.json({
      success: true,
      barrios: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo barrios:', error);
    res.status(500).json({ error: 'Error al obtener barrios' });
  }
};

module.exports = {
  obtenerCiudades,
  obtenerCiudadPorId,
  crearCiudad,
  actualizarCiudad,
  eliminarCiudad,
  obtenerBarriosPorCiudad
};
