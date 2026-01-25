// backend/models/reportesModel.js
const pool = require('../config/database');

const reportesModel = {
  // ========================================
  // 1. REPORTE DE INVENTARIO POR OPERADOR
  // ========================================
  getInventarioOperador: async (filtros) => {
    const { operador, ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.id,
        i.fecha_registro AS fecha,
        i.waypoint AS estructura,
        i.waypoint,
        i.latitud,
        i.longitud,
        c.nombre AS ciudad,
        b.nombre AS barrio,
        i.direccion_completa AS direccion,
        i.consecutivo_poste,
        i.codigo_estructura,
        i.operadores,
        -- Niveles de ocupación
        i.baja,
        i.alumbrado,
        -- Cruce en vía
        -- ... (todos los campos necesarios según el CSV)
        i.fecha_registro
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    // Filtrar por operador (buscar en campo JSONB)
    if (operador) {
      query += ` AND i.operadores @> $${paramIndex}::jsonb`;
      params.push(JSON.stringify([{ nombre: operador }]));
      paramIndex++;
    }
    
    // Filtrar por ciudad
    if (ciudad) {
      query += ` AND c.nombre = $${paramIndex}`;
      params.push(ciudad);
      paramIndex++;
    }
    
    // Filtrar por empresa/proyecto
    if (empresa) {
      query += ` AND i.proyecto_id = $${paramIndex}`;
      params.push(empresa);
      paramIndex++;
    }
    
    // Filtrar por rango de fechas
    if (fechaInicial && fechaFinal) {
      query += ` AND i.fecha_registro BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(fechaInicial, fechaFinal);
      paramIndex += 2;
    }
    
    query += ` ORDER BY i.fecha_registro ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // ========================================
  // 2. REPORTE DE INVENTARIO POR INSPECTOR
  // ========================================
  getInventarioInspector: async (filtros) => {
    const { inspector, ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.id,
        i.fecha_registro AS fecha,
        i.waypoint AS estructura,
        c.nombre AS ciudad,
        b.nombre AS barrio,
        i.direccion_completa AS direccion,
        i.fotos AS foto,
        u.nombre AS inspector
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      WHERE i.estado = 'activo'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (inspector) {
      query += ` AND u.nombre = $${paramIndex}`;
      params.push(inspector);
      paramIndex++;
    }
    
    if (ciudad) {
      query += ` AND c.nombre = $${paramIndex}`;
      params.push(ciudad);
      paramIndex++;
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = $${paramIndex}`;
      params.push(empresa);
      paramIndex++;
    }
    
    if (fechaInicial && fechaFinal) {
      query += ` AND i.fecha_registro BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(fechaInicial, fechaFinal);
      paramIndex += 2;
    }
    
    query += ` ORDER BY i.fecha_registro ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // ========================================
  // 3. REPORTE DE REDES
  // ========================================
  getReporteRedes: async (filtros) => {
    const { ciudad, barrio, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.id,
        i.fecha_registro AS fecha,
        i.waypoint AS estructura,
        i.waypoint,
        i.latitud,
        i.longitud,
        c.nombre AS ciudad,
        b.nombre AS barrio,
        i.direccion_completa AS direccion,
        i.tipo AS tipo_estructura,
        i.consecutivo_poste,
        i.marcada,
        i.material,
        i.carga_rotura,
        i.codigo_estructura,
        i.templete,
        i.estado_templete,
        i.altura,
        i.ano_fabricacion,
        -- Tipo de red
        i.baja,
        i.baja_tipo_cable,
        i.baja_estado_red,
        i.baja_continuidad_electrica,
        i.alumbrado,
        i.alumbrado_tipo_cable,
        i.alumbrado_estado_red,
        -- Lámparas
        i.lampara1_tipo,
        i.lampara1_codigo,
        i.lampara1_danada,
        i.lampara1_encendida,
        -- Tierra eléctrica
        i.tierra_electrica,
        i.tierra_estado,
        i.tierra_suelta,
        i.tierra_desconectada,
        i.tierra_rota,
        -- Estado estructura
        i.estado_estructura,
        i.desplomado,
        i.flectado,
        i.fracturado,
        i.hierro_base,
        i.poda_arboles,
        i.operadores
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (ciudad) {
      query += ` AND c.nombre = $${paramIndex}`;
      params.push(ciudad);
      paramIndex++;
    }
    
    if (barrio) {
      query += ` AND b.nombre = $${paramIndex}`;
      params.push(barrio);
      paramIndex++;
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = $${paramIndex}`;
      params.push(empresa);
      paramIndex++;
    }
    
    if (fechaInicial && fechaFinal) {
      query += ` AND i.fecha_registro BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(fechaInicial, fechaFinal);
      paramIndex += 2;
    }
    
    query += ` ORDER BY i.fecha_registro ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // ========================================
  // 4. REPORTE DE ESTRUCTURAS
  // ========================================
  getReporteEstructuras: async (filtros) => {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    // Similar al de redes pero con enfoque en elementos técnicos
    let query = `
      SELECT 
        i.*,
        c.nombre AS ciudad,
        b.nombre AS barrio
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (ciudad) {
      query += ` AND c.nombre = $${paramIndex}`;
      params.push(ciudad);
      paramIndex++;
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = $${paramIndex}`;
      params.push(empresa);
      paramIndex++;
    }
    
    if (fechaInicial && fechaFinal) {
      query += ` AND i.fecha_registro BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(fechaInicial, fechaFinal);
      paramIndex += 2;
    }
    
    query += ` ORDER BY i.fecha_registro ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // ========================================
  // 5. REPORTE DE PODA
  // ========================================
  getReportePoda: async (filtros) => {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.id,
        i.fecha_registro AS fecha,
        i.waypoint AS estructura,
        i.consecutivo_poste,
        i.codigo_estructura,
        i.latitud,
        i.longitud,
        c.nombre AS ciudad,
        b.nombre AS barrio,
        i.direccion_completa AS direccion,
        p.nombre AS empresa
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      LEFT JOIN proyectos p ON i.proyecto_id = p.id
      WHERE i.estado = 'activo'
      AND i.poda_arboles = 'SI'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (ciudad) {
      query += ` AND c.nombre = $${paramIndex}`;
      params.push(ciudad);
      paramIndex++;
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = $${paramIndex}`;
      params.push(empresa);
      paramIndex++;
    }
    
    if (fechaInicial && fechaFinal) {
      query += ` AND i.fecha_registro BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(fechaInicial, fechaFinal);
      paramIndex += 2;
    }
    
    query += ` ORDER BY i.fecha_registro ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // ========================================
  // 6. REPORTE DE FACTIBILIDAD
  // ========================================
  getReporteFactibilidad: async (filtros) => {
    const { ciudad, barrio, operario, proyecto, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        f.*,
        c.nombre AS ciudad,
        b.nombre AS barrio,
        o.nombre AS operador,
        p.nombre AS proyecto,
        u.nombre AS inspector
      FROM factibilidades f
      LEFT JOIN ciudades c ON f.ciudad_id = c.id
      LEFT JOIN barrios b ON f.barrio_id = b.id
      LEFT JOIN operadores o ON f.operador_id = o.id
      LEFT JOIN proyectos p ON f.proyecto_id = p.id
      LEFT JOIN usuarios u ON f.usuario_id = u.id
      WHERE f.estado = 'activo'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (ciudad) {
      query += ` AND c.nombre = $${paramIndex}`;
      params.push(ciudad);
      paramIndex++;
    }
    
    if (barrio) {
      query += ` AND b.nombre = $${paramIndex}`;
      params.push(barrio);
      paramIndex++;
    }
    
    if (operario) {
      query += ` AND u.nombre = $${paramIndex}`;
      params.push(operario);
      paramIndex++;
    }
    
    if (proyecto) {
      query += ` AND f.proyecto_id = $${paramIndex}`;
      params.push(proyecto);
      paramIndex++;
    }
    
    if (fechaInicial && fechaFinal) {
      query += ` AND f.created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(fechaInicial, fechaFinal);
      paramIndex += 2;
    }
    
    query += ` ORDER BY f.created_at ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // ========================================
  // 7. REPORTE DE FACTIBILIDAD OPERADOR
  // ========================================
  getReporteFactibilidadOperador: async (filtros) => {
    const { fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        f.*,
        c.nombre AS ciudad,
        b.nombre AS barrio,
        o.nombre AS operador
      FROM factibilidades f
      LEFT JOIN ciudades c ON f.ciudad_id = c.id
      LEFT JOIN barrios b ON f.barrio_id = b.id
      LEFT JOIN operadores o ON f.operador_id = o.id
      WHERE f.estado = 'activo'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (fechaInicial && fechaFinal) {
      query += ` AND f.created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(fechaInicial, fechaFinal);
      paramIndex += 2;
    }
    
    query += ` ORDER BY f.created_at ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // ========================================
  // 8. REPORTE DE PÉRDIDAS
  // ========================================
  getReportePerdidas: async (filtros) => {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    // Este reporte necesita criterios específicos de "pérdidas"
    // Por ahora uso un query genérico, ajustar según necesidad
    let query = `
      SELECT 
        i.*,
        c.nombre AS ciudad,
        b.nombre AS barrio
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (ciudad) {
      query += ` AND c.nombre = $${paramIndex}`;
      params.push(ciudad);
      paramIndex++;
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = $${paramIndex}`;
      params.push(empresa);
      paramIndex++;
    }
    
    if (fechaInicial && fechaFinal) {
      query += ` AND i.fecha_registro BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(fechaInicial, fechaFinal);
      paramIndex += 2;
    }
    
    query += ` ORDER BY i.fecha_registro ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  }
};

module.exports = reportesModel;
