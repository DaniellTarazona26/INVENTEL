// backend/services/inventariosService.js

const pool = require('../config/database')

const inventariosService = {
  
  crear: async (datos, usuarioId) => {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // Convertir nombre de barrio a ID si es necesario
      let barrioId = datos.barrio
      
      if (datos.barrio && isNaN(datos.barrio)) {
        const barrioQuery = await client.query(
          'SELECT id FROM barrios WHERE UPPER(nombre) = UPPER($1) AND ciudad_id = $2',
          [datos.barrio, datos.ciudadId]
        )
        
        if (barrioQuery.rows.length > 0) {
          barrioId = barrioQuery.rows[0].id
        } else {
          throw new Error(`Barrio "${datos.barrio}" no encontrado en la ciudad especificada`)
        }
      }

      // Validar que empresa sea obligatoria
      if (!datos.empresaId) {
        throw new Error('La empresa es obligatoria')
      }

      // Obtener nombre del usuario
      const usuarioQuery = await client.query(
        'SELECT nombre FROM usuarios WHERE id = $1',
        [usuarioId]
      )
      const inspectorNombre = usuarioQuery.rows[0]?.nombre || 'Desconocido'
      
      const query = `
        INSERT INTO inventarios (
          barrio_id, direccion_campo1, direccion_campo2, direccion_campo3, direccion_campo4,
          direccion_completa, waypoint,
          tipo, marcada, codigo_estructura, consecutivo_poste, material,
          carga_rotura, templete, estado_templete, altura, ano_fabricacion, bajantes_electricos,
          baja, baja_tipo_cable, baja_estado_red, baja_continuidad_electrica, caja1, caja2,
          alumbrado, alumbrado_tipo_cable, alumbrado_estado_red,
          lampara1_tipo, lampara1_existe_codigo, lampara1_codigo, lampara1_danada, lampara1_encendida,
          lampara2_tipo, lampara2_existe_codigo, lampara2_codigo, lampara2_danada, lampara2_encendida,
          tierra_electrica, tierra_estado, tierra_suelta, tierra_desconectada, tierra_rota,
          elementos_adicionales, lampara, camara_tv, corneta, aviso, caja_metalica, otro, posible_fraude,
          estado_estructura, desplomado, flectado, fracturado, hierro_base,
          poda_arboles, operadores, 
          usuario_id, inspector_nombre, created_by, ciudad_id, empresa_id, proyecto_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, $23, $24, $25, $26, $27,
          $28, $29, $30, $31, $32, $33, $34, $35, $36, $37,
          $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
          $51, $52, $53, $54, $55, $56, $57,
          $58, $59, $60, $61, $62, $63
        )
        RETURNING *
      `
      
      const direccionCompleta = `${datos.direccion1 || ''} ${datos.direccion2 || ''} ${datos.direccion3 || ''} ${datos.direccion4 || ''}`.trim()
      
      const values = [
        barrioId || null,
        datos.direccion1 || null,
        datos.direccion2 || null,
        datos.direccion3 || null,
        datos.direccion4 || null,
        direccionCompleta || null,
        datos.waypoint || null,
        datos.tipo || null,
        datos.marcada || 'NO',
        datos.codigoEstructura || null,
        datos.consecutivoPoste || null,
        datos.material || null,
        datos.cRotura || null,
        datos.templete || null,
        datos.estadoTemplete || null,
        datos.altura || null,
        datos.anoFabricacion || null,
        datos.bajantesElectricos || 'NO',
        datos.baja || 'NO',
        datos.bajaTipoCable || null,
        datos.bajaEstado || null,
        datos.bajaContinuidad || null,
        datos.caja1 || null,
        datos.caja2 || null,
        datos.alumbrado || 'NO',
        datos.alumbradoTipoCable || null,
        datos.alumbradoEstado || null,
        datos.lampara1Tipo || null,
        datos.lampara1ExisteCodigo || null,
        datos.lampara1Codigo || null,
        datos.lampara1Danada || null,
        datos.lampara1Encendida || null,
        datos.lampara2Tipo || null,
        datos.lampara2ExisteCodigo || null,
        datos.lampara2Codigo || null,
        datos.lampara2Danada || null,
        datos.lampara2Encendida || null,
        datos.tierraElectrica || 'NO',
        datos.tierraEstado || null,
        datos.tierraSuelta || null,
        datos.tierraDesconectada || null,
        datos.tierraRota || null,
        datos.elementosAdicionales || 'APLICA',
        datos.lampara || 'NO',
        datos.camaraTv || 'NO',
        datos.corneta || 'NO',
        datos.aviso || 'NO',
        datos.cajaMetalica || 'NO',
        datos.otro || 'NO',
        datos.posibleFraude || 'NO',
        datos.estadoEstructura || null,
        datos.desplomado || null,
        datos.flectado || null,
        datos.fracturado || null,
        datos.hierroBase || null,
        datos.podaArboles || null,
        JSON.stringify(datos.operadores || []),
        usuarioId,
        inspectorNombre,
        usuarioId,
        datos.ciudadId || null,
        datos.empresaId,
        datos.proyectoId || null
      ]
      
      const result = await client.query(query, values)
      await client.query('COMMIT')
      
      return result.rows[0]
      
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error creando inventario:', error)
      throw error
    } finally {
      client.release()
    }
  },

  obtenerTodos: async (filtros = {}) => {
    let query = `
      SELECT 
        i.*,
        b.nombre as barrio_nombre,
        c.nombre as ciudad_nombre,
        e.nombre as empresa_nombre,
        u.nombre as usuario_nombre,
        p.nombre as proyecto_nombre,
        creator.nombre as creado_por_nombre,
        updater.nombre as actualizado_por_nombre
      FROM inventarios i
      LEFT JOIN barrios b ON i.barrio_id = b.id
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN empresas e ON i.empresa_id = e.id
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      LEFT JOIN proyectos p ON i.proyecto_id = p.id
      LEFT JOIN usuarios creator ON i.created_by = creator.id
      LEFT JOIN usuarios updater ON i.updated_by = updater.id
      WHERE i.estado = 'activo'
    `
    
    const values = []
    let paramCount = 1
    
    if (filtros.ciudadId) {
      query += ` AND i.ciudad_id = $${paramCount}`
      values.push(filtros.ciudadId)
      paramCount++
    }
    
    if (filtros.empresaId) {
      query += ` AND i.empresa_id = $${paramCount}`
      values.push(filtros.empresaId)
      paramCount++
    }
    
    if (filtros.barrioId) {
      query += ` AND i.barrio_id = $${paramCount}`
      values.push(filtros.barrioId)
      paramCount++
    }
    
    if (filtros.proyectoId) {
      query += ` AND i.proyecto_id = $${paramCount}`
      values.push(filtros.proyectoId)
      paramCount++
    }
    
    query += ` ORDER BY i.fecha_registro DESC`
    
    const result = await pool.query(query, values)
    return result.rows
  },

  obtenerPorId: async (id) => {
    const query = `
      SELECT 
        i.*,
        b.nombre as barrio_nombre,
        c.nombre as ciudad_nombre,
        e.nombre as empresa_nombre,
        u.nombre as usuario_nombre,
        p.nombre as proyecto_nombre,
        creator.nombre as creado_por_nombre,
        updater.nombre as actualizado_por_nombre
      FROM inventarios i
      LEFT JOIN barrios b ON i.barrio_id = b.id
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN empresas e ON i.empresa_id = e.id
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      LEFT JOIN proyectos p ON i.proyecto_id = p.id
      LEFT JOIN usuarios creator ON i.created_by = creator.id
      LEFT JOIN usuarios updater ON i.updated_by = updater.id
      WHERE i.id = $1 AND i.estado = 'activo'
    `
    
    const result = await pool.query(query, [id])
    
    if (result.rows.length === 0) {
      throw new Error('Inventario no encontrado')
    }
    
    return result.rows[0]
  },

  actualizar: async (id, datos, usuarioId) => {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      let barrioId = datos.barrio
      
      if (datos.barrio && isNaN(datos.barrio) && datos.ciudadId) {
        const barrioQuery = await client.query(
          'SELECT id FROM barrios WHERE UPPER(nombre) = UPPER($1) AND ciudad_id = $2',
          [datos.barrio, datos.ciudadId]
        )
        
        if (barrioQuery.rows.length > 0) {
          barrioId = barrioQuery.rows[0].id
        }
      }

      if (!datos.empresaId) {
        throw new Error('La empresa es obligatoria')
      }
      
      const direccionCompleta = `${datos.direccion1 || ''} ${datos.direccion2 || ''} ${datos.direccion3 || ''} ${datos.direccion4 || ''}`.trim()
      
      const query = `
        UPDATE inventarios SET
          barrio_id = $1,
          direccion_campo1 = $2,
          direccion_campo2 = $3,
          direccion_campo3 = $4,
          direccion_campo4 = $5,
          direccion_completa = $6,
          waypoint = $7,
          tipo = $8,
          marcada = $9,
          codigo_estructura = $10,
          consecutivo_poste = $11,
          material = $12,
          carga_rotura = $13,
          templete = $14,
          estado_templete = $15,
          altura = $16,
          ano_fabricacion = $17,
          bajantes_electricos = $18,
          baja = $19,
          baja_tipo_cable = $20,
          baja_estado_red = $21,
          baja_continuidad_electrica = $22,
          caja1 = $23,
          caja2 = $24,
          alumbrado = $25,
          alumbrado_tipo_cable = $26,
          alumbrado_estado_red = $27,
          lampara1_tipo = $28,
          lampara1_existe_codigo = $29,
          lampara1_codigo = $30,
          lampara1_danada = $31,
          lampara1_encendida = $32,
          lampara2_tipo = $33,
          lampara2_existe_codigo = $34,
          lampara2_codigo = $35,
          lampara2_danada = $36,
          lampara2_encendida = $37,
          tierra_electrica = $38,
          tierra_estado = $39,
          tierra_suelta = $40,
          tierra_desconectada = $41,
          tierra_rota = $42,
          elementos_adicionales = $43,
          lampara = $44,
          camara_tv = $45,
          corneta = $46,
          aviso = $47,
          caja_metalica = $48,
          otro = $49,
          posible_fraude = $50,
          estado_estructura = $51,
          desplomado = $52,
          flectado = $53,
          fracturado = $54,
          hierro_base = $55,
          poda_arboles = $56,
          operadores = $57,
          ciudad_id = $58,
          empresa_id = $59,
          proyecto_id = $60,
          updated_by = $61
        WHERE id = $62 AND estado = 'activo'
        RETURNING *
      `
      
      const values = [
        barrioId || null,
        datos.direccion1 || null,
        datos.direccion2 || null,
        datos.direccion3 || null,
        datos.direccion4 || null,
        direccionCompleta,
        datos.waypoint || null,
        datos.tipo || null,
        datos.marcada || 'NO',
        datos.codigoEstructura || null,
        datos.consecutivoPoste || null,
        datos.material || null,
        datos.cRotura || null,
        datos.templete || null,
        datos.estadoTemplete || null,
        datos.altura || null,
        datos.anoFabricacion || null,
        datos.bajantesElectricos || 'NO',
        datos.baja || 'NO',
        datos.bajaTipoCable || null,
        datos.bajaEstado || null,
        datos.bajaContinuidad || null,
        datos.caja1 || null,
        datos.caja2 || null,
        datos.alumbrado || 'NO',
        datos.alumbradoTipoCable || null,
        datos.alumbradoEstado || null,
        datos.lampara1Tipo || null,
        datos.lampara1ExisteCodigo || null,
        datos.lampara1Codigo || null,
        datos.lampara1Danada || null,
        datos.lampara1Encendida || null,
        datos.lampara2Tipo || null,
        datos.lampara2ExisteCodigo || null,
        datos.lampara2Codigo || null,
        datos.lampara2Danada || null,
        datos.lampara2Encendida || null,
        datos.tierraElectrica || 'NO',
        datos.tierraEstado || null,
        datos.tierraSuelta || null,
        datos.tierraDesconectada || null,
        datos.tierraRota || null,
        datos.elementosAdicionales || 'APLICA',
        datos.lampara || 'NO',
        datos.camaraTv || 'NO',
        datos.corneta || 'NO',
        datos.aviso || 'NO',
        datos.cajaMetalica || 'NO',
        datos.otro || 'NO',
        datos.posibleFraude || 'NO',
        datos.estadoEstructura || null,
        datos.desplomado || null,
        datos.flectado || null,
        datos.fracturado || null,
        datos.hierroBase || null,
        datos.podaArboles || null,
        JSON.stringify(datos.operadores || []),
        datos.ciudadId || null,
        datos.empresaId,
        datos.proyectoId || null,
        usuarioId,
        id
      ]
      
      const result = await client.query(query, values)
      
      await client.query('COMMIT')
      
      if (result.rows.length === 0) {
        throw new Error('Inventario no encontrado')
      }
      
      return result.rows[0]
      
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error actualizando inventario:', error)
      throw error
    } finally {
      client.release()
    }
  },

  eliminar: async (id, usuarioId) => {
    const query = `
      UPDATE inventarios 
      SET estado = 'inactivo', 
          updated_by = $1,
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `
    
    const result = await pool.query(query, [usuarioId, id])
    
    if (result.rows.length === 0) {
      throw new Error('Inventario no encontrado')
    }
    
    return result.rows[0]
  }
}

module.exports = inventariosService
