const db = require('../config/database');


const obtenerTodas = async (filtros = {}) => {
  try {
    let query = `
      SELECT 
        f.*,
        p.nombre AS proyecto_nombre,
        e.nombre AS empresa_nombre,
        o.nombre AS operador_nombre,
        c.nombre AS ciudad_nombre,
        b.nombre AS barrio_nombre,
        u.nombre AS usuario_nombre
      FROM factibilidades f
      LEFT JOIN proyectos p ON f.proyecto_id = p.id
      LEFT JOIN empresas e ON f.empresa_id = e.id
      LEFT JOIN operadores o ON f.operador_id = o.id
      LEFT JOIN ciudades c ON f.ciudad_id = c.id
      LEFT JOIN barrios b ON f.barrio_id = b.id
      LEFT JOIN usuarios u ON f.usuario_id = u.id
      WHERE 1=1
    `;


    const params = [];
    let paramCount = 1;


    if (filtros.proyecto_id) {
      query += ` AND f.proyecto_id = $${paramCount}`;
      params.push(filtros.proyecto_id);
      paramCount++;
    }


    if (filtros.ciudad_id) {
      query += ` AND f.ciudad_id = $${paramCount}`;
      params.push(filtros.ciudad_id);
      paramCount++;
    }


    if (filtros.barrio_id) {
      query += ` AND f.barrio_id = $${paramCount}`;
      params.push(filtros.barrio_id);
      paramCount++;
    }


    if (filtros.usuario_id) {
      query += ` AND f.usuario_id = $${paramCount}`;
      params.push(filtros.usuario_id);
      paramCount++;
    }


    if (filtros.estado) {
      query += ` AND f.estado = $${paramCount}`;
      params.push(filtros.estado);
      paramCount++;
    }


    if (filtros.completo !== undefined) {
      query += ` AND f.completo = $${paramCount}`;
      params.push(filtros.completo === 'true');
      paramCount++;
    }


    if (filtros.fecha_inicio) {
      query += ` AND f.created_at >= $${paramCount}`;
      params.push(filtros.fecha_inicio);
      paramCount++;
    }


    if (filtros.fecha_fin) {
      query += ` AND f.created_at <= $${paramCount}`;
      params.push(filtros.fecha_fin + ' 23:59:59');
      paramCount++;
    }


    if (filtros.busqueda) {
      query += ` AND (
        f.codigo_poste ILIKE $${paramCount} OR
        f.poste_plano ILIKE $${paramCount} OR
        p.nombre ILIKE $${paramCount}
      )`;
      params.push(`%${filtros.busqueda}%`);
      paramCount++;
    }


    const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
    const countResult = await db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total) || 0;


    query += ` ORDER BY f.created_at DESC`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(filtros.limit || 100, filtros.offset || 0);


    const resultado = await db.query(query, params);


    return {
      factibilidades: resultado.rows,
      total
    };
  } catch (error) {
    console.error('Error en obtenerTodas:', error);
    throw new Error('Error al obtener factibilidades: ' + error.message);
  }
};


const obtenerPorId = async (id) => {
  try {
    const query = `
      SELECT 
        f.*,
        p.nombre AS proyecto_nombre,
        e.nombre AS empresa_nombre,
        o.nombre AS operador_nombre,
        c.nombre AS ciudad_nombre,
        b.nombre AS barrio_nombre,
        u.nombre AS usuario_nombre
      FROM factibilidades f
      LEFT JOIN proyectos p ON f.proyecto_id = p.id
      LEFT JOIN empresas e ON f.empresa_id = e.id
      LEFT JOIN operadores o ON f.operador_id = o.id
      LEFT JOIN ciudades c ON f.ciudad_id = c.id
      LEFT JOIN barrios b ON f.barrio_id = b.id
      LEFT JOIN usuarios u ON f.usuario_id = u.id
      WHERE f.id = $1
    `;


    const resultado = await db.query(query, [id]);


    if (resultado.rows.length === 0) {
      throw new Error('Factibilidad no encontrada');
    }


    return resultado.rows[0];
  } catch (error) {
    console.error('Error en obtenerPorId:', error);
    throw new Error('Error al obtener factibilidad: ' + error.message);
  }
};


const crear = async (datos) => {
  try {
    const query = `
      INSERT INTO factibilidades (
        proyecto_id, empresa_id, operador_id, ciudad_id, barrio_id, usuario_id,
        direccion_via, direccion_numero, direccion_coordenada,
        poste_plano, codigo_poste, tipo_cable, latitud, longitud,
        nivel_tension_at, nivel_tension_mt, nivel_tension_bt, nivel_tension_ap,
        elem_transformador, elem_seccionador, elem_corta_circuito, 
        elem_medidor, elem_bajante_electrico, tierra_electrica,
        poste_material, poste_altura, poste_resistencia, poste_uso_carga, 
        poste_retenida, poste_estado,
        telp_pas_cables, telp_pas_c_coaxial, telp_pas_c_fibra, telp_pas_c_drop, telp_pas_c_rg11,
        telp_pas_cajempalme, telp_pas_cajgpon, telp_pas_stp,
        telp_pas_bajantes, telp_pas_reservas,
        telp_act_amplificadores, telp_act_fuentes, telp_act_nodooptico, telp_act_antena, telp_act_camara_vigil,
        telp_mth_retencion, telp_mth_suspencion, telp_retencion, telp_ccoaxial, telp_cfibra,
        fijacion_herraje, observacion_tendido, checkboxes_tendido,
        observaciones, checkboxes_sugerencias
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
        $51, $52, $53, $54, $55
      )
      RETURNING *
    `;


    const valores = [
      datos.proyecto_id || null,
      datos.empresa_id || null,
      datos.operador_id || null,
      datos.ciudad_id || null,
      datos.barrio_id || null,
      datos.usuario_id || null,
      datos.direccion_via || null,
      datos.direccion_numero || null,
      datos.direccion_coordenada || null,
      datos.poste_plano || null,
      datos.codigo_poste || null,
      datos.tipo_cable || null,
      datos.latitud || null,
      datos.longitud || null,
      datos.nivel_tension_at || false,
      datos.nivel_tension_mt || false,
      datos.nivel_tension_bt || false,
      datos.nivel_tension_ap || false,
      datos.elem_transformador || false,
      datos.elem_seccionador || false,
      datos.elem_corta_circuito || false,
      datos.elem_medidor || false,
      datos.elem_bajante_electrico || false,
      datos.tierra_electrica || false,
      datos.poste_material || null,
      datos.poste_altura || null,
      datos.poste_resistencia || null,
      datos.poste_uso_carga || null,
      datos.poste_retenida || '0',
      datos.poste_estado || null,
      datos.telp_pas_cables || 0,
      datos.telp_pas_c_coaxial || 0,
      datos.telp_pas_c_fibra || 0,
      datos.telp_pas_c_drop || 0,
      datos.telp_pas_c_rg11 || 0,
      datos.telp_pas_cajempalme || 0,
      datos.telp_pas_cajgpon || 0,
      datos.telp_pas_stp || 0,
      datos.telp_pas_bajantes || 0,
      datos.telp_pas_reservas || 0,
      datos.telp_act_amplificadores || 0,
      datos.telp_act_fuentes || 0,
      datos.telp_act_nodooptico || 0,
      datos.telp_act_antena || 0,
      datos.telp_act_camara_vigil || 0,
      datos.telp_mth_retencion || 0,
      datos.telp_mth_suspencion || 0,
      datos.telp_retencion || 0,
      datos.telp_ccoaxial || 0,
      datos.telp_cfibra || 0,
      datos.fijacion_herraje || null,
      datos.observacion_tendido || null,
      JSON.stringify(datos.checkboxes_tendido || []),
      datos.observaciones || null,
      JSON.stringify(datos.checkboxes_sugerencias || [])
    ];


    const resultado = await db.query(query, valores);
    return resultado.rows[0];
  } catch (error) {
    console.error('Error en crear:', error);
    throw new Error('Error al crear factibilidad: ' + error.message);
  }
};


const actualizar = async (id, datos) => {
  try {
    const query = `
      UPDATE factibilidades SET
        proyecto_id = $1, 
        empresa_id = $2, 
        operador_id = $3, 
        ciudad_id = $4, 
        barrio_id = $5,
        direccion_via = $6, 
        direccion_numero = $7, 
        direccion_coordenada = $8,
        poste_plano = $9, 
        codigo_poste = $10, 
        tipo_cable = $11, 
        latitud = $12, 
        longitud = $13,
        nivel_tension_at = $14,
        nivel_tension_mt = $15,
        nivel_tension_bt = $16,
        nivel_tension_ap = $17,
        elem_transformador = $18,
        elem_seccionador = $19,
        elem_corta_circuito = $20,
        elem_medidor = $21,
        elem_bajante_electrico = $22,
        tierra_electrica = $23,
        poste_material = $24,
        poste_altura = $25,
        poste_resistencia = $26,
        poste_uso_carga = $27,
        poste_retenida = $28,
        poste_estado = $29,
        telp_pas_cables = $30,
        telp_pas_c_coaxial = $31,
        telp_pas_c_fibra = $32,
        telp_pas_c_drop = $33,
        telp_pas_c_rg11 = $34,
        telp_pas_cajempalme = $35,
        telp_pas_cajgpon = $36,
        telp_pas_stp = $37,
        telp_pas_bajantes = $38,
        telp_pas_reservas = $39,
        telp_act_amplificadores = $40,
        telp_act_fuentes = $41,
        telp_act_nodooptico = $42,
        telp_act_antena = $43,
        telp_act_camara_vigil = $44,
        telp_mth_retencion = $45,
        telp_mth_suspencion = $46,
        telp_retencion = $47,
        telp_ccoaxial = $48,
        telp_cfibra = $49,
        fijacion_herraje = $50,
        observacion_tendido = $51,
        checkboxes_tendido = $52,
        observaciones = $53,
        checkboxes_sugerencias = $54,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $55
      RETURNING *
    `;

    const valores = [
      datos.proyecto_id || null,
      datos.empresa_id || null,
      datos.operador_id || null,
      datos.ciudad_id || null,
      datos.barrio_id || null,
      datos.direccion_via || null,
      datos.direccion_numero || null,
      datos.direccion_coordenada || null,
      datos.poste_plano || null,
      datos.codigo_poste || null,
      datos.tipo_cable || null,
      datos.latitud || null,
      datos.longitud || null,
      datos.nivel_tension_at || false,
      datos.nivel_tension_mt || false,
      datos.nivel_tension_bt || false,
      datos.nivel_tension_ap || false,
      datos.elem_transformador || false,
      datos.elem_seccionador || false,
      datos.elem_corta_circuito || false,
      datos.elem_medidor || false,
      datos.elem_bajante_electrico || false,
      datos.tierra_electrica || false,
      datos.poste_material || null,
      datos.poste_altura || null,
      datos.poste_resistencia || null,
      datos.poste_uso_carga || null,
      datos.poste_retenida || '0',
      datos.poste_estado || null,
      datos.telp_pas_cables || 0,
      datos.telp_pas_c_coaxial || 0,
      datos.telp_pas_c_fibra || 0,
      datos.telp_pas_c_drop || 0,
      datos.telp_pas_c_rg11 || 0,
      datos.telp_pas_cajempalme || 0,
      datos.telp_pas_cajgpon || 0,
      datos.telp_pas_stp || 0,
      datos.telp_pas_bajantes || 0,
      datos.telp_pas_reservas || 0,
      datos.telp_act_amplificadores || 0,
      datos.telp_act_fuentes || 0,
      datos.telp_act_nodooptico || 0,
      datos.telp_act_antena || 0,
      datos.telp_act_camara_vigil || 0,
      datos.telp_mth_retencion || 0,
      datos.telp_mth_suspencion || 0,
      datos.telp_retencion || 0,
      datos.telp_ccoaxial || 0,
      datos.telp_cfibra || 0,
      datos.fijacion_herraje || null,
      datos.observacion_tendido || null,
      JSON.stringify(datos.checkboxes_tendido || []),
      datos.observaciones || null,
      JSON.stringify(datos.checkboxes_sugerencias || []),
      id
    ];

    const resultado = await db.query(query, valores);
    return resultado.rows[0];
  } catch (error) {
    console.error('Error en actualizar:', error);
    throw new Error('Error al actualizar factibilidad: ' + error.message);
  }
};


const eliminar = async (id) => {
  try {
    const query = 'UPDATE factibilidades SET estado = $1 WHERE id = $2 RETURNING *';
    const resultado = await db.query(query, ['eliminado', id]);
    return resultado.rows[0];
  } catch (error) {
    console.error('Error en eliminar:', error);
    throw new Error('Error al eliminar factibilidad: ' + error.message);
  }
};


module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
