// backend/controllers/proyectosController.js
const pool = require('../config/database');

// Obtener todos los proyectos
const obtenerProyectos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
              e.nombre as empresa_nombre,
              o.nombre as operador_nombre,
              c.nombre as ciudad_nombre,
              u.nombre as supervisor_nombre
       FROM proyectos p
       LEFT JOIN empresas e ON p.empresa_id = e.id
       LEFT JOIN operadores o ON p.operador_id = o.id
       LEFT JOIN ciudades c ON p.ciudad_id = c.id
       LEFT JOIN usuarios u ON p.supervisor_id = u.id
       ORDER BY p.fecha_creacion DESC`
    );

    res.json({
      success: true,
      proyectos: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};

// Obtener proyecto por ID
const obtenerProyectoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.*, 
              e.nombre as empresa_nombre,
              o.nombre as operador_nombre,
              c.nombre as ciudad_nombre,
              u.nombre as supervisor_nombre
       FROM proyectos p
       LEFT JOIN empresas e ON p.empresa_id = e.id
       LEFT JOIN operadores o ON p.operador_id = o.id
       LEFT JOIN ciudades c ON p.ciudad_id = c.id
       LEFT JOIN usuarios u ON p.supervisor_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({
      success: true,
      proyecto: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo proyecto:', error);
    res.status(500).json({ error: 'Error al obtener proyecto' });
  }
};

// Crear proyecto
const crearProyecto = async (req, res) => {
  const { 
    nombre, empresa_id, operador_id, ciudad_id, numero_solicitud, 
    fecha_radicado, fecha_revision, supervisor_id, estado, descripcion 
  } = req.body;

  try {
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    if (!empresa_id) {
      return res.status(400).json({ error: 'La empresa es requerida' });
    }

    if (!ciudad_id) {
      return res.status(400).json({ error: 'La ciudad es requerida' });
    }

    // Verificar si el número de solicitud ya existe
    if (numero_solicitud) {
      const existe = await pool.query(
        'SELECT id FROM proyectos WHERE numero_solicitud = $1',
        [numero_solicitud]
      );

      if (existe.rows.length > 0) {
        return res.status(400).json({ 
          error: 'Ya existe un proyecto con ese número de solicitud' 
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO proyectos 
       (nombre, empresa_id, operador_id, ciudad_id, numero_solicitud, fecha_radicado, 
        fecha_revision, supervisor_id, estado, descripcion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        nombre, 
        empresa_id, 
        operador_id || null,
        ciudad_id, 
        numero_solicitud || null,
        fecha_radicado || null, 
        fecha_revision || null, 
        supervisor_id || null,
        estado || 'activo',
        descripcion || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente',
      proyecto: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando proyecto:', error);
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
};

// Actualizar proyecto
const actualizarProyecto = async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, empresa_id, operador_id, ciudad_id, numero_solicitud, 
    fecha_radicado, fecha_revision, supervisor_id, estado, descripcion 
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE proyectos 
       SET nombre = COALESCE($1, nombre),
           empresa_id = COALESCE($2, empresa_id),
           operador_id = COALESCE($3, operador_id),
           ciudad_id = COALESCE($4, ciudad_id),
           numero_solicitud = COALESCE($5, numero_solicitud),
           fecha_radicado = COALESCE($6, fecha_radicado),
           fecha_revision = COALESCE($7, fecha_revision),
           supervisor_id = COALESCE($8, supervisor_id),
           estado = COALESCE($9, estado),
           descripcion = COALESCE($10, descripcion),
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [nombre, empresa_id, operador_id, ciudad_id, numero_solicitud, fecha_radicado, 
       fecha_revision, supervisor_id, estado, descripcion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({
      success: true,
      message: 'Proyecto actualizado exitosamente',
      proyecto: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando proyecto:', error);
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
};

// Eliminar proyecto (soft delete)
const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE proyectos 
       SET estado = 'inactivo' 
       WHERE id = $1
       RETURNING id, nombre`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({
      success: true,
      message: 'Proyecto desactivado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
};

module.exports = {
  obtenerProyectos,
  obtenerProyectoPorId,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto
};
