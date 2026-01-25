// backend/controllers/barriosController.js
const pool = require('../config/database');

// Obtener todos los barrios
const obtenerBarrios = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.nombre, b.ciudad_id, b.fecha_creacion,
              c.nombre as ciudad_nombre
       FROM barrios b
       LEFT JOIN ciudades c ON b.ciudad_id = c.id
       ORDER BY c.nombre, b.nombre ASC`
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

// Obtener barrio por ID
const obtenerBarrioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT b.*, c.nombre as ciudad_nombre
       FROM barrios b
       LEFT JOIN ciudades c ON b.ciudad_id = c.id
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Barrio no encontrado' });
    }

    res.json({
      success: true,
      barrio: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo barrio:', error);
    res.status(500).json({ error: 'Error al obtener barrio' });
  }
};

// Crear barrio
const crearBarrio = async (req, res) => {
  const { nombre, ciudad_id } = req.body;

  try {
    if (!nombre || !ciudad_id) {
      return res.status(400).json({ 
        error: 'El nombre y la ciudad son requeridos' 
      });
    }

    // Verificar que la ciudad existe
    const ciudadExiste = await pool.query(
      'SELECT id FROM ciudades WHERE id = $1',
      [ciudad_id]
    );

    if (ciudadExiste.rows.length === 0) {
      return res.status(404).json({ error: 'La ciudad no existe' });
    }

    // Verificar si ya existe el barrio en esa ciudad
    const existe = await pool.query(
      'SELECT id FROM barrios WHERE nombre = $1 AND ciudad_id = $2',
      [nombre, ciudad_id]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Ya existe un barrio con ese nombre en esta ciudad' 
      });
    }

    const result = await pool.query(
      `INSERT INTO barrios (nombre, ciudad_id)
       VALUES ($1, $2)
       RETURNING *`,
      [nombre, ciudad_id]
    );

    res.status(201).json({
      success: true,
      message: 'Barrio creado exitosamente',
      barrio: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando barrio:', error);
    res.status(500).json({ error: 'Error al crear barrio' });
  }
};

// Actualizar barrio
const actualizarBarrio = async (req, res) => {
  const { id } = req.params;
  const { nombre, ciudad_id } = req.body;

  try {
    // Si se cambia la ciudad, verificar que existe
    if (ciudad_id) {
      const ciudadExiste = await pool.query(
        'SELECT id FROM ciudades WHERE id = $1',
        [ciudad_id]
      );

      if (ciudadExiste.rows.length === 0) {
        return res.status(404).json({ error: 'La ciudad no existe' });
      }
    }

    const result = await pool.query(
      `UPDATE barrios 
       SET nombre = COALESCE($1, nombre),
           ciudad_id = COALESCE($2, ciudad_id)
       WHERE id = $3
       RETURNING *`,
      [nombre, ciudad_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Barrio no encontrado' });
    }

    res.json({
      success: true,
      message: 'Barrio actualizado exitosamente',
      barrio: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando barrio:', error);
    res.status(500).json({ error: 'Error al actualizar barrio' });
  }
};

// Eliminar barrio
const eliminarBarrio = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM barrios WHERE id = $1 RETURNING nombre',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Barrio no encontrado' });
    }

    res.json({
      success: true,
      message: 'Barrio eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando barrio:', error);
    res.status(500).json({ error: 'Error al eliminar barrio' });
  }
};

module.exports = {
  obtenerBarrios,
  obtenerBarrioPorId,
  crearBarrio,
  actualizarBarrio,
  eliminarBarrio
};
