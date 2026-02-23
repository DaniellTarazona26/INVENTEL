const reportesApi = require('../services/reportesApi')
const ExcelJS = require('exceljs')

// ── Estilos reutilizables ──
const HEADER_STYLE = {
  font: { bold: true, color: { argb: 'FFFFFFFF' } },
  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } },
  alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
  border: {
    top: { style: 'thin' }, bottom: { style: 'thin' },
    left: { style: 'thin' }, right: { style: 'thin' }
  }
}

const SUBHEADER_STYLE = {
  font: { bold: true },
  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD6E4F0' } },
  alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
  border: {
    top: { style: 'thin' }, bottom: { style: 'thin' },
    left: { style: 'thin' }, right: { style: 'thin' }
  }
}

const DATA_STYLE = {
  alignment: { vertical: 'middle' },
  border: {
    top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
    bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
    left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
    right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
  }
}

const DATA_STYLE_ALT = {
  ...DATA_STYLE,
  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F9FF' } }
}

const applyDataRow = (row, index) => {
  row.height = 18
  row.eachCell({ includeEmpty: true }, cell => {
    cell.style = index % 2 === 0 ? DATA_STYLE_ALT : DATA_STYLE
  })
}

const reportesController = {

  // ========== INVENTARIO POR OPERADOR ==========
  getInventarioOperador: async (req, res) => {
    try {
      console.log('📋 getInventarioOperador - filtros:', req.query)
      const datos = await reportesApi.getInventarioOperador(req.query)
      res.json({ success: true, data: datos })
    } catch (error) {
      console.error('❌ getInventarioOperador ERROR:', { message: error.message, detail: error.detail, hint: error.hint, query: error.query, where: error.where })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null, hint: error.hint || null })
    }
  },

  exportarInventarioOperador: async (req, res) => {
    try {
      console.log('📋 exportarInventarioOperador - filtros:', req.query)
      const datos = await reportesApi.getInventarioOperadorCompleto(req.query)

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('REPORTE OPERADOR')

      // ── Fila 1: Grupos ──
      worksheet.getRow(1).values = [
        'CONSEC.',    // A
        'FECHA',      // B
        'WAYPOINT',   // C
        'CIUDAD',     // D
        'BARRIO',     // E
        'DIRECCIÓN',  // F
        'ESTRUCTURA', // G (merge G1:P1)
        '', '', '', '', '', '', '', '', '',
        'OPERADOR',   // Q
        'NIVELES DE OCUPACIÓN', // R (merge R1:Y1)
        '', '', '', '', '', '', '',
        'CRUCE EN VÍA', // Z (merge Z1:AE1)
        '', '', '', '', '',
        'ACTIVOS EXISTENTES', // AF (merge AF1:AL1)
        '', '', '', '', '', '',
        'PASIVOS EXISTENTES', // AM (merge AM1:AP1)
        '', '', '',
        'OBSERVACIONES' // AQ
      ]

      // ── Fila 2: Subcolumnas ──
      worksheet.getRow(2).values = [
        '', '', '', '', '', '',     // A-F (merged)
        'TIPO',        // G
        'CONSEC.',     // H
        'MARCADA',     // I
        'MATERIAL',    // J
        'C.ROTURA',    // K
        'COD.',        // L
        'TEMPLETE',    // M
        'EST.TEMP.',   // N
        'ALTURA',      // O
        'AÑO FAB.',    // P
        '',            // Q - OPERADOR (merged)
        'HERRAJES',    // R
        'COAXIAL',     // S
        'TELEFÓNICO',  // T
        'FIBRA',       // U
        'UTP',         // V
        'GUAYA',       // W
        'TOTAL CAB.',  // X
        'MARQUILLA',   // Y
        'EXISTE',      // Z
        'ESTADO',      // AA
        'DIAGONAL',    // AB
        'SIN RED',     // AC
        'ACOMETIDA',   // AD
        'DESALIN.',    // AE
        'AMPLIF.',     // AF
        'NODO ÓPT.',   // AG
        'FUENTE',      // AH
        'AMP.110V',    // AI
        'NODO.110V',   // AJ
        'FUENTE.110V', // AK
        'SWITCH.110V', // AL
        'CAJA NAP',    // AM
        'C.EMPALME',   // AN
        'RESERVA',     // AO
        'BAJANTE',     // AP
        ''             // AQ - OBSERVACIONES (merged)
      ]

      // ── Merges ──
      worksheet.mergeCells('A1:A2')
      worksheet.mergeCells('B1:B2')
      worksheet.mergeCells('C1:C2')
      worksheet.mergeCells('D1:D2')
      worksheet.mergeCells('E1:E2')
      worksheet.mergeCells('F1:F2')
      worksheet.mergeCells('G1:P1')   // ESTRUCTURA (10 cols)
      worksheet.mergeCells('Q1:Q2')   // OPERADOR
      worksheet.mergeCells('R1:Y1')   // OCUPACIÓN (8 cols)
      worksheet.mergeCells('Z1:AE1')  // CRUCE VÍA (6 cols)
      worksheet.mergeCells('AF1:AL1') // ACTIVOS (7 cols)
      worksheet.mergeCells('AM1:AP1') // PASIVOS (4 cols)
      worksheet.mergeCells('AQ1:AQ2') // OBSERVACIONES

      worksheet.getRow(1).height = 30
      worksheet.getRow(2).height = 40
      worksheet.getRow(1).eachCell({ includeEmpty: true }, cell => { cell.style = HEADER_STYLE })
      worksheet.getRow(2).eachCell({ includeEmpty: true }, cell => { cell.style = SUBHEADER_STYLE })

      // ── Anchos ──
      const colWidths = [
        10, 12, 14, 15, 20, 30,        // A-F
        12, 12, 10, 12, 10, 15, 12, 12, 10, 10, // G-P estructura
        18,                             // Q operador
        10, 10, 10, 10, 10, 10, 12, 10, // R-Y ocupación
        8, 12, 10, 10, 10, 10,          // Z-AE cruce
        10, 12, 10, 10, 12, 12, 12,     // AF-AL activos
        10, 12, 10, 10,                 // AM-AP pasivos
        35                              // AQ observaciones
      ]
      colWidths.forEach((w, i) => { worksheet.getColumn(i + 1).width = w })

      // ── Datos ──
      const bool = v => v === true ? 'SI' : v === false ? 'NO' : ''

      datos.forEach((r, index) => {
        const row = worksheet.addRow([
          r.consecutivo || '',
          r.fecha_registro ? new Date(r.fecha_registro).toLocaleDateString('es-CO') : '',
          r.waypoint || '',
          r.ciudad || '',
          r.barrio || '',
          r.direccion_completa || '',
          r.tipo || '',
          r.consecutivo_poste || '',
          r.marcada || '',
          r.material || '',
          r.carga_rotura || '',
          r.codigo_estructura || '',
          r.templete || '',
          r.estado_templete || '',
          r.altura || '',
          r.ano_fabricacion || '',
          r.operador_nombre || '',
          r.herrajes || '',
          r.coaxial || '',
          r.telefonico || '',
          r.fibra_optica || '',
          r.utp || '',
          r.guaya || '',
          r.total_cables || '',
          r.marquilla || '',
          r.cruce_via || '',
          r.cruce_estado || '',
          r.cruce_diagonal || '',
          r.cruce_sin_red || '',
          r.cruce_acometida || '',
          r.cruce_desalineado || '',
          bool(r.activo_amplificador),
          bool(r.activo_nodo_optico),
          bool(r.activo_fuente_poder),
          bool(r.activo_amplificador_110v),
          bool(r.activo_nodo_optico_110v),
          bool(r.activo_fuente_poder_110v),
          bool(r.activo_switch_110v),
          bool(r.pasivo_caja_nap),
          bool(r.pasivo_caja_empalme),
          bool(r.pasivo_reserva),
          bool(r.pasivo_bajante),
          r.operador_observaciones || ''
        ])
        applyDataRow(row, index)
      })

      worksheet.views = [{ state: 'frozen', xSplit: 6, ySplit: 2 }]

      const { operador } = req.query
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_OPERADOR_${operador || 'TODOS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error('❌ exportarInventarioOperador ERROR:', { message: error.message, detail: error.detail, hint: error.hint })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null })
    }
  },

  // ========== INVENTARIO POR INSPECTOR ==========
  getInventarioInspector: async (req, res) => {
    try {
      console.log('📋 getInventarioInspector - filtros:', req.query)
      const datos = await reportesApi.getInventarioInspector(req.query)
      res.json({ success: true, data: datos })
    } catch (error) {
      console.error('❌ getInventarioInspector ERROR:', { message: error.message, detail: error.detail, hint: error.hint, query: error.query, where: error.where })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null, hint: error.hint || null })
    }
  },

  exportarInventarioInspector: async (req, res) => {
    try {
      console.log('📋 exportarInventarioInspector - filtros:', req.query)
      const datos = await reportesApi.getInventarioInspectorCompleto(req.query)

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('REPORTE INSPECTOR')

      // ── Fila 1: Grupos ──
      worksheet.getRow(1).values = [
        'CONSEC.',     // A
        'FECHA',       // B
        'INSPECTOR',   // C
        'WAYPOINT',    // D
        'CIUDAD',      // E
        'BARRIO',      // F
        'DIRECCIÓN',   // G
        'ESTRUCTURA',  // H (merge H1:Q1)
        '', '', '', '', '', '', '', '', '',
        'ESTADO ESTRUCTURA', // R (merge R1:V1)
        '', '', '', '',
        'REDES',       // S (merge W1:AB1) — ajustado abajo
        '', '', '', '', '',
        'OPERADORES',  // AC (merge AC1:AD1)
        ''
      ]

      // ── Fila 2: Subcolumnas ──
      worksheet.getRow(2).values = [
        '', '', '', '', '', '', '',   // A-G merged
        'TIPO',        // H
        'CONSEC.',     // I
        'MARCADA',     // J
        'MATERIAL',    // K
        'C.ROTURA',    // L
        'COD.',        // M
        'TEMPLETE',    // N
        'EST.TEMP.',   // O
        'ALTURA',      // P
        'AÑO FAB.',    // Q
        'ESTADO',      // R
        'DESPLOMADO',  // S
        'FLECTADO',    // T
        'FRACTURADO',  // U
        'HIERRO BASE', // V
        'BAJA',        // W
        'TIPO CABLE',  // X
        'ESTADO RED',  // Y
        'ALUMBRADO',   // Z
        'TIPO CAB.ALU',// AA
        'TIERRA',      // AB
        'CANTIDAD',    // AC
        'LISTA'        // AD
      ]

      // ── Merges ──
      worksheet.mergeCells('A1:A2')
      worksheet.mergeCells('B1:B2')
      worksheet.mergeCells('C1:C2')
      worksheet.mergeCells('D1:D2')
      worksheet.mergeCells('E1:E2')
      worksheet.mergeCells('F1:F2')
      worksheet.mergeCells('G1:G2')
      worksheet.mergeCells('H1:Q1')  // ESTRUCTURA (10 cols)
      worksheet.mergeCells('R1:V1')  // ESTADO ESTRUCTURA (5 cols)
      worksheet.mergeCells('W1:AB1') // REDES (6 cols)
      worksheet.mergeCells('AC1:AD1')// OPERADORES (2 cols)

      worksheet.getRow(1).height = 30
      worksheet.getRow(2).height = 40
      worksheet.getRow(1).eachCell({ includeEmpty: true }, cell => { cell.style = HEADER_STYLE })
      worksheet.getRow(2).eachCell({ includeEmpty: true }, cell => { cell.style = SUBHEADER_STYLE })

      // ── Anchos ──
      const colWidths = [
        10, 12, 22, 14, 15, 20, 30,  // A-G
        12, 12, 10, 12, 10, 15, 12, 12, 10, 10, // H-Q estructura
        14, 12, 10, 12, 12,          // R-V estado estructura
        8, 15, 12, 8, 15, 8,         // W-AB redes
        10, 35                        // AC-AD operadores
      ]
      colWidths.forEach((w, i) => { worksheet.getColumn(i + 1).width = w })

      // ── Datos ──
      datos.forEach((r, index) => {
        const row = worksheet.addRow([
          r.consecutivo || '',
          r.fecha_registro ? new Date(r.fecha_registro).toLocaleDateString('es-CO') : '',
          r.inspector_nombre || '',
          r.waypoint || '',
          r.ciudad || '',
          r.barrio || '',
          r.direccion_completa || '',
          r.tipo || '',
          r.consecutivo_poste || '',
          r.marcada || '',
          r.material || '',
          r.carga_rotura || '',
          r.codigo_estructura || '',
          r.templete || '',
          r.estado_templete || '',
          r.altura || '',
          r.ano_fabricacion || '',
          r.estado_estructura || '',
          r.desplomado || '',
          r.flectado || '',
          r.fracturado || '',
          r.hierro_base || '',
          r.baja || '',
          r.baja_tipo_cable || '',
          r.baja_estado_red || '',
          r.alumbrado || '',
          r.alumbrado_tipo_cable || '',
          r.tierra_electrica || '',
          r.total_operadores || 0,
          r.operadores_lista || ''
        ])
        applyDataRow(row, index)
      })

      worksheet.views = [{ state: 'frozen', xSplit: 7, ySplit: 2 }]

      const { inspector } = req.query
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_INSPECTOR_${inspector || 'TODOS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error('❌ exportarInventarioInspector ERROR:', { message: error.message, detail: error.detail, hint: error.hint })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null })
    }
  },

  // ========== REPORTE DE REDES ==========
  getReporteRedes: async (req, res) => {
    try {
      console.log('📋 getReporteRedes - filtros:', req.query)
      const datos = await reportesApi.getReporteRedes(req.query)
      res.json({ success: true, data: datos })
    } catch (error) {
      console.error('❌ getReporteRedes ERROR:', { message: error.message, detail: error.detail, hint: error.hint, query: error.query, where: error.where })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null, hint: error.hint || null })
    }
  },

  exportarReporteRedes: async (req, res) => {
    try {
      console.log('📋 exportarReporteRedes - filtros:', req.query)
      const datos = await reportesApi.getReporteRedesCompleto(req.query)

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('REPORTE DE REDES')

      worksheet.getRow(1).values = [
        'CONSECUTIVO', 'CIUDAD', 'BARRIO', 'DIRECCION',
        'ESTRUCTURA', '', '', '', '', '', '', '', '', '',
        'ESTADO',
        'BAJA TENSION', '', '', '',
        'CAJAS', '',
        'ALUMBRADO', '', '',
        'LAMPARA 1', '', '', '',
        'LAMPARA 2', '', '', '',
        'TIERRA', '', '', '', '',
        'ELEMENTOS ADICIONALES', '', '', '', '', '',
        'BAJANTES'
      ]

      worksheet.getRow(2).values = [
        '', '', '', '',
        'TIPO', 'CONSEC.', 'MARCADA', 'MATERIAL', 'C.ROTURA',
        'COD. ESTRUCT.', 'TEMPLETE', 'EST. TEMPLETE', 'ALTURA', 'AÑO FAB.',
        '',
        'EXISTE', 'TIPO CABLE', 'ESTADO RED', 'CONTINUIDAD',
        'CAJA 1', 'CAJA 2',
        'EXISTE', 'TIPO CABLE', 'ESTADO RED',
        'TIPO', 'CÓDIGO', 'DAÑADA', 'ENCENDIDA',
        'TIPO', 'CÓDIGO', 'DAÑADA', 'ENCENDIDA',
        'EXISTE', 'ESTADO', 'SUELTA', 'DESCONECT.', 'ROTA',
        'LÁMPARA', 'CÁMARA TV', 'CORNETA', 'AVISO', 'CAJA MET.', 'OTRO',
        ''
      ]

      worksheet.mergeCells('A1:A2')
      worksheet.mergeCells('B1:B2')
      worksheet.mergeCells('C1:C2')
      worksheet.mergeCells('D1:D2')
      worksheet.mergeCells('E1:N1')
      worksheet.mergeCells('O1:O2')
      worksheet.mergeCells('P1:S1')
      worksheet.mergeCells('T1:U1')
      worksheet.mergeCells('V1:X1')
      worksheet.mergeCells('Y1:AB1')
      worksheet.mergeCells('AC1:AF1')
      worksheet.mergeCells('AG1:AK1')
      worksheet.mergeCells('AL1:AQ1')
      worksheet.mergeCells('AR1:AR2')

      worksheet.getRow(1).height = 30
      worksheet.getRow(2).height = 40
      worksheet.getRow(1).eachCell({ includeEmpty: true }, cell => { cell.style = HEADER_STYLE })
      worksheet.getRow(2).eachCell({ includeEmpty: true }, cell => { cell.style = SUBHEADER_STYLE })

      const colWidths = [
        10, 15, 20, 30,
        12, 14, 10, 12, 10, 18, 12, 14, 10, 10,
        14,
        8, 15, 12, 12,
        12, 12,
        8, 15, 12,
        12, 15, 10, 12,
        12, 15, 10, 12,
        8, 14, 10, 12, 10,
        10, 10, 10, 10, 10, 10,
        14
      ]
      colWidths.forEach((w, i) => { worksheet.getColumn(i + 1).width = w })

      datos.forEach((r, index) => {
        const row = worksheet.addRow([
          r.consecutivo || '',
          r.ciudad || '',
          r.barrio || '',
          r.direccion_completa || '',
          r.tipo || '',
          r.consecutivo_poste || '',
          r.marcada || '',
          r.material || '',
          r.carga_rotura || '',
          r.codigo_estructura || '',
          r.templete || '',
          r.estado_templete || '',
          r.altura || '',
          r.ano_fabricacion || '',
          r.estado_estructura || '',
          r.baja || '',
          r.baja_tipo_cable || '',
          r.baja_estado_red || '',
          r.baja_continuidad_electrica || '',
          r.caja1 || '',
          r.caja2 || '',
          r.alumbrado || '',
          r.alumbrado_tipo_cable || '',
          r.alumbrado_estado_red || '',
          r.lampara1_tipo || '',
          r.lampara1_codigo || '',
          r.lampara1_danada || '',
          r.lampara1_encendida || '',
          r.lampara2_tipo || '',
          r.lampara2_codigo || '',
          r.lampara2_danada || '',
          r.lampara2_encendida || '',
          r.tierra_electrica || '',
          r.tierra_estado || '',
          r.tierra_suelta || '',
          r.tierra_desconectada || '',
          r.tierra_rota || '',
          r.lampara || '',
          r.camara_tv || '',
          r.corneta || '',
          r.aviso || '',
          r.caja_metalica || '',
          r.otro || '',
          r.bajantes_electricos || ''
        ])
        applyDataRow(row, index)
      })

      worksheet.views = [{ state: 'frozen', xSplit: 4, ySplit: 2 }]

      const { ciudad } = req.query
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_REDES_${ciudad || 'TODAS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error('❌ exportarReporteRedes ERROR:', { message: error.message, detail: error.detail, hint: error.hint })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null })
    }
  },

  // ========== REPORTE DE PODA ==========
  getReportePoda: async (req, res) => {
    try {
      console.log('📋 getReportePoda - filtros:', req.query)
      const datos = await reportesApi.getReportePoda(req.query)
      res.json({ success: true, data: datos })
    } catch (error) {
      console.error('❌ getReportePoda ERROR:', { message: error.message, detail: error.detail, hint: error.hint, query: error.query, where: error.where })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null, hint: error.hint || null })
    }
  },

  exportarReportePoda: async (req, res) => {
    try {
      console.log('📋 exportarReportePoda - filtros:', req.query)
      const datos = await reportesApi.getReportePoda(req.query)

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('REPORTE PODA')

      worksheet.columns = [
        { header: 'FECHA', key: 'fecha_registro', width: 12 },
        { header: 'WAYPOINT', key: 'waypoint', width: 15 },
        { header: 'CIUDAD', key: 'ciudad', width: 15 },
        { header: 'BARRIO', key: 'barrio', width: 20 },
        { header: 'DIRECCIÓN', key: 'direccion_completa', width: 35 },
        { header: 'REQUIERE PODA', key: 'poda_arboles', width: 15 }
      ]

      const headerRow = worksheet.getRow(1)
      headerRow.height = 30
      headerRow.eachCell({ includeEmpty: true }, cell => { cell.style = HEADER_STYLE })

      datos.forEach((r, index) => {
        const row = worksheet.addRow({
          fecha_registro: r.fecha_registro ? new Date(r.fecha_registro).toLocaleDateString('es-CO') : '',
          waypoint: r.waypoint || '',
          ciudad: r.ciudad || '',
          barrio: r.barrio || '',
          direccion_completa: r.direccion_completa || '',
          poda_arboles: r.poda_arboles || ''
        })
        applyDataRow(row, index)
      })

      worksheet.views = [{ state: 'frozen', ySplit: 1 }]

      const { ciudad } = req.query
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_PODA_${ciudad || 'TODAS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error('❌ exportarReportePoda ERROR:', { message: error.message, detail: error.detail, hint: error.hint })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null })
    }
  },

  // ========== REPORTE DE ESTRUCTURAS ==========
  getReporteEstructuras: async (req, res) => {
    try {
      console.log('📋 getReporteEstructuras - filtros:', req.query)
      const datos = await reportesApi.getReporteEstructuras(req.query)
      res.json({ success: true, data: datos })
    } catch (error) {
      console.error('❌ getReporteEstructuras ERROR:', { message: error.message, detail: error.detail, hint: error.hint, query: error.query, where: error.where })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null, hint: error.hint || null })
    }
  },

  exportarReporteEstructuras: async (req, res) => {
    try {
      console.log('📋 exportarReporteEstructuras - filtros:', req.query)
      const datos = await reportesApi.getReporteEstructurasCompleto(req.query)

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('REPORTE ESTRUCTURAS')

      // ── Fila 1: Grupos ──
      worksheet.getRow(1).values = [
        'CONSEC.',    // A
        'FECHA',      // B
        'WAYPOINT',   // C
        'CIUDAD',     // D
        'BARRIO',     // E
        'DIRECCIÓN',  // F
        'ESTRUCTURA', // G (merge G1:P1)
        '', '', '', '', '', '', '', '', '',
        'ESTADO ESTRUCTURA', // Q (merge Q1:U1)
        '', '', '', '',
        'NOVEDADES',  // V (merge V1:X1)
        '', ''
      ]

      // ── Fila 2: Subcolumnas ──
      worksheet.getRow(2).values = [
        '', '', '', '', '', '',  // A-F merged
        'TIPO',        // G
        'CONSEC.',     // H
        'MARCADA',     // I
        'MATERIAL',    // J
        'C.ROTURA',    // K
        'COD.',        // L
        'TEMPLETE',    // M
        'EST.TEMP.',   // N
        'ALTURA',      // O
        'AÑO FAB.',    // P
        'ESTADO',      // Q
        'DESPLOMADO',  // R
        'FLECTADO',    // S
        'FRACTURADO',  // T
        'HIERRO BASE', // U
        'BAJANTES',    // V
        'PODA',        // W
        'POSIBLE FRAUDE' // X
      ]

      // ── Merges ──
      worksheet.mergeCells('A1:A2')
      worksheet.mergeCells('B1:B2')
      worksheet.mergeCells('C1:C2')
      worksheet.mergeCells('D1:D2')
      worksheet.mergeCells('E1:E2')
      worksheet.mergeCells('F1:F2')
      worksheet.mergeCells('G1:P1')  // ESTRUCTURA (10 cols)
      worksheet.mergeCells('Q1:U1')  // ESTADO ESTRUCTURA (5 cols)
      worksheet.mergeCells('V1:X1')  // NOVEDADES (3 cols)

      worksheet.getRow(1).height = 30
      worksheet.getRow(2).height = 40
      worksheet.getRow(1).eachCell({ includeEmpty: true }, cell => { cell.style = HEADER_STYLE })
      worksheet.getRow(2).eachCell({ includeEmpty: true }, cell => { cell.style = SUBHEADER_STYLE })

      // ── Anchos ──
      const colWidths = [
        10, 12, 14, 15, 20, 30,        // A-F
        12, 12, 10, 12, 10, 15, 12, 12, 10, 10, // G-P estructura
        14, 12, 10, 12, 12,            // Q-U estado
        14, 10, 15                      // V-X novedades
      ]
      colWidths.forEach((w, i) => { worksheet.getColumn(i + 1).width = w })

      // ── Datos ──
      datos.forEach((r, index) => {
        const row = worksheet.addRow([
          r.consecutivo || '',
          r.fecha_registro ? new Date(r.fecha_registro).toLocaleDateString('es-CO') : '',
          r.waypoint || '',
          r.ciudad || '',
          r.barrio || '',
          r.direccion_completa || '',
          r.tipo || '',
          r.consecutivo_poste || '',
          r.marcada || '',
          r.material || '',
          r.carga_rotura || '',
          r.codigo_estructura || '',
          r.templete || '',
          r.estado_templete || '',
          r.altura || '',
          r.ano_fabricacion || '',
          r.estado_estructura || '',
          r.desplomado || '',
          r.flectado || '',
          r.fracturado || '',
          r.hierro_base || '',
          r.bajantes_electricos || '',
          r.poda_arboles || '',
          r.posible_fraude || ''
        ])
        applyDataRow(row, index)
      })

      worksheet.views = [{ state: 'frozen', xSplit: 6, ySplit: 2 }]

      const { ciudad } = req.query
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_ESTRUCTURAS_${ciudad || 'TODAS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error('❌ exportarReporteEstructuras ERROR:', { message: error.message, detail: error.detail, hint: error.hint })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null })
    }
  },

  // ========== REPORTE DE PÉRDIDAS ==========
  getReportePerdidas: async (req, res) => {
    try {
      console.log('📋 getReportePerdidas - filtros:', req.query)
      const datos = await reportesApi.getReportePerdidas(req.query)
      res.json({ success: true, data: datos })
    } catch (error) {
      console.error('❌ getReportePerdidas ERROR:', { message: error.message, detail: error.detail, hint: error.hint, query: error.query, where: error.where })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null, hint: error.hint || null })
    }
  },

  exportarReportePerdidas: async (req, res) => {
    try {
      console.log('📋 exportarReportePerdidas - filtros:', req.query)
      const datos = await reportesApi.getReportePerdidas(req.query)

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('REPORTE PÉRDIDAS')

      worksheet.columns = [
        { header: 'FECHA', key: 'fecha_registro', width: 12 },
        { header: 'WAYPOINT', key: 'waypoint', width: 15 },
        { header: 'CIUDAD', key: 'ciudad', width: 15 },
        { header: 'BARRIO', key: 'barrio', width: 20 },
        { header: 'DIRECCIÓN', key: 'direccion_completa', width: 35 },
        { header: 'POSIBLE FRAUDE', key: 'posible_fraude', width: 15 }
      ]

      const headerRow = worksheet.getRow(1)
      headerRow.height = 30
      headerRow.eachCell({ includeEmpty: true }, cell => { cell.style = HEADER_STYLE })

      datos.forEach((r, index) => {
        const row = worksheet.addRow({
          fecha_registro: r.fecha_registro ? new Date(r.fecha_registro).toLocaleDateString('es-CO') : '',
          waypoint: r.waypoint || '',
          ciudad: r.ciudad || '',
          barrio: r.barrio || '',
          direccion_completa: r.direccion_completa || '',
          posible_fraude: r.posible_fraude || ''
        })
        applyDataRow(row, index)
      })

      worksheet.views = [{ state: 'frozen', ySplit: 1 }]

      const { ciudad } = req.query
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_PERDIDAS_${ciudad || 'TODAS'}_${new Date().toISOString().split('T')[0]}.xlsx`)
      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error('❌ exportarReportePerdidas ERROR:', { message: error.message, detail: error.detail, hint: error.hint })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null })
    }
  },

  // ========== REPORTE DE FACTIBILIDAD ==========
  getReporteFactibilidad: async (req, res) => {
    try {
      console.log('📋 getReporteFactibilidad - filtros:', req.query)
      const datos = await reportesApi.getReporteFactibilidad(req.query)
      res.json({ success: true, data: datos })
    } catch (error) {
      console.error('❌ getReporteFactibilidad ERROR:', { message: error.message, detail: error.detail, hint: error.hint, query: error.query, where: error.where })
      res.status(500).json({ success: false, error: error.message, detail: error.detail || null, hint: error.hint || null })
    }
  },

exportarReporteFactibilidad: async (req, res) => {
  try {
    console.log('📋 exportarReporteFactibilidad - filtros:', req.query)
    const datos = await reportesApi.getReporteFactibilidadCompleto(req.query)

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('REPORTE FACTIBILIDAD')

    // ── Fila 1: Grupos ──
    worksheet.getRow(1).values = [
      'FECHA',        // A
      'CÓDIGO POSTE', // B
      'CIUDAD',       // C
      'BARRIO',       // D
      'DIRECCIÓN',    // E
      'OPERADOR',     // F
      'PROYECTO',     // G
      'COORDENADAS',  // H
      'POSTE',        // I (merge I1:N1)
      '', '', '', '', '',
      'RED ELÉCTRICA',       // O (merge O1:X1)
      '', '', '', '', '', '', '', '', '',
      'TELEC. PASIVOS',      // Y (merge Y1:AH1)
      '', '', '', '', '', '', '', '', '',
      'TELEC. ACTIVOS',      // AI (merge AI1:AM1)
      '', '', '', '',
      'MÉTODO DE TENDIDO',   // AN (merge AN1:AT1)
      '', '', '', '', '', '',
      'OBSERVACIONES',       // AU (merge AU1:AW1)
      '', ''
    ]

    // ── Fila 2: Subcolumnas ──
    worksheet.getRow(2).values = [
      '', '', '', '', '', '', '', '',  // A-H merged
      'MATERIAL',      // I
      'ALTURA',        // J
      'RESISTENCIA',   // K
      'USO/CARGA',     // L
      'RETENIDA',      // M
      'ESTADO',        // N
      'NIV.AT',        // O
      'NIV.MT',        // P
      'NIV.BT',        // Q
      'NIV.AP',        // R
      'TRANSFORM.',    // S
      'SECCIONAD.',    // T
      'CORTA CIRC.',   // U
      'MEDIDOR',       // V
      'BAJANTE EL.',   // W
      'TIERRA EL.',    // X
      'CABLES',        // Y
      'COAXIAL',       // Z
      'FIBRA',         // AA
      'DROP',          // AB
      'RG11',          // AC
      'CAJ.EMPALME',   // AD
      'CAJ.GPON',      // AE
      'STP',           // AF
      'BAJANTES',      // AG
      'RESERVAS',      // AH
      'AMPLIF.',       // AI
      'FUENTES',       // AJ
      'NODO ÓPT.',     // AK
      'ANTENA',        // AL
      'CÁMARA VIG.',   // AM
      'MTH RETEN.',    // AN
      'MTH SUSPEN.',   // AO
      'RETENCIÓN',     // AP
      'CAB.COAXIAL',   // AQ
      'CAB.FIBRA',     // AR
      'TIPO CABLE',    // AS
      'FIJ.HERRAJE',   // AT
      'OBS.TENDIDO',   // AU
      'RESTRICCIONES', // AV
      'SUGERENCIAS'    // AW
    ]

    // ── Merges ──
    worksheet.mergeCells('A1:A2')
    worksheet.mergeCells('B1:B2')
    worksheet.mergeCells('C1:C2')
    worksheet.mergeCells('D1:D2')
    worksheet.mergeCells('E1:E2')
    worksheet.mergeCells('F1:F2')
    worksheet.mergeCells('G1:G2')
    worksheet.mergeCells('H1:H2')
    worksheet.mergeCells('I1:N1')   // POSTE (6 cols)
    worksheet.mergeCells('O1:X1')   // RED ELÉCTRICA (10 cols)
    worksheet.mergeCells('Y1:AH1')  // TELEC. PASIVOS (10 cols)
    worksheet.mergeCells('AI1:AM1') // TELEC. ACTIVOS (5 cols)
    worksheet.mergeCells('AN1:AT1') // MÉTODO TENDIDO (7 cols)
    worksheet.mergeCells('AU1:AW1') // OBSERVACIONES (3 cols)

    worksheet.getRow(1).height = 30
    worksheet.getRow(2).height = 40
    worksheet.getRow(1).eachCell({ includeEmpty: true }, cell => { cell.style = HEADER_STYLE })
    worksheet.getRow(2).eachCell({ includeEmpty: true }, cell => { cell.style = SUBHEADER_STYLE })

    // ── Anchos ──
    const colWidths = [
      12, 15, 15, 20, 30, 20, 20, 25,  // A-H
      12, 10, 12, 12, 10, 14,           // I-N poste
      8, 8, 8, 8, 12, 12, 12, 10, 12, 10, // O-X red eléctrica
      10, 10, 10, 10, 10, 12, 10, 10, 10, 10, // Y-AH pasivos
      10, 10, 12, 10, 12,               // AI-AM activos
      12, 12, 12, 12, 12, 15, 14,       // AN-AT método tendido
      30, 35, 35                         // AU-AW observaciones
    ]
    colWidths.forEach((w, i) => { worksheet.getColumn(i + 1).width = w })

    // ── Datos ──
    const bool = v => v === true ? 'SI' : v === false ? 'NO' : (v || '')

    const parseCheck = (val) => {
      try {
        const arr = typeof val === 'string' ? JSON.parse(val) : (val || [])
        return Array.isArray(arr) ? arr.join(', ') : ''
      } catch { return '' }
    }

    datos.forEach((r, index) => {
      const row = worksheet.addRow([
        r.created_at ? new Date(r.created_at).toLocaleDateString('es-CO') : '',
        r.codigo_poste || '',
        r.ciudad || '',
        r.barrio || '',
        r.direccion || '',
        r.operador || '',
        r.proyecto || '',
        r.coordenadas || '',
        // POSTE
        r.poste_material || '',
        r.poste_altura || '',
        r.poste_resistencia || '',
        r.poste_uso_carga || '',
        r.poste_retenida || '',
        r.poste_estado || '',
        // RED ELÉCTRICA
        bool(r.nivel_tension_at),
        bool(r.nivel_tension_mt),
        bool(r.nivel_tension_bt),
        bool(r.nivel_tension_ap),
        bool(r.elem_transformador),
        bool(r.elem_seccionador),
        bool(r.elem_corta_circuito),
        bool(r.elem_medidor),
        bool(r.elem_bajante_electrico),
        bool(r.tierra_electrica),
        // TELEC. PASIVOS
        r.telp_pas_cables || '',
        r.telp_pas_c_coaxial || '',
        r.telp_pas_c_fibra || '',
        r.telp_pas_c_drop || '',
        r.telp_pas_c_rg11 || '',
        r.telp_pas_cajempalme || '',
        r.telp_pas_cajgpon || '',
        r.telp_pas_stp || '',
        r.telp_pas_bajantes || '',
        r.telp_pas_reservas || '',
        // TELEC. ACTIVOS
        r.telp_act_amplificadores || '',
        r.telp_act_fuentes || '',
        r.telp_act_nodooptico || '',
        r.telp_act_antena || '',
        r.telp_act_camara_vigil || '',
        // MÉTODO DE TENDIDO
        r.telp_mth_retencion || '',
        r.telp_mth_suspencion || '',
        r.telp_retencion || '',
        r.telp_ccoaxial || '',
        r.telp_cfibra || '',
        r.tipo_cable || '',
        r.fijacion_herraje || '',
        // OBSERVACIONES
        r.observacion_tendido || '',
        parseCheck(r.checkboxes_tendido),
        parseCheck(r.checkboxes_sugerencias)
      ])
      applyDataRow(row, index)
    })

    worksheet.views = [{ state: 'frozen', xSplit: 8, ySplit: 2 }]

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=REPORTE_FACTIBILIDAD_${new Date().toISOString().split('T')[0]}.xlsx`)
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    console.error('❌ exportarReporteFactibilidad ERROR:', { message: error.message, detail: error.detail, hint: error.hint })
    res.status(500).json({ success: false, error: error.message, detail: error.detail || null })
  }
},


  
  // ========== DASHBOARD STATS ==========
getDashboardStats: async (req, res) => {
  try {
    const stats = await reportesApi.getDashboardStats()
    res.json({ success: true, data: stats })
  } catch (error) {
    console.error('❌ getDashboardStats ERROR:', { message: error.message })
    res.status(500).json({ success: false, error: error.message })
  }
}


}

module.exports = reportesController
