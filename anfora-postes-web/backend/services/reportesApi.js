// backend/services/reportesApi.js
const pool = require('../config/database');

const reportesApi = {
  // ========== INVENTARIO POR OPERADOR ==========
  async getInventarioOperador(filtros) {
    const { operador, ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT_WS(' ', 
          i.direccion_campo1, 
          i.direccion_campo2, 
          i.direccion_campo3, 
          i.direccion_campo4
        ) as direccion_completa,
        i.codigo_estructura,
        i.tipo,
        i.material,
        i.altura
      FROM inventario i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (operador) {
      query += ` AND EXISTS (
        SELECT 1 FROM inventario_operadores io
        INNER JOIN operadores o ON io.operador_id = o.id
        WHERE io.inventario_id = i.id AND o.nombre = ?
      )`;
      params.push(operador);
    }
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = ?`;
      params.push(empresa);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY i.fecha_registro DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  async getInventarioOperadorCompleto(filtros) {
    const { operador, ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT_WS(' ', 
          i.direccion_campo1, 
          i.direccion_campo2, 
          i.direccion_campo3, 
          i.direccion_campo4
        ) as direccion_completa,
        i.codigo_estructura,
        i.tipo,
        i.material,
        i.altura,
        i.ano_fabricacion,
        i.templete,
        i.estado_templete,
        i.baja,
        i.alumbrado,
        i.tierra_electrica
      FROM inventario i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (operador) {
      query += ` AND EXISTS (
        SELECT 1 FROM inventario_operadores io
        INNER JOIN operadores o ON io.operador_id = o.id
        WHERE io.inventario_id = i.id AND o.nombre = ?
      )`;
      params.push(operador);
    }
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = ?`;
      params.push(empresa);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY i.fecha_registro DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  // ========== INVENTARIO POR INSPECTOR ==========
  async getInventarioInspector(filtros) {
    const { inspector, ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT_WS(' ', 
          i.direccion_campo1, 
          i.direccion_campo2, 
          i.direccion_campo3, 
          i.direccion_campo4
        ) as direccion_completa,
        i.inspector
      FROM inventario i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (inspector) {
      query += ` AND i.inspector = ?`;
      params.push(inspector);
    }
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = ?`;
      params.push(empresa);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY i.fecha_registro DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  async getInventarioInspectorCompleto(filtros) {
    const { inspector, ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT_WS(' ', 
          i.direccion_campo1, 
          i.direccion_campo2, 
          i.direccion_campo3, 
          i.direccion_campo4
        ) as direccion_completa,
        i.codigo_estructura,
        i.tipo,
        i.material,
        i.altura,
        i.inspector
      FROM inventario i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (inspector) {
      query += ` AND i.inspector = ?`;
      params.push(inspector);
    }
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = ?`;
      params.push(empresa);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY i.fecha_registro DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  // ========== REPORTE DE REDES ==========
  async getReporteRedes(filtros) {
    const { ciudad, barrio, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT_WS(' ', 
          i.direccion_campo1, 
          i.direccion_campo2, 
          i.direccion_campo3, 
          i.direccion_campo4
        ) as direccion_completa,
        i.material,
        i.altura,
        i.baja,
        i.baja_tipo_cable,
        i.alumbrado,
        i.alumbrado_tipo_cable
      FROM inventario i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (barrio) {
      query += ` AND b.nombre = ?`;
      params.push(barrio);
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = ?`;
      params.push(empresa);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY i.fecha_registro DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  async getReporteRedesCompleto(filtros) {
    const { ciudad, barrio, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT_WS(' ', 
          i.direccion_campo1, 
          i.direccion_campo2, 
          i.direccion_campo3, 
          i.direccion_campo4
        ) as direccion_completa,
        i.material,
        i.altura,
        i.baja,
        i.baja_tipo_cable,
        i.baja_estado_red,
        i.baja_continuidad_electrica,
        i.alumbrado,
        i.alumbrado_tipo_cable,
        i.alumbrado_estado_red,
        i.tierra_electrica,
        i.tierra_estado
      FROM inventario i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (barrio) {
      query += ` AND b.nombre = ?`;
      params.push(barrio);
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = ?`;
      params.push(empresa);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY i.fecha_registro DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  // ========== REPORTE DE PODA ==========
  async getReportePoda(filtros) {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT_WS(' ', 
          i.direccion_campo1, 
          i.direccion_campo2, 
          i.direccion_campo3, 
          i.direccion_campo4
        ) as direccion_completa,
        i.poda_arboles
      FROM inventario i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.poda_arboles = 'SI'
    `;
    
    const params = [];
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = ?`;
      params.push(empresa);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY i.fecha_registro DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  // ========== REPORTE DE ESTRUCTURAS ==========
  async getReporteEstructuras(filtros) {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT_WS(' ', 
          i.direccion_campo1, 
          i.direccion_campo2, 
          i.direccion_campo3, 
          i.direccion_campo4
        ) as direccion_completa,
        i.tipo,
        i.material,
        i.altura,
        i.estado_estructura
      FROM inventario i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = ?`;
      params.push(empresa);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY i.fecha_registro DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  async getReporteEstructurasCompleto(filtros) {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT_WS(' ', 
          i.direccion_campo1, 
          i.direccion_campo2, 
          i.direccion_campo3, 
          i.direccion_campo4
        ) as direccion_completa,
        i.tipo,
        i.material,
        i.altura,
        i.ano_fabricacion,
        i.templete,
        i.estado_templete,
        i.estado_estructura,
        i.desplomado,
        i.flectado,
        i.fracturado,
        i.hierro_base
      FROM inventario i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = ?`;
      params.push(empresa);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY i.fecha_registro DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  // ========== REPORTE DE PÉRDIDAS ==========
  async getReportePerdidas(filtros) {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT_WS(' ', 
          i.direccion_campo1, 
          i.direccion_campo2, 
          i.direccion_campo3, 
          i.direccion_campo4
        ) as direccion_completa,
        i.posible_fraude
      FROM inventario i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.posible_fraude = 'SI'
    `;
    
    const params = [];
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (empresa) {
      query += ` AND i.proyecto_id = ?`;
      params.push(empresa);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY i.fecha_registro DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  // ========== REPORTE DE FACTIBILIDAD ==========
  async getReporteFactibilidad(filtros) {
    const { ciudad, barrio, operario, proyecto, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        f.id,
        f.created_at,
        f.codigo_poste,
        c.nombre as ciudad,
        b.nombre as barrio,
        f.direccion,
        f.operario,
        p.nombre as proyecto
      FROM factibilidad f
      LEFT JOIN ciudades c ON f.ciudad_id = c.id
      LEFT JOIN barrios b ON f.barrio_id = b.id
      LEFT JOIN proyectos p ON f.proyecto_id = p.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (barrio) {
      query += ` AND b.nombre = ?`;
      params.push(barrio);
    }
    
    if (operario) {
      query += ` AND f.operario = ?`;
      params.push(operario);
    }
    
    if (proyecto) {
      query += ` AND f.proyecto_id = ?`;
      params.push(proyecto);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(f.created_at) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(f.created_at) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY f.created_at DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  },

  async getReporteFactibilidadCompleto(filtros) {
    const { ciudad, barrio, operario, proyecto, fechaInicial, fechaFinal } = filtros;
    
    let query = `
      SELECT 
        f.created_at,
        f.codigo_poste,
        c.nombre as ciudad,
        b.nombre as barrio,
        f.direccion,
        f.operario,
        p.nombre as proyecto,
        f.tipo_poste,
        f.altura_poste,
        f.coordenadas,
        f.observaciones
      FROM factibilidad f
      LEFT JOIN ciudades c ON f.ciudad_id = c.id
      LEFT JOIN barrios b ON f.barrio_id = b.id
      LEFT JOIN proyectos p ON f.proyecto_id = p.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (empresa) {
        query += ` AND p.operador_id = $${paramCount}`;
        params.push(empresa);
        paramCount++;
    }

    if (ciudad) {
      query += ` AND c.nombre = ?`;
      params.push(ciudad);
    }
    
    if (barrio) {
      query += ` AND b.nombre = ?`;
      params.push(barrio);
    }
    
    if (operario) {
      query += ` AND f.operario = ?`;
      params.push(operario);
    }
    
    if (proyecto) {
      query += ` AND f.proyecto_id = ?`;
      params.push(proyecto);
    }
    
    if (fechaInicial) {
      query += ` AND DATE(f.created_at) >= ?`;
      params.push(fechaInicial);
    }
    
    if (fechaFinal) {
      query += ` AND DATE(f.created_at) <= ?`;
      params.push(fechaFinal);
    }
    
    query += ` ORDER BY f.created_at DESC`;
    
    const [datos] = await pool.query(query, params);
    return datos;
  }
};

module.exports = reportesApi;
