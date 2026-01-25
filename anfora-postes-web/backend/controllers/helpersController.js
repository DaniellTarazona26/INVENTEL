// backend/controllers/helpersController.js
const pool = require('../config/database');

const helpersController = {
  // Obtener operadores activos
  getOperadores: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, nombre 
        FROM operadores 
        WHERE estado = 'activo'
        ORDER BY nombre ASC
      `);
      
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error al obtener operadores:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener lista de operadores'
      });
    }
  },

  // Obtener ciudades
  getCiudades: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, nombre, departamento 
        FROM ciudades 
        ORDER BY nombre ASC
      `);
      
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error al obtener ciudades:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener lista de ciudades'
      });
    }
  },

  // Obtener barrios por ciudad
  getBarriosPorCiudad: async (req, res) => {
    try {
      const { ciudadId } = req.params;
      
      const result = await pool.query(`
        SELECT id, nombre 
        FROM barrios 
        WHERE ciudad_id = $1
        ORDER BY nombre ASC
      `, [ciudadId]);
      
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error al obtener barrios:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener lista de barrios'
      });
    }
  },

  // Obtener inspectores
  getInspectores: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, nombre 
        FROM usuarios 
        WHERE rol IN ('inspector', 'operador') 
        AND estado = 'activo'
        ORDER BY nombre ASC
      `);
      
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error al obtener inspectores:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener lista de inspectores'
      });
    }
  },

  // Obtener proyectos
  getProyectos: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, nombre 
        FROM proyectos 
        WHERE estado = 'activo'
        ORDER BY nombre ASC
      `);
      
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener lista de proyectos'
      });
    }
  }
};

module.exports = helpersController;
