// backend/services/inventariosOperadoresService.js

const pool = require('../config/database')

const inventariosOperadoresService = {
  
  // ==========================================
  // CREAR INFORMACIÓN DE OPERADOR
  // ==========================================
  crear: async (inventarioId, operadorNombre, datos, usuarioId) => {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // Calcular total de cables automáticamente
      const totalCables = 
        parseInt(datos.coaxial || 0) +
        parseInt(datos.telefonico || 0) +
        parseInt(datos.fibra_optica || 0) +
        parseInt(datos.utp || 0)
      
      const query = `
        INSERT INTO inventarios_operadores (
          inventario_id, operador_nombre,
          herrajes, coaxial, telefonico, fibra_optica, utp, guaya, total_cables, marquilla,
          cruce_via, cruce_estado, cruce_diagonal, cruce_sin_red, cruce_acometida, cruce_desalineado,
          activo_amplificador, activo_nodo_optico, activo_fuente_poder,
          activo_amplificador_110v, activo_nodo_optico_110v, activo_fuente_poder_110v, activo_switch_110v,
          pasivo_caja_nap, pasivo_caja_empalme, pasivo_reserva, pasivo_bajante,
          reserva1, reserva1_chipa_raqueta, reserva1_ubicacion, reserva1_marquilla,
          reserva2, reserva2_chipa_raqueta, reserva2_ubicacion, reserva2_marquilla,
          caja1, caja1_ubicacion, caja1_marquilla,
          caja2, caja2_ubicacion, caja2_marquilla,
          caja3, caja3_ubicacion, caja3_marquilla,
          empalme1, empalme1_ubicacion, empalme1_marquilla,
          empalme2, empalme2_ubicacion, empalme2_marquilla,
          empalme3, empalme3_ubicacion, empalme3_marquilla,
          empalme4, empalme4_ubicacion, empalme4_marquilla,
          bajante1, bajante1_cables, bajante1_diametro, bajante1_material,
          bajante1_fibra, bajante1_telefonico, bajante1_utp, bajante1_coaxial,
          observaciones, observaciones_checkboxes,
          usuario_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23,
          $24, $25, $26, $27,
          $28, $29, $30, $31,
          $32, $33, $34, $35,
          $36, $37, $38,
          $39, $40, $41,
          $42, $43, $44,
          $45, $46, $47,
          $48, $49, $50,
          $51, $52, $53,
          $54, $55, $56,
          $57, $58, $59, $60, $61, $62, $63, $64,
          $65, $66,
          $67
        )
        RETURNING *
      `
      
      const values = [
        inventarioId,
        operadorNombre,
        datos.herrajes || null,
        datos.coaxial || null,
        datos.telefonico || null,
        datos.fibra_optica || null,
        datos.utp || null,
        datos.guaya || null,
        totalCables,
        datos.marquilla || null,
        datos.cruce_via || null,
        datos.cruce_estado || null,
        datos.cruce_diagonal || null,
        datos.cruce_sin_red || null,
        datos.cruce_acometida || null,
        datos.cruce_desalineado || null,
        datos.activo_amplificador || false,
        datos.activo_nodo_optico || false,
        datos.activo_fuente_poder || false,
        datos.activo_amplificador_110v || false,
        datos.activo_nodo_optico_110v || false,
        datos.activo_fuente_poder_110v || false,
        datos.activo_switch_110v || false,
        datos.pasivo_caja_nap || false,
        datos.pasivo_caja_empalme || false,
        datos.pasivo_reserva || false,
        datos.pasivo_bajante || false,
        datos.reserva1 || null,
        datos.reserva1_chipa_raqueta || null,
        datos.reserva1_ubicacion || null,
        datos.reserva1_marquilla || null,
        datos.reserva2 || null,
        datos.reserva2_chipa_raqueta || null,
        datos.reserva2_ubicacion || null,
        datos.reserva2_marquilla || null,
        datos.caja1 || null,
        datos.caja1_ubicacion || null,
        datos.caja1_marquilla || null,
        datos.caja2 || null,
        datos.caja2_ubicacion || null,
        datos.caja2_marquilla || null,
        datos.caja3 || null,
        datos.caja3_ubicacion || null,
        datos.caja3_marquilla || null,
        datos.empalme1 || null,
        datos.empalme1_ubicacion || null,
        datos.empalme1_marquilla || null,
        datos.empalme2 || null,
        datos.empalme2_ubicacion || null,
        datos.empalme2_marquilla || null,
        datos.empalme3 || null,
        datos.empalme3_ubicacion || null,
        datos.empalme3_marquilla || null,
        datos.empalme4 || null,
        datos.empalme4_ubicacion || null,
        datos.empalme4_marquilla || null,
        datos.bajante1 || null,
        datos.bajante1_cables || null,
        datos.bajante1_diametro || null,
        datos.bajante1_material || null,
        datos.bajante1_fibra || null,
        datos.bajante1_telefonico || null,
        datos.bajante1_utp || null,
        datos.bajante1_coaxial || null,
        datos.observaciones || null,
        JSON.stringify(datos.observaciones_checkboxes || []),
        usuarioId
      ]
      
      const result = await client.query(query, values)
      await client.query('COMMIT')
      
      return result.rows[0]
      
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error creando datos de operador:', error)
      throw error
    } finally {
      client.release()
    }
  },

  // ==========================================
  // OBTENER OPERADORES POR INVENTARIO
  // ==========================================
  obtenerPorInventario: async (inventarioId) => {
    const query = `
      SELECT * FROM inventarios_operadores
      WHERE inventario_id = $1
      ORDER BY operador_nombre
    `
    
    const result = await pool.query(query, [inventarioId])
    return result.rows
  },

  // ==========================================
  // ACTUALIZAR DATOS DE OPERADOR
  // ==========================================
  actualizar: async (id, datos, usuarioId) => {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      const totalCables = 
        parseInt(datos.coaxial || 0) +
        parseInt(datos.telefonico || 0) +
        parseInt(datos.fibra_optica || 0) +
        parseInt(datos.utp || 0)
      
      const query = `
        UPDATE inventarios_operadores SET
          herrajes = $1, coaxial = $2, telefonico = $3, fibra_optica = $4, 
          utp = $5, guaya = $6, total_cables = $7, marquilla = $8,
          cruce_via = $9, cruce_estado = $10, cruce_diagonal = $11, 
          cruce_sin_red = $12, cruce_acometida = $13, cruce_desalineado = $14,
          activo_amplificador = $15, activo_nodo_optico = $16, activo_fuente_poder = $17,
          activo_amplificador_110v = $18, activo_nodo_optico_110v = $19, 
          activo_fuente_poder_110v = $20, activo_switch_110v = $21,
          pasivo_caja_nap = $22, pasivo_caja_empalme = $23, pasivo_reserva = $24, pasivo_bajante = $25,
          reserva1 = $26, reserva1_chipa_raqueta = $27, reserva1_ubicacion = $28, reserva1_marquilla = $29,
          reserva2 = $30, reserva2_chipa_raqueta = $31, reserva2_ubicacion = $32, reserva2_marquilla = $33,
          caja1 = $34, caja1_ubicacion = $35, caja1_marquilla = $36,
          caja2 = $37, caja2_ubicacion = $38, caja2_marquilla = $39,
          caja3 = $40, caja3_ubicacion = $41, caja3_marquilla = $42,
          empalme1 = $43, empalme1_ubicacion = $44, empalme1_marquilla = $45,
          empalme2 = $46, empalme2_ubicacion = $47, empalme2_marquilla = $48,
          empalme3 = $49, empalme3_ubicacion = $50, empalme3_marquilla = $51,
          empalme4 = $52, empalme4_ubicacion = $53, empalme4_marquilla = $54,
          bajante1 = $55, bajante1_cables = $56, bajante1_diametro = $57, bajante1_material = $58,
          bajante1_fibra = $59, bajante1_telefonico = $60, bajante1_utp = $61, bajante1_coaxial = $62,
          observaciones = $63, observaciones_checkboxes = $64,
          fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = $65
        RETURNING *
      `
      
      const values = [
        datos.herrajes || null,
        datos.coaxial || null,
        datos.telefonico || null,
        datos.fibra_optica || null,
        datos.utp || null,
        datos.guaya || null,
        totalCables,
        datos.marquilla || null,
        datos.cruce_via || null,
        datos.cruce_estado || null,
        datos.cruce_diagonal || null,
        datos.cruce_sin_red || null,
        datos.cruce_acometida || null,
        datos.cruce_desalineado || null,
        datos.activo_amplificador || false,
        datos.activo_nodo_optico || false,
        datos.activo_fuente_poder || false,
        datos.activo_amplificador_110v || false,
        datos.activo_nodo_optico_110v || false,
        datos.activo_fuente_poder_110v || false,
        datos.activo_switch_110v || false,
        datos.pasivo_caja_nap || false,
        datos.pasivo_caja_empalme || false,
        datos.pasivo_reserva || false,
        datos.pasivo_bajante || false,
        datos.reserva1 || null,
        datos.reserva1_chipa_raqueta || null,
        datos.reserva1_ubicacion || null,
        datos.reserva1_marquilla || null,
        datos.reserva2 || null,
        datos.reserva2_chipa_raqueta || null,
        datos.reserva2_ubicacion || null,
        datos.reserva2_marquilla || null,
        datos.caja1 || null,
        datos.caja1_ubicacion || null,
        datos.caja1_marquilla || null,
        datos.caja2 || null,
        datos.caja2_ubicacion || null,
        datos.caja2_marquilla || null,
        datos.caja3 || null,
        datos.caja3_ubicacion || null,
        datos.caja3_marquilla || null,
        datos.empalme1 || null,
        datos.empalme1_ubicacion || null,
        datos.empalme1_marquilla || null,
        datos.empalme2 || null,
        datos.empalme2_ubicacion || null,
        datos.empalme2_marquilla || null,
        datos.empalme3 || null,
        datos.empalme3_ubicacion || null,
        datos.empalme3_marquilla || null,
        datos.empalme4 || null,
        datos.empalme4_ubicacion || null,
        datos.empalme4_marquilla || null,
        datos.bajante1 || null,
        datos.bajante1_cables || null,
        datos.bajante1_diametro || null,
        datos.bajante1_material || null,
        datos.bajante1_fibra || null,
        datos.bajante1_telefonico || null,
        datos.bajante1_utp || null,
        datos.bajante1_coaxial || null,
        datos.observaciones || null,
        JSON.stringify(datos.observaciones_checkboxes || []),
        id
      ]
      
      const result = await client.query(query, values)
      await client.query('COMMIT')
      
      return result.rows[0]
      
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  },

  // ==========================================
  // ELIMINAR DATOS DE OPERADOR
  // ==========================================
  eliminar: async (id) => {
    const query = 'DELETE FROM inventarios_operadores WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }
}

module.exports = inventariosOperadoresService

