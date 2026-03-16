const bcrypt = require('bcrypt');
const pool = require('../config/database');

const obtenerUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, email, rol, telefono, direccion, estado, 
              fecha_creacion, ultimo_acceso 
       FROM usuarios 
       ORDER BY fecha_creacion DESC`
    );
    res.json({ success: true, usuarios: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, nombre, email, rol, telefono, direccion, estado, 
              fecha_creacion, ultimo_acceso 
       FROM usuarios WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ success: true, usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

const crearUsuario = async (req, res) => {
  const { nombre, email, password, rol, telefono, direccion } = req.body;
  try {
    if (!nombre || !email || !password || !rol)
      return res.status(400).json({ error: 'Nombre, email, contraseña y rol son requeridos' });

    const emailExiste = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (emailExiste.rows.length > 0)
      return res.status(400).json({ error: 'El email ya está registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol, telefono, direccion)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nombre, email, rol, telefono, direccion, estado, fecha_creacion`,
      [nombre, email, passwordHash, rol, telefono || null, direccion || null]
    );
    res.status(201).json({ success: true, message: 'Usuario creado exitosamente', usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, telefono, direccion, estado } = req.body;
  try {
    const usuarioExiste = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (usuarioExiste.rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });

    if (email) {
      const emailExiste = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1 AND id != $2', [email, id]
      );
      if (emailExiste.rows.length > 0)
        return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
    }

    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = COALESCE($1, nombre),
           email = COALESCE($2, email),
           rol = COALESCE($3, rol),
           telefono = COALESCE($4, telefono),
           direccion = COALESCE($5, direccion),
           estado = COALESCE($6, estado)
       WHERE id = $7
       RETURNING id, nombre, email, rol, telefono, direccion, estado`,
      [nombre, email, rol, telefono, direccion, estado, id]
    );
    res.json({ success: true, message: 'Usuario actualizado exitosamente', usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING id, nombre, email',
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

const activarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE usuarios SET estado = 'activo' WHERE id = $1
       RETURNING id, nombre, email, estado`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ success: true, message: 'Usuario activado exitosamente', usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al activar usuario' });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  activarUsuario
};
