const pool = require('../config/database')

const inventariosService = {
  
  crear: async (datos, usuarioId) => {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      if (datos.codigoEstructura) {
        const checkCodigo = await client.query(
          'SELECT id FROM inventarios WHERE codigo_estructura = $1 AND estado = $2',
          [datos.codigoEstructura, 'activo']
        )
        
        if (checkCodigo.rows.length > 0) {
          throw new Error(`El código de estructura "${datos.codigoEstructura}" ya existe`)
        }
      }

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

      if (!datos.empresaId) {
        throw new Error('La empresa es obligatoria')
      }

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
          media, media_tipo_cable, media_estado_red, media_continuidad_electrica, caja3, caja4,
          alumbrado, alumbrado_tipo_cable, alumbrado_estado_red,
          lampara1_tipo, lampara1_existe_codigo, lampara1_codigo, lampara1_danada, lampara1_encendida,
          lampara2_tipo, lampara2_existe_codigo, lampara2_codigo, lampara2_danada, lampara2_encendida,
          tierra_electrica, tierra_estado, tierra_suelta, tierra_desconectada, tierra_rota,
          elementos_adicionales, lampara, camara_tv, corneta, aviso, caja_metalica, otro, posible_fraude,
          estado_estructura, desplomado, flectado, fracturado, hierro_base,
          poda_arboles, operadores,
          usuario_id, inspector_nombre, created_by, ciudad_id, empresa_id,
          estado_completitud
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, $23, $24,
          $25, $26, $27, $28, $29, $30,
          $31, $32, $33,
          $34, $35, $36, $37, $38, $39, $40, $41, $42, $43,
          $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56,
          $57, $58, $59, $60, $61, $62,
          $63, $64, $65, $66, $67, $68,
          'completo'
        )
        RETURNING *
      `
      
      const direccionCompleta = `${datos.direccion1 || ''} ${datos.direccion2 || ''} ${datos.direccion3 || ''} ${datos.direccion4 || ''}`.trim()
      
      const values = [
        barrioId || null,                        // $1
        datos.direccion1 || null,                // $2
        datos.direccion2 || null,                // $3
        datos.direccion3 || null,                // $4
        datos.direccion4 || null,                // $5
        direccionCompleta || null,               // $6
        datos.waypoint || null,                  // $7
        datos.tipo || null,                      // $8
        datos.marcada || 'NO',                   // $9
        datos.codigoEstructura || null,          // $10
        datos.consecutivoPoste || null,          // $11
        datos.material || null,                  // $12
        datos.cRotura || null,                   // $13
        datos.templete || null,                  // $14
        datos.estadoTemplete || null,            // $15
        datos.altura || null,                    // $16
        datos.anoFabricacion || null,            // $17
        datos.bajantesElectricos || 'NO',        // $18
        datos.baja || 'NO',                      // $19
        datos.bajaTipoCable || null,             // $20
        datos.bajaEstado || null,                // $21
        datos.bajaContinuidad || null,           // $22
        datos.caja1 || null,                     // $23
        datos.caja2 || null,                     // $24
        datos.media || 'NO',                     // $25
        datos.mediaTipoCable || null,            // $26
        datos.mediaEstado || null,               // $27
        datos.mediaContinuidad || null,          // $28
        datos.caja3 || null,                     // $29
        datos.caja4 || null,                     // $30
        datos.alumbrado || 'NO',                 // $31
        datos.alumbradoTipoCable || null,        // $32
        datos.alumbradoEstado || null,           // $33
        datos.lampara1Tipo || null,              // $34
        datos.lampara1ExisteCodigo || null,      // $35
        datos.lampara1Codigo || null,            // $36
        datos.lampara1Danada || null,            // $37
        datos.lampara1Encendida || null,         // $38
        datos.lampara2Tipo || null,              // $39
        datos.lampara2ExisteCodigo || null,      // $40
        datos.lampara2Codigo || null,            // $41
        datos.lampara2Danada || null,            // $42
        datos.lampara2Encendida || null,         // $43
        datos.tierraElectrica || 'NO',           // $44
        datos.tierraEstado || null,              // $45
        datos.tierraSuelta || null,              // $46
        datos.tierraDesconectada || null,        // $47
        datos.tierraRota || null,                // $48
        datos.elementosAdicionales || 'APLICA', // $49
        datos.lampara || 'NO',                   // $50
        datos.camaraTv || 'NO',                  // $51
        datos.corneta || 'NO',                   // $52
        datos.aviso || 'NO',                     // $53
        datos.cajaMetalica || 'NO',              // $54
        datos.otro || 'NO',                      // $55
        datos.posibleFraude || 'NO',             // $56
        datos.estadoEstructura || null,          // $57
        datos.desplomado || null,                // $58
        datos.flectado || null,                  // $59
        datos.fracturado || null,                // $60
        datos.hierroBase || null,                // $61
        datos.podaArboles || null,               // $62
        JSON.stringify(datos.operadores || []),  // $63
        usuarioId,                               // $64
        inspectorNombre,                         // $65
        usuarioId,                               // $66
        datos.ciudadId || null,                  // $67
        datos.empresaId                          // $68
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


  crearParcial: async (datos, usuarioId) => {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
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

      if (!datos.empresaId) {
        throw new Error('La empresa es obligatoria')
      }

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
          media, media_tipo_cable, media_estado_red, media_continuidad_electrica, caja3, caja4,
          alumbrado, alumbrado_tipo_cable, alumbrado_estado_red,
          lampara1_tipo, lampara1_existe_codigo, lampara1_codigo, lampara1_danada, lampara1_encendida,
          lampara2_tipo, lampara2_existe_codigo, lampara2_codigo, lampara2_danada, lampara2_encendida,
          tierra_electrica, tierra_estado, tierra_suelta, tierra_desconectada, tierra_rota,
          elementos_adicionales, lampara, camara_tv, corneta, aviso, caja_metalica, otro, posible_fraude,
          estado_estructura, desplomado, flectado, fracturado, hierro_base,
          poda_arboles, operadores,
          usuario_id, inspector_nombre, created_by, ciudad_id, empresa_id,
          estado_completitud
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, $23, $24,
          $25, $26, $27, $28, $29, $30,
          $31, $32, $33,
          $34, $35, $36, $37, $38, $39, $40, $41, $42, $43,
          $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56,
          $57, $58, $59, $60, $61, $62,
          $63, $64, $65, $66, $67, $68,
          'pendiente_operadores'
        )
        RETURNING *
      `
      
      const direccionCompleta = `${datos.direccion1 || ''} ${datos.direccion2 || ''} ${datos.direccion3 || ''} ${datos.direccion4 || ''}`.trim()
      
      const values = [
        barrioId || null,                        // $1
        datos.direccion1 || null,                // $2
        datos.direccion2 || null,                // $3
        datos.direccion3 || null,                // $4
        datos.direccion4 || null,                // $5
        direccionCompleta || null,               // $6
        datos.waypoint || null,                  // $7
        datos.tipo || null,                      // $8
        datos.marcada || 'NO',                   // $9
        datos.codigoEstructura || null,          // $10
        datos.consecutivoPoste || null,          // $11
        datos.material || null,                  // $12
        datos.cRotura || null,                   // $13
        datos.templete || null,                  // $14
        datos.estadoTemplete || null,            // $15
        datos.altura || null,                    // $16
        datos.anoFabricacion || null,            // $17
        datos.bajantesElectricos || 'NO',        // $18
        datos.baja || 'NO',                      // $19
        datos.bajaTipoCable || null,             // $20
        datos.bajaEstado || null,                // $21
        datos.bajaContinuidad || null,           // $22
        datos.caja1 || null,                     // $23
        datos.caja2 || null,                     // $24
        datos.media || 'NO',                     // $25
        datos.mediaTipoCable || null,            // $26
        datos.mediaEstado || null,               // $27
        datos.mediaContinuidad || null,          // $28
        datos.caja3 || null,                     // $29
        datos.caja4 || null,                     // $30
        datos.alumbrado || 'NO',                 // $31
        datos.alumbradoTipoCable || null,        // $32
        datos.alumbradoEstado || null,           // $33
        datos.lampara1Tipo || null,              // $34
        datos.lampara1ExisteCodigo || null,      // $35
        datos.lampara1Codigo || null,            // $36
        datos.lampara1Danada || null,            // $37
        datos.lampara1Encendida || null,         // $38
        datos.lampara2Tipo || null,              // $39
        datos.lampara2ExisteCodigo || null,      // $40
        datos.lampara2Codigo || null,            // $41
        datos.lampara2Danada || null,            // $42
        datos.lampara2Encendida || null,         // $43
        datos.tierraElectrica || 'NO',           // $44
        datos.tierraEstado || null,              // $45
        datos.tierraSuelta || null,              // $46
        datos.tierraDesconectada || null,        // $47
        datos.tierraRota || null,                // $48
        datos.elementosAdicionales || 'APLICA', // $49
        datos.lampara || 'NO',                   // $50
        datos.camaraTv || 'NO',                  // $51
        datos.corneta || 'NO',                   // $52
        datos.aviso || 'NO',                     // $53
        datos.cajaMetalica || 'NO',              // $54
        datos.otro || 'NO',                      // $55
        datos.posibleFraude || 'NO',             // $56
        datos.estadoEstructura || null,          // $57
        datos.desplomado || null,                // $58
        datos.flectado || null,                  // $59
        datos.fracturado || null,                // $60
        datos.hierroBase || null,                // $61
        datos.podaArboles || null,               // $62
        JSON.stringify(datos.operadores || []),  // $63
        usuarioId,                               // $64
        inspectorNombre,                         // $65
        usuarioId,                               // $66
        datos.ciudadId || null,                  // $67
        datos.empresaId                          // $68
      ]
      
      const result = await client.query(query, values)
      await client.query('COMMIT')
      
      return result.rows[0]
      
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error creando inventario parcial:', error)
      throw error
    } finally {
      client.release()
    }
  },


  completarConOperadores: async (inventarioId, usuarioId) => {
    const query = `
      UPDATE inventarios 
      SET estado_completitud = 'completo',
          updated_by = $1,
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $2 AND estado = 'activo'
      RETURNING *
    `
    
    const result = await pool.query(query, [usuarioId, inventarioId])
    
    if (result.rows.length === 0) {
      throw new Error('Inventario no encontrado')
    }
    
    return result.rows[0]
  },


  obtenerTodos: async (filtros = {}) => {
    let query = `
      SELECT 
        i.*,
        b.nombre as barrio_nombre,
        c.nombre as ciudad_nombre,
        e.nombre as empresa_nombre,
        u.nombre as usuario_nombre,
        creator.nombre as creado_por_nombre,
        updater.nombre as actualizado_por_nombre
      FROM inventarios i
      LEFT JOIN barrios b ON i.barrio_id = b.id
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN empresas e ON i.empresa_id = e.id
      LEFT JOIN usuarios u ON i.usuario_id = u.id
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
        creator.nombre as creado_por_nombre,
        updater.nombre as actualizado_por_nombre
      FROM inventarios i
      LEFT JOIN barrios b ON i.barrio_id = b.id
      LEFT JOIN ciudades c ON i.ciudad_id = c.id
      LEFT JOIN empresas e ON i.empresa_id = e.id
      LEFT JOIN usuarios u ON i.usuario_id = u.id
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

      if (datos.codigoEstructura) {
        const checkCodigo = await client.query(
          'SELECT id FROM inventarios WHERE codigo_estructura = $1 AND estado = $2 AND id != $3',
          [datos.codigoEstructura, 'activo', id]
        )
        
        if (checkCodigo.rows.length > 0) {
          throw new Error(`El código de estructura "${datos.codigoEstructura}" ya existe`)
        }
      }
      
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
          media = $25,
          media_tipo_cable = $26,
          media_estado_red = $27,
          media_continuidad_electrica = $28,
          caja3 = $29,
          caja4 = $30,
          alumbrado = $31,
          alumbrado_tipo_cable = $32,
          alumbrado_estado_red = $33,
          lampara1_tipo = $34,
          lampara1_existe_codigo = $35,
          lampara1_codigo = $36,
          lampara1_danada = $37,
          lampara1_encendida = $38,
          lampara2_tipo = $39,
          lampara2_existe_codigo = $40,
          lampara2_codigo = $41,
          lampara2_danada = $42,
          lampara2_encendida = $43,
          tierra_electrica = $44,
          tierra_estado = $45,
          tierra_suelta = $46,
          tierra_desconectada = $47,
          tierra_rota = $48,
          elementos_adicionales = $49,
          lampara = $50,
          camara_tv = $51,
          corneta = $52,
          aviso = $53,
          caja_metalica = $54,
          otro = $55,
          posible_fraude = $56,
          estado_estructura = $57,
          desplomado = $58,
          flectado = $59,
          fracturado = $60,
          hierro_base = $61,
          poda_arboles = $62,
          operadores = $63,
          ciudad_id = $64,
          empresa_id = $65,
          updated_by = $66
        WHERE id = $67 AND estado = 'activo'
        RETURNING *
      `
      
      const values = [
        barrioId || null,                        // $1
        datos.direccion1 || null,                // $2
        datos.direccion2 || null,                // $3
        datos.direccion3 || null,                // $4
        datos.direccion4 || null,                // $5
        direccionCompleta,                       // $6
        datos.waypoint || null,                  // $7
        datos.tipo || null,                      // $8
        datos.marcada || 'NO',                   // $9
        datos.codigoEstructura || null,          // $10
        datos.consecutivoPoste || null,          // $11
        datos.material || null,                  // $12
        datos.cRotura || null,                   // $13
        datos.templete || null,                  // $14
        datos.estadoTemplete || null,            // $15
        datos.altura || null,                    // $16
        datos.anoFabricacion || null,            // $17
        datos.bajantesElectricos || 'NO',        // $18
        datos.baja || 'NO',                      // $19
        datos.bajaTipoCable || null,             // $20
        datos.bajaEstado || null,                // $21
        datos.bajaContinuidad || null,           // $22
        datos.caja1 || null,                     // $23
        datos.caja2 || null,                     // $24
        datos.media || 'NO',                     // $25
        datos.mediaTipoCable || null,            // $26
        datos.mediaEstado || null,               // $27
        datos.mediaContinuidad || null,          // $28
        datos.caja3 || null,                     // $29
        datos.caja4 || null,                     // $30
        datos.alumbrado || 'NO',                 // $31
        datos.alumbradoTipoCable || null,        // $32
        datos.alumbradoEstado || null,           // $33
        datos.lampara1Tipo || null,              // $34
        datos.lampara1ExisteCodigo || null,      // $35
        datos.lampara1Codigo || null,            // $36
        datos.lampara1Danada || null,            // $37
        datos.lampara1Encendida || null,         // $38
        datos.lampara2Tipo || null,              // $39
        datos.lampara2ExisteCodigo || null,      // $40
        datos.lampara2Codigo || null,            // $41
        datos.lampara2Danada || null,            // $42
        datos.lampara2Encendida || null,         // $43
        datos.tierraElectrica || 'NO',           // $44
        datos.tierraEstado || null,              // $45
        datos.tierraSuelta || null,              // $46
        datos.tierraDesconectada || null,        // $47
        datos.tierraRota || null,                // $48
        datos.elementosAdicionales || 'APLICA', // $49
        datos.lampara || 'NO',                   // $50
        datos.camaraTv || 'NO',                  // $51
        datos.corneta || 'NO',                   // $52
        datos.aviso || 'NO',                     // $53
        datos.cajaMetalica || 'NO',              // $54
        datos.otro || 'NO',                      // $55
        datos.posibleFraude || 'NO',             // $56
        datos.estadoEstructura || null,          // $57
        datos.desplomado || null,                // $58
        datos.flectado || null,                  // $59
        datos.fracturado || null,                // $60
        datos.hierroBase || null,                // $61
        datos.podaArboles || null,               // $62
        JSON.stringify(datos.operadores || []),  // $63
        datos.ciudadId || null,                  // $64
        datos.empresaId,                         // $65
        usuarioId,                               // $66
        id                                       // $67
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


