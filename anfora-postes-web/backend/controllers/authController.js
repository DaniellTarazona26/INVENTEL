// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar que se enviaron los datos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario por email
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    const usuario = result.rows[0];

    // Verificar si el usuario está activo
    if (usuario.estado !== 'activo') {
      return res.status(401).json({ 
        error: 'Usuario inactivo. Contacte al administrador.' 
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Actualizar último acceso
    await pool.query(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1',
      [usuario.id]
    );

    // Crear token JWT
    const token = jwt.sign(
      { 
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // Token válido por 8 horas
    );

    // Enviar respuesta
    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono,
        direccion: usuario.direccion
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error en el servidor' 
    });
  }
};

// REGISTRO (para admin crear usuarios)
const registro = async (req, res) => {
  const { nombre, email, password, rol, telefono, direccion } = req.body;

  try {
    // Validaciones
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ 
        error: 'Nombre, email, contraseña y rol son requeridos' 
      });
    }

    // Verificar si el email ya existe
    const emailExiste = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (emailExiste.rows.length > 0) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insertar usuario
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol, telefono, direccion)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nombre, email, rol, estado, fecha_creacion`,
      [nombre, email, passwordHash, rol, telefono || null, direccion || null]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error al crear usuario' 
    });
  }
};

// VERIFICAR TOKEN (para validar sesión)
const verificarSesion = async (req, res) => {
  try {
    // El middleware ya verificó el token
    const result = await pool.query(
      'SELECT id, nombre, email, rol, telefono, direccion, estado FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('Error verificando sesión:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// CAMBIAR CONTRASEÑA
const cambiarPassword = async (req, res) => {
  const { passwordActual, passwordNueva } = req.body;
  const usuarioId = req.usuario.id;

  try {
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ 
        error: 'Contraseña actual y nueva son requeridas' 
      });
    }

    // Obtener usuario
    const result = await pool.query(
      'SELECT password_hash FROM usuarios WHERE id = $1',
      [usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(
      passwordActual, 
      result.rows[0].password_hash
    );

    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Encriptar nueva contraseña
    const nuevaPasswordHash = await bcrypt.hash(passwordNueva, 10);

    // Actualizar contraseña
    await pool.query(
      'UPDATE usuarios SET password_hash = $1 WHERE id = $2',
      [nuevaPasswordHash, usuarioId]
    );

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  login,
  registro,
  verificarSesion,
  cambiarPassword
};
