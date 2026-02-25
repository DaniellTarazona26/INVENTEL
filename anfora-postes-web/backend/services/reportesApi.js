const pool = require('../config/database')

const reportesApi = {

  getInventarioOperador: async (filtros) => {
    const { operador, ciudad, empresa, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        i.direccion_completa,
        i.codigo_estructura,
        i.consecutivo_poste,
        i.tipo,
        i.material,
        i.altura,
        i.estado_estructura,
        i.baja,
        i.alumbrado,
        i.tierra_electrica,
        COALESCE(
          (SELECT STRING_AGG(io.operador_nombre, ', ') 
           FROM inventarios_operadores io 
           WHERE io.inventario_id = i.id),
          'SIN OPERADORES'
        ) as operadores_lista
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `

    const params = []
    let paramCount = 1

    if (operador) {
      query += ` AND EXISTS (
        SELECT 1 FROM inventarios_operadores io
        WHERE io.inventario_id = i.id
        AND io.operador_nombre = $${paramCount}
      )`
      params.push(operador)
      paramCount++
    }

    if (ciudad) {
      query += ` AND c.nombre = $${paramCount}`
      params.push(ciudad)
      paramCount++
    }

    if (empresa) {
      query += ` AND i.empresa_id = $${paramCount}`
      params.push(empresa)
      paramCount++
    }

    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= $${paramCount}`
      params.push(fechaInicial)
      paramCount++
    }

    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= $${paramCount}`
      params.push(fechaFinal)
      paramCount++
    }

    query += ` ORDER BY i.fecha_registro DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getInventarioOperadorCompleto: async (filtros) => {
    const { operador, ciudad, empresa, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        i.id as consecutivo,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        i.direccion_completa,
        i.codigo_estructura,
        i.consecutivo_poste,
        i.tipo,
        i.material,
        i.altura,
        i.ano_fabricacion,
        i.templete,
        i.estado_templete,
        i.estado_estructura,
        i.baja,
        i.alumbrado,
        i.tierra_electrica,
        io.operador_nombre,
        io.herrajes,
        io.coaxial,
        io.telefonico,
        io.fibra_optica,
        io.utp,
        io.guaya,
        io.total_cables,
        io.marquilla,
        io.cruce_via,
        io.cruce_estado,
        io.cruce_diagonal,
        io.cruce_sin_red,
        io.cruce_acometida,
        io.cruce_desalineado,
        io.activo_amplificador,
        io.activo_nodo_optico,
        io.activo_fuente_poder,
        io.activo_amplificador_110v,
        io.activo_nodo_optico_110v,
        io.activo_fuente_poder_110v,
        io.activo_switch_110v,
        io.pasivo_caja_nap,
        io.pasivo_caja_empalme,
        io.pasivo_reserva,
        io.pasivo_bajante,
        io.observaciones as operador_observaciones
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      INNER JOIN inventarios_operadores io ON io.inventario_id = i.id
      WHERE i.estado = 'activo'
    `

    const params = []
    let paramCount = 1

    if (operador) {
      query += ` AND io.operador_nombre = $${paramCount}`
      params.push(operador)
      paramCount++
    }

    if (ciudad) {
      query += ` AND c.nombre = $${paramCount}`
      params.push(ciudad)
      paramCount++
    }

    if (empresa) {
      query += ` AND i.empresa_id = $${paramCount}`
      params.push(empresa)
      paramCount++
    }

    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= $${paramCount}`
      params.push(fechaInicial)
      paramCount++
    }

    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= $${paramCount}`
      params.push(fechaFinal)
      paramCount++
    }

    query += ` ORDER BY i.fecha_registro DESC, io.operador_nombre ASC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getInventarioInspector: async (filtros) => {
    const { inspector, ciudad, empresa, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        i.direccion_completa,
        i.codigo_estructura,
        i.tipo,
        i.material,
        i.altura,
        i.estado_estructura,
        i.baja,
        i.alumbrado,
        i.tierra_electrica,
        i.inspector_nombre,
        COALESCE(
          (SELECT COUNT(*) FROM inventarios_operadores io WHERE io.inventario_id = i.id),
          0
        ) as total_operadores
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `

    const params = []
    let paramCount = 1

    if (inspector) {
      query += ` AND i.inspector_nombre = $${paramCount}`
      params.push(inspector)
      paramCount++
    }

    if (ciudad) {
      query += ` AND c.nombre = $${paramCount}`
      params.push(ciudad)
      paramCount++
    }

    if (empresa) {
      query += ` AND i.empresa_id = $${paramCount}`
      params.push(empresa)
      paramCount++
    }

    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= $${paramCount}`
      params.push(fechaInicial)
      paramCount++
    }

    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= $${paramCount}`
      params.push(fechaFinal)
      paramCount++
    }

    query += ` ORDER BY i.fecha_registro DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getInventarioInspectorCompleto: async (filtros) => {
    const { inspector, ciudad, empresa, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        i.id as consecutivo,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        i.direccion_completa,
        i.codigo_estructura,
        i.consecutivo_poste,
        i.tipo,
        i.marcada,
        i.material,
        i.carga_rotura,
        i.altura,
        i.ano_fabricacion,
        i.templete,
        i.estado_templete,
        i.estado_estructura,
        i.desplomado,
        i.flectado,
        i.fracturado,
        i.hierro_base,
        i.baja,
        i.baja_tipo_cable,
        i.baja_estado_red,
        i.baja_continuidad_electrica,
        i.media,
        i.media_tipo_cable,
        i.media_estado_red,
        i.media_continuidad_electrica,
        i.alumbrado,
        i.alumbrado_tipo_cable,
        i.tierra_electrica,
        i.tierra_estado,
        i.bajantes_electricos,
        i.inspector_nombre,
        COALESCE(
          (SELECT STRING_AGG(io.operador_nombre, ', ') 
           FROM inventarios_operadores io 
           WHERE io.inventario_id = i.id),
          'SIN OPERADORES'
        ) as operadores_lista,
        COALESCE(
          (SELECT COUNT(*) FROM inventarios_operadores io WHERE io.inventario_id = i.id),
          0
        ) as total_operadores
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `

    const params = []
    let paramCount = 1

    if (inspector) {
      query += ` AND i.inspector_nombre = $${paramCount}`
      params.push(inspector)
      paramCount++
    }

    if (ciudad) {
      query += ` AND c.nombre = $${paramCount}`
      params.push(ciudad)
      paramCount++
    }

    if (empresa) {
      query += ` AND i.empresa_id = $${paramCount}`
      params.push(empresa)
      paramCount++
    }

    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= $${paramCount}`
      params.push(fechaInicial)
      paramCount++
    }

    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= $${paramCount}`
      params.push(fechaFinal)
      paramCount++
    }

    query += ` ORDER BY i.fecha_registro DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getReporteRedes: async (filtros) => {
    const { ciudad, barrio, empresa, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        i.direccion_completa,
        i.tipo,
        i.consecutivo_poste,
        i.marcada,
        i.material,
        i.carga_rotura,
        i.codigo_estructura,
        i.templete,
        i.estado_templete,
        i.altura,
        i.ano_fabricacion,
        i.estado_estructura,
        i.baja,
        i.baja_tipo_cable,
        i.baja_estado_red,
        i.caja1,
        i.caja2,
        i.alumbrado,
        i.alumbrado_tipo_cable,
        i.alumbrado_estado_red,
        i.lampara1_tipo,
        i.lampara1_codigo,
        i.lampara1_danada,
        i.lampara1_encendida,
        i.lampara2_tipo,
        i.lampara2_codigo,
        i.lampara2_danada,
        i.lampara2_encendida,
        i.tierra_electrica,
        i.tierra_estado,
        i.bajantes_electricos,
        COALESCE(
          (SELECT STRING_AGG(io.operador_nombre, ', ')
           FROM inventarios_operadores io
           WHERE io.inventario_id = i.id),
          'SIN OPERADORES'
        ) as operadores_lista
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `

    const params = []
    let paramCount = 1

    if (ciudad) {
      query += ` AND c.nombre = $${paramCount}`
      params.push(ciudad)
      paramCount++
    }

    if (barrio) {
      query += ` AND b.nombre = $${paramCount}`
      params.push(barrio)
      paramCount++
    }

    if (empresa) {
      query += ` AND i.empresa_id = $${paramCount}`
      params.push(empresa)
      paramCount++
    }

    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= $${paramCount}`
      params.push(fechaInicial)
      paramCount++
    }

    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= $${paramCount}`
      params.push(fechaFinal)
      paramCount++
    }

    query += ` ORDER BY i.fecha_registro DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getReporteRedesCompleto: async (filtros) => {
    const { ciudad, barrio, empresa, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        i.id as consecutivo,
        c.nombre as ciudad,
        b.nombre as barrio,
        i.direccion_completa,
        i.tipo,
        i.consecutivo_poste,
        i.marcada,
        i.material,
        i.carga_rotura,
        i.codigo_estructura,
        i.templete,
        i.estado_templete,
        i.altura,
        i.ano_fabricacion,
        i.estado_estructura,
        i.baja,
        i.baja_tipo_cable,
        i.baja_estado_red,
        i.baja_continuidad_electrica,
        i.caja1,
        i.caja2,
        i.alumbrado,
        i.alumbrado_tipo_cable,
        i.alumbrado_estado_red,
        i.lampara1_tipo,
        i.lampara1_codigo,
        i.lampara1_danada,
        i.lampara1_encendida,
        i.lampara2_tipo,
        i.lampara2_codigo,
        i.lampara2_danada,
        i.lampara2_encendida,
        i.tierra_electrica,
        i.tierra_estado,
        i.tierra_suelta,
        i.tierra_desconectada,
        i.tierra_rota,
        i.bajantes_electricos,
        i.lampara,
        i.camara_tv,
        i.corneta,
        i.aviso,
        i.caja_metalica,
        i.otro,
        COALESCE(
          (SELECT STRING_AGG(io.operador_nombre, ', ')
           FROM inventarios_operadores io
           WHERE io.inventario_id = i.id),
          'SIN OPERADORES'
        ) as operadores_lista
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `

    const params = []
    let paramCount = 1

    if (ciudad) {
      query += ` AND c.nombre = $${paramCount}`
      params.push(ciudad)
      paramCount++
    }

    if (barrio) {
      query += ` AND b.nombre = $${paramCount}`
      params.push(barrio)
      paramCount++
    }

    if (empresa) {
      query += ` AND i.empresa_id = $${paramCount}`
      params.push(empresa)
      paramCount++
    }

    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= $${paramCount}`
      params.push(fechaInicial)
      paramCount++
    }

    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= $${paramCount}`
      params.push(fechaFinal)
      paramCount++
    }

    query += ` ORDER BY i.fecha_registro DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getReportePoda: async (filtros) => {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        i.direccion_completa,
        i.poda_arboles
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo' AND i.poda_arboles = 'SI'
    `

    const params = []
    let paramCount = 1

    if (ciudad) {
      query += ` AND c.nombre = $${paramCount}`
      params.push(ciudad)
      paramCount++
    }

    if (empresa) {
      query += ` AND i.empresa_id = $${paramCount}`
      params.push(empresa)
      paramCount++
    }

    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= $${paramCount}`
      params.push(fechaInicial)
      paramCount++
    }

    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= $${paramCount}`
      params.push(fechaFinal)
      paramCount++
    }

    query += ` ORDER BY i.fecha_registro DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getReporteEstructuras: async (filtros) => {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        i.direccion_completa,
        i.tipo,
        i.consecutivo_poste,
        i.marcada,
        i.material,
        i.carga_rotura,
        i.codigo_estructura,
        i.altura,
        i.ano_fabricacion,
        i.templete,
        i.estado_templete,
        i.estado_estructura,
        i.desplomado,
        i.flectado,
        i.fracturado,
        i.hierro_base
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `

    const params = []
    let paramCount = 1

    if (ciudad) {
      query += ` AND c.nombre = $${paramCount}`
      params.push(ciudad)
      paramCount++
    }

    if (empresa) {
      query += ` AND i.empresa_id = $${paramCount}`
      params.push(empresa)
      paramCount++
    }

    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= $${paramCount}`
      params.push(fechaInicial)
      paramCount++
    }

    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= $${paramCount}`
      params.push(fechaFinal)
      paramCount++
    }

    query += ` ORDER BY i.fecha_registro DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getReporteEstructurasCompleto: async (filtros) => {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        i.id as consecutivo,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        i.direccion_completa,
        i.tipo,
        i.consecutivo_poste,
        i.marcada,
        i.material,
        i.carga_rotura,
        i.codigo_estructura,
        i.altura,
        i.ano_fabricacion,
        i.templete,
        i.estado_templete,
        i.estado_estructura,
        i.desplomado,
        i.flectado,
        i.fracturado,
        i.hierro_base,
        i.baja,
        i.baja_tipo_cable,
        i.baja_estado_red,
        i.baja_continuidad_electrica,
        i.media,
        i.media_tipo_cable,
        i.media_estado_red,
        i.media_continuidad_electrica,
        i.caja1,
        i.caja2,
        i.caja3,
        i.caja4,
        i.alumbrado,
        i.alumbrado_tipo_cable,
        i.alumbrado_estado_red,
        i.bajantes_electricos,
        i.poda_arboles,
        i.posible_fraude
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo'
    `

    const params = []
    let paramCount = 1

    if (ciudad) {
      query += ` AND c.nombre = $${paramCount}`
      params.push(ciudad)
      paramCount++
    }

    if (empresa) {
      query += ` AND i.empresa_id = $${paramCount}`
      params.push(empresa)
      paramCount++
    }

    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= $${paramCount}`
      params.push(fechaInicial)
      paramCount++
    }

    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= $${paramCount}`
      params.push(fechaFinal)
      paramCount++
    }

    query += ` ORDER BY i.fecha_registro DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getReportePerdidas: async (filtros) => {
    const { ciudad, empresa, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        i.id,
        i.fecha_registro,
        i.waypoint,
        c.nombre as ciudad,
        b.nombre as barrio,
        i.direccion_completa,
        i.posible_fraude
      FROM inventarios i
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN barrios b ON i.barrio_id = b.id
      WHERE i.estado = 'activo' AND i.posible_fraude = 'SI'
    `

    const params = []
    let paramCount = 1

    if (ciudad) {
      query += ` AND c.nombre = $${paramCount}`
      params.push(ciudad)
      paramCount++
    }

    if (empresa) {
      query += ` AND i.empresa_id = $${paramCount}`
      params.push(empresa)
      paramCount++
    }

    if (fechaInicial) {
      query += ` AND DATE(i.fecha_registro) >= $${paramCount}`
      params.push(fechaInicial)
      paramCount++
    }

    if (fechaFinal) {
      query += ` AND DATE(i.fecha_registro) <= $${paramCount}`
      params.push(fechaFinal)
      paramCount++
    }

    query += ` ORDER BY i.fecha_registro DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getReporteFactibilidad: async (filtros) => {
    const { ciudad, barrio, operador, proyecto, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        f.id,
        f.created_at,
        f.codigo_poste,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT(f.direccion_via, ' ', f.direccion_numero) as direccion,
        o.nombre as operador,
        p.nombre as proyecto,
        CONCAT(f.latitud, ', ', f.longitud) as coordenadas,
        f.poste_material,
        f.poste_altura,
        f.poste_resistencia,
        f.poste_uso_carga,
        f.poste_retenida,
        f.poste_estado,
        f.nivel_tension_at,
        f.nivel_tension_mt,
        f.nivel_tension_bt,
        f.nivel_tension_ap,
        f.elem_transformador,
        f.elem_seccionador,
        f.elem_corta_circuito,
        f.elem_medidor,
        f.elem_bajante_electrico,
        f.tierra_electrica,
        f.telp_pas_cables,
        f.telp_pas_c_coaxial,
        f.telp_pas_c_fibra,
        f.telp_pas_c_drop,
        f.telp_pas_c_rg11,
        f.telp_pas_cajempalme,
        f.telp_pas_cajgpon,
        f.telp_pas_stp,
        f.telp_pas_bajantes,
        f.telp_pas_reservas,
        f.telp_act_amplificadores,
        f.telp_act_fuentes,
        f.telp_act_nodooptico,
        f.telp_act_antena,
        f.telp_act_camara_vigil,
        f.telp_mth_retencion,
        f.telp_mth_suspencion,
        f.telp_retencion,
        f.telp_ccoaxial,
        f.telp_cfibra,
        f.tipo_cable,
        f.fijacion_herraje,
        f.observacion_tendido,
        f.checkboxes_tendido,
        f.checkboxes_sugerencias,
        f.observaciones
      FROM factibilidades f
      LEFT JOIN ciudades c ON f.ciudad_id = c.id
      LEFT JOIN barrios b ON f.barrio_id = b.id
      LEFT JOIN proyectos p ON f.proyecto_id = p.id
      LEFT JOIN operadores o ON f.operador_id = o.id
      WHERE f.estado = 'activo'
    `

    const params = []
    let paramCount = 1

    if (ciudad) { query += ` AND c.nombre = $${paramCount}`; params.push(ciudad); paramCount++ }
    if (barrio) { query += ` AND b.nombre = $${paramCount}`; params.push(barrio); paramCount++ }
    if (operador) { query += ` AND f.operador_id = $${paramCount}`; params.push(operador); paramCount++ }
    if (proyecto) { query += ` AND f.proyecto_id = $${paramCount}`; params.push(proyecto); paramCount++ }
    if (fechaInicial) { query += ` AND DATE(f.created_at) >= $${paramCount}`; params.push(fechaInicial); paramCount++ }
    if (fechaFinal) { query += ` AND DATE(f.created_at) <= $${paramCount}`; params.push(fechaFinal); paramCount++ }

    query += ` ORDER BY f.created_at DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getReporteFactibilidadCompleto: async (filtros) => {
    const { ciudad, barrio, operador, proyecto, fechaInicial, fechaFinal } = filtros

    let query = `
      SELECT 
        f.created_at,
        f.codigo_poste,
        c.nombre as ciudad,
        b.nombre as barrio,
        CONCAT(f.direccion_via, ' ', f.direccion_numero) as direccion,
        o.nombre as operador,
        p.nombre as proyecto,
        CONCAT(f.latitud, ', ', f.longitud) as coordenadas,
        f.poste_material,
        f.poste_altura,
        f.poste_resistencia,
        f.poste_uso_carga,
        f.poste_retenida,
        f.poste_estado,
        f.nivel_tension_at,
        f.nivel_tension_mt,
        f.nivel_tension_bt,
        f.nivel_tension_ap,
        f.elem_transformador,
        f.elem_seccionador,
        f.elem_corta_circuito,
        f.elem_medidor,
        f.elem_bajante_electrico,
        f.tierra_electrica,
        f.telp_pas_cables,
        f.telp_pas_c_coaxial,
        f.telp_pas_c_fibra,
        f.telp_pas_c_drop,
        f.telp_pas_c_rg11,
        f.telp_pas_cajempalme,
        f.telp_pas_cajgpon,
        f.telp_pas_stp,
        f.telp_pas_bajantes,
        f.telp_pas_reservas,
        f.telp_act_amplificadores,
        f.telp_act_fuentes,
        f.telp_act_nodooptico,
        f.telp_act_antena,
        f.telp_act_camara_vigil,
        f.telp_mth_retencion,
        f.telp_mth_suspencion,
        f.telp_retencion,
        f.telp_ccoaxial,
        f.telp_cfibra,
        f.tipo_cable,
        f.fijacion_herraje,
        f.observacion_tendido,
        f.checkboxes_tendido,
        f.checkboxes_sugerencias,
        f.observaciones
      FROM factibilidades f
      LEFT JOIN ciudades c ON f.ciudad_id = c.id
      LEFT JOIN barrios b ON f.barrio_id = b.id
      LEFT JOIN proyectos p ON f.proyecto_id = p.id
      LEFT JOIN operadores o ON f.operador_id = o.id
      WHERE f.estado = 'activo'
    `

    const params = []
    let paramCount = 1

    if (ciudad) { query += ` AND c.nombre = $${paramCount}`; params.push(ciudad); paramCount++ }
    if (barrio) { query += ` AND b.nombre = $${paramCount}`; params.push(barrio); paramCount++ }
    if (operador) { query += ` AND f.operador_id = $${paramCount}`; params.push(operador); paramCount++ }
    if (proyecto) { query += ` AND f.proyecto_id = $${paramCount}`; params.push(proyecto); paramCount++ }
    if (fechaInicial) { query += ` AND DATE(f.created_at) >= $${paramCount}`; params.push(fechaInicial); paramCount++ }
    if (fechaFinal) { query += ` AND DATE(f.created_at) <= $${paramCount}`; params.push(fechaFinal); paramCount++ }

    query += ` ORDER BY f.created_at DESC`

    const result = await pool.query(query, params)
    return result.rows
  },

  getDashboardStats: async () => {
    const query = `
      SELECT
        COUNT(*) as total_postes,
        COUNT(CASE WHEN estado_completitud = 'completo' THEN 1 END) as inventario_completo,
        COUNT(CASE WHEN estado_completitud = 'pendiente_operadores' THEN 1 END) as pendiente_operadores
      FROM inventarios
      WHERE estado = 'activo'
    `
    const result = await pool.query(query)
    return result.rows[0]
  }

}

module.exports = reportesApi

