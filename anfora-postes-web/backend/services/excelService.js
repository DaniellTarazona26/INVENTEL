// backend/services/excelService.js
const ExcelJS = require('exceljs');

const excelService = {
  // ========================================
  // 1. REPORTE INVENTARIO POR OPERADOR
  // ========================================
  generarReporteInventarioOperador: async (datos, filtros) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Operador');

    // Título del reporte
    worksheet.mergeCells('A1:Z1');
    worksheet.getCell('A1').value = 'Reporte de inventario por Operador';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

    // ========================================
    // ENCABEZADOS NIVEL 1 (Grupos principales)
    // ========================================
    const headerRow1 = worksheet.getRow(3);
    headerRow1.values = [
      '#', 'FECHA', 'ESTRUCTURA', 'WAYPOINT', 'LATITUD', 'LONGITUD', 'CIUDAD', 
      'BARRIO', 'DIRECCION', 'CONSECUTIVO POSTE', 'CODIGO ESTRUCTURA', 'OPERADOR',
      'NIVELES DE OCUPACIÓN', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'CRUCE EN VIA', '', '', '', '', '',
      'ELEMENTOS EXISTENTES', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'EMPALMES', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'RESERVA DE CABLE', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'CAJAS DE DISTRIBUCIÓN', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'ABONADOS', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'BAJANTES', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'OBSERVACIONES OPERADOR'
    ];

    // Aplicar estilos al encabezado nivel 1
    headerRow1.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 11 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Fusionar celdas para grupos
    worksheet.mergeCells('M3:AB3'); // NIVELES DE OCUPACIÓN
    worksheet.mergeCells('AC3:AH3'); // CRUCE EN VIA
    worksheet.mergeCells('AI3:BA3'); // ELEMENTOS EXISTENTES
    worksheet.mergeCells('BB3:BO3'); // EMPALMES
    // ... (continuar con las demás fusiones)

    // ========================================
    // ENCABEZADOS NIVEL 2 (Subgrupos)
    // ========================================
    const headerRow2 = worksheet.getRow(4);
    headerRow2.values = [
      '', '', '', '', '', '', '', '', '', '', '', '',
      'HERRAJES', 'CABLES AGRUPADOS', 'NO AGRUPADOS', 'MARCADOS', 
      'COAXIAL', '', '', 'TELEFONICO', '', '', 'FIBRA OPTICA', '', '', 
      'UTP', '', '', 'GUAYA', '', '', '', '', '', '', '',
      // ... (todos los subgrupos según el CSV)
    ];

    // Aplicar estilos al encabezado nivel 2
    headerRow2.eachCell((cell, colNumber) => {
      if (colNumber > 12) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9E1F2' }
        };
        cell.font = { bold: true, size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    });

    // ========================================
    // ENCABEZADOS NIVEL 3 (Campos específicos)
    // ========================================
    const headerRow3 = worksheet.getRow(5);
    headerRow3.values = [
      '', '', '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', 
      'EXISTE', 'POSTE A PREDIO', 'POSTE A VIA',
      'EXISTE', 'POSTE A PREDIO', 'POSTE A VIA',
      'EXISTE', 'POSTE A PREDIO', 'POSTE A VIA',
      'EXISTE', 'POSTE A PREDIO', 'POSTE A VIA',
      '', 'CRUCE', 'ESTADO', 'DIAGONAL', 'SIN RED', 'ACOMETIDA', 'DESALINEADO',
      // ... (todos los campos según el CSV)
    ];

    // Aplicar estilos al encabezado nivel 3
    headerRow3.eachCell((cell, colNumber) => {
      if (colNumber > 12) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' }
        };
        cell.font = { size: 9 };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    });

    // ========================================
    // DATOS
    // ========================================
    let rowIndex = 6;
    datos.forEach((registro, index) => {
      const row = worksheet.getRow(rowIndex);
      
      // Extraer operadores del campo JSONB
      let operadoresNombres = '';
      if (registro.operadores && Array.isArray(registro.operadores)) {
        operadoresNombres = registro.operadores.map(op => op.nombre).join(', ');
      }

      row.values = [
        index + 1,
        registro.fecha ? new Date(registro.fecha).toLocaleDateString('es-CO') : '',
        registro.estructura || '',
        registro.waypoint || '',
        registro.latitud || 0,
        registro.longitud || 0,
        registro.ciudad || '',
        registro.barrio || '',
        registro.direccion || '',
        registro.consecutivo_poste || '',
        registro.codigo_estructura || '',
        operadoresNombres,
        // Agregar todos los demás campos según la estructura del CSV
        registro.baja || 'NO',
        registro.alumbrado || 'NO',
        // ... (continuar con todos los campos)
      ];

      // Aplicar estilos a las celdas de datos
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', wrapText: false };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
        };
      });

      rowIndex++;
    });

    // Ajustar anchos de columnas
    worksheet.columns.forEach((column, index) => {
      if (index < 12) {
        column.width = 15;
      } else {
        column.width = 12;
      }
    });

    // Fijar filas de encabezado
    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: 5 }
    ];

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },

  // ========================================
  // 2. REPORTE INVENTARIO POR INSPECTOR
  // ========================================
  generarReporteInventarioInspector: async (datos, filtros) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Inspector');

    // Encabezado del sistema
    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').value = 'ANFORA - Sistema de Captura de Inventario de estructuras';
    worksheet.getCell('A1').font = { size: 14, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A2:G2');
    worksheet.getCell('A2').value = 'REPORTE DE INVENTARIO POR INSPECTOR';
    worksheet.getCell('A2').font = { size: 12, bold: true };
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Información del inspector
    if (datos.length > 0 && datos[0].inspector) {
      worksheet.mergeCells('A4:G4');
      worksheet.getCell('A4').value = `INSPECTOR: ${datos[0].inspector}`;
      worksheet.getCell('A4').font = { size: 11, bold: true };
    }

    // Encabezados de columnas
    const headerRow = worksheet.getRow(6);
    headerRow.values = ['N°', 'FECHA', 'ESTRUCTURA', 'CIUDAD', 'BARRIO', 'DIRECCION', 'FOTO'];
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    headerRow.eachCell((cell) => {
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Datos
    let rowIndex = 7;
    datos.forEach((registro, index) => {
      const row = worksheet.getRow(rowIndex);
      row.values = [
        registro.id || (index + 1),
        registro.fecha ? new Date(registro.fecha).toLocaleDateString('es-CO') : '',
        registro.estructura || '',
        registro.ciudad || '',
        registro.barrio || '',
        registro.direccion || '',
        registro.foto ? 'Sí' : ''
      ];

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      rowIndex++;
    });

    // Total
    const totalRow = worksheet.getRow(rowIndex + 1);
    totalRow.getCell(1).value = 'TOTAL';
    totalRow.getCell(1).font = { bold: true };
    totalRow.getCell(2).value = datos.length;
    totalRow.getCell(2).font = { bold: true };

    // Ajustar anchos
    worksheet.getColumn(1).width = 8;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 10;

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },

  // ========================================
  // 3. REPORTE DE REDES
  // ========================================
  generarReporteRedes: async (datos, filtros) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Redes');

    // Encabezados (basado en REPORTE_REDES_CUCUTA CSV)
    const headerRow = worksheet.getRow(1);
    headerRow.values = [
      '#', 'FECHA', 'ESTRUCTURA', 'WAYPOINT', 'LATITUD', 'LONGITUD', 
      'CIUDAD', 'BARRIO', 'DIRECCION',
      'ESTRUCTURA', '', '', '', '', '', '', '', '', '',
      'TIPO RED', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'ESTADO ESTRUCTURA', '', '', '', '', '',
      'OPERADORES', 'OBSERVACION GENERAL'
    ];

    // Estilos del encabezado
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };

    // Datos
    let rowIndex = 2;
    datos.forEach((registro, index) => {
      const row = worksheet.getRow(rowIndex);
      
      let operadoresNombres = '';
      if (registro.operadores && Array.isArray(registro.operadores)) {
        operadoresNombres = registro.operadores.map(op => op.nombre).join(', ');
      }

      row.values = [
        index + 1,
        registro.fecha ? new Date(registro.fecha).toLocaleDateString('es-CO') : '',
        registro.estructura || '',
        registro.waypoint || '',
        registro.latitud || 0,
        registro.longitud || 0,
        registro.ciudad || '',
        registro.barrio || '',
        registro.direccion || '',
        registro.tipo_estructura || '',
        registro.consecutivo_poste || '',
        registro.marcada || '',
        registro.material || '',
        registro.carga_rotura || '',
        registro.codigo_estructura || '',
        // ... agregar todos los campos de red
        operadoresNombres,
        ''
      ];

      rowIndex++;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },

  // ========================================
  // 4. REPORTE DE ESTRUCTURAS
  // ========================================
  generarReporteEstructuras: async (datos, filtros) => {
    // Similar al de redes pero con enfoque en elementos técnicos
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Estructuras');

    // Implementar similar al de Inventario Operador
    // pero con columnas específicas de estructuras

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },

  // ========================================
  // 5. REPORTE DE PODA
  // ========================================
  generarReportePoda: async (datos, filtros) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Poda');

    // Encabezados simples
    const headerRow = worksheet.getRow(1);
    headerRow.values = [
      '#', 'FECHA', 'ESTRUCTURA', 'EMPRESA', 'CONSECUTIVO POSTE', 
      'CODIGO ESTRUCTURA', 'LATITUD', 'LONGITUD', 'CIUDAD', 'BARRIO', 'DIRECCION'
    ];

    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    headerRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Datos
    let rowIndex = 2;
    datos.forEach((registro, index) => {
      const row = worksheet.getRow(rowIndex);
      row.values = [
        index + 1,
        registro.fecha ? new Date(registro.fecha).toLocaleDateString('es-CO') : '',
        registro.estructura || '',
        registro.empresa || '',
        registro.consecutivo_poste || '',
        registro.codigo_estructura || '',
        registro.latitud || 0,
        registro.longitud || 0,
        registro.ciudad || '',
        registro.barrio || '',
        registro.direccion || ''
      ];

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      rowIndex++;
    });

    // Ajustar anchos
    worksheet.columns.forEach((column, index) => {
      column.width = index === 10 ? 30 : 15;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },

  // ========================================
  // 6. REPORTE DE FACTIBILIDAD
  // ========================================
  generarReporteFactibilidad: async (datos, filtros) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Factibilidades');

    // Encabezado especial con info del proyecto
    worksheet.mergeCells('A1:AZ1');
    worksheet.getCell('A1').value = 'CARTERA DE VIABILIDADES TECNICAS';
    worksheet.getCell('A1').font = { size: 14, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Fila 2: Info del operador y proyecto
    worksheet.getCell('A2').value = 'OPERADOR:';
    worksheet.getCell('B2').value = filtros.operador || '';
    worksheet.getCell('C2').value = 'NUMERO DE SOLICITUD:';
    worksheet.getCell('D2').value = filtros.numeroSolicitud || '';

    // Encabezados principales (fila 4)
    const headerRow = worksheet.getRow(4);
    headerRow.values = [
      'N°', 'IDENTIFICACIÓN', '', '', '', '', '', '', '', '',
      'ESTRUCTURA ELECTRICA', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'ELEMENTOS TELECOMUNICACION EXISTENTES', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'ELEMENTOS TELECOMUNICACION PROYECTADOS', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'FIJACIÓN /HERRAJE', 'OBSERVACION AL TENDIDO', '', 'OBSERVASION Y/O SUGERENCIAS'
    ];

    // Estilos
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };

    // Datos
    let rowIndex = 6;
    datos.forEach((registro, index) => {
      const row = worksheet.getRow(rowIndex);
      row.values = [
        index + 1,
        registro.fecha ? new Date(registro.fecha).toLocaleDateString('es-CO') : '',
        registro.poste_plano || '',
        registro.codigo_poste || '',
        registro.ciudad || '',
        registro.barrio || '',
        registro.direccion || '',
        registro.latitud || '',
        registro.longitud || '',
        registro.propietario || '',
        // ... agregar todos los campos de factibilidad
      ];

      rowIndex++;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },

  // ========================================
  // 7. REPORTE DE FACTIBILIDAD OPERADOR
  // ========================================
  generarReporteFactibilidadOperador: async (datos, filtros) => {
    // Similar al anterior pero simplificado
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Factibilidad Operador');

    // Implementar estructura simplificada

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },

  // ========================================
  // 8. REPORTE DE PÉRDIDAS
  // ========================================
  generarReportePerdidas: async (datos, filtros) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Pérdidas');

    // Implementar según necesidad específica del cliente

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
};

module.exports = excelService;
