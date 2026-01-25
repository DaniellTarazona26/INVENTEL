// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const operadoresRoutes = require('./routes/operadoresRoutes');
const ciudadesRoutes = require('./routes/ciudadesRoutes');
const barriosRoutes = require('./routes/barriosRoutes');
const proyectosRoutes = require('./routes/proyectosRoutes');
const inventariosRoutes = require('./routes/inventarios')
const factibilidadesRoutes = require('./routes/factibilidades');
const reportesRoutes = require('./routes/reportes');
const helpersRoutes = require('./routes/helpers');
const empresasRoutes = require('./routes/empresas')

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API de INVENTEL funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Ruta para verificar conexión a la base de datos
app.get('/api/health', async (req, res) => {
  const pool = require('./config/database');
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK',
      database: 'Conectada',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      database: 'Desconectada',
      error: error.message
    });
  }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/operadores', operadoresRoutes);
app.use('/api/ciudades', ciudadesRoutes);
app.use('/api/barrios', barriosRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/inventarios', inventariosRoutes) 
app.use('/api/factibilidades', factibilidadesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/helpers', helpersRoutes);
app.use('/api/empresas', empresasRoutes)

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor INVENTEL iniciado`);
  console.log(`📡 API disponible en: http://localhost:${PORT}`);
  console.log(`🗄️  Base de datos: ${process.env.DB_NAME}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV}\n`);
});

module.exports = app;
