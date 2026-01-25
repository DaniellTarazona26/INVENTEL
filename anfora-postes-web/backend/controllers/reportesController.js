// backend/controllers/reportesController.js
const reportesApi = require('../services/reportesApi');
const ExcelJS = require('exceljs');

const reportesController = {
  // ========== INVENTARIO POR OPERADOR ==========
  getInventarioOperador: async (req, res) => {
    try {
      const datos = await reportesApi.getInventarioOperador(req.query);
      res.json({
        success: true,
        data: datos
      });
    } catch (error) {
      console.error('Error al obtener inventario por operador:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el reporte'
      });
    }
  },

  exportarInventarioOperador: async (req, res) => {
    try {
      const datos = await reportesApi.getInventarioOperadorCompleto(req.query);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Operador');
      
      worksheet.columns = [
        { header: 'Fecha', key: 'fecha_registro', width: 12 },
        { header: 'Estructura', key: 'waypoint', width: 15 },
        { header: 'Ciudad', key: 'ciudad', width: 15 },
        { header: 'Barrio', key: 'barrio', width: 20 },
        { header: 'Dirección', key: 'direccion_completa', width: 30 },
        { header: 'Código', key: 'codigo_estructura', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 12 },
        { header: 'Material', key: 'material', width: 15 },
        { header: 'Altura', key: 'altura', width: 10 },
        { header: 'Año Fab.', key: 'ano_fabricacion', width: 10 },
        { header: 'Templete', key: 'templete', width: 15 },
        { header: 'Estado Templete', key: 'estado_templete', width: 15 },
        { header: 'Baja', key: 'baja', width: 8 },
        { header: 'Alumbrado', key: 'alumbrado', width: 10 },
        { header: 'Tierra', key: 'tierra_electrica', width: 10 }
      ];
      
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      datos.forEach(row => {
        const fecha = row.fecha_registro ? new Date(row.fecha_registro).toLocaleDateString('es-CO') : '';
        worksheet.addRow({
          ...row,
          fecha_registro: fecha
        });
      });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_OPERADOR_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al exportar inventario operador:', error);
      res.status(500).json({
        success: false,
        error: 'Error al exportar el reporte'
      });
    }
  },

  // ========== INVENTARIO POR INSPECTOR ==========
  getInventarioInspector: async (req, res) => {
    try {
      const datos = await reportesApi.getInventarioInspector(req.query);
      res.json({
        success: true,
        data: datos
      });
    } catch (error) {
      console.error('Error al obtener inventario por inspector:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el reporte'
      });
    }
  },

  exportarInventarioInspector: async (req, res) => {
    try {
      const datos = await reportesApi.getInventarioInspectorCompleto(req.query);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Inspector');
      
      worksheet.columns = [
        { header: 'Fecha', key: 'fecha_registro', width: 12 },
        { header: 'Estructura', key: 'waypoint', width: 15 },
        { header: 'Ciudad', key: 'ciudad', width: 15 },
        { header: 'Barrio', key: 'barrio', width: 20 },
        { header: 'Dirección', key: 'direccion_completa', width: 30 },
        { header: 'Código', key: 'codigo_estructura', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 12 },
        { header: 'Material', key: 'material', width: 15 },
        { header: 'Altura', key: 'altura', width: 10 },
        { header: 'Inspector', key: 'inspector', width: 20 }
      ];
      
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      datos.forEach(row => {
        const fecha = row.fecha_registro ? new Date(row.fecha_registro).toLocaleDateString('es-CO') : '';
        worksheet.addRow({
          ...row,
          fecha_registro: fecha
        });
      });
      
      const { inspector } = req.query;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${inspector || 'INSPECTOR'}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al exportar inventario inspector:', error);
      res.status(500).json({
        success: false,
        error: 'Error al exportar el reporte'
      });
    }
  },

  // ========== REPORTE DE REDES ==========
  getReporteRedes: async (req, res) => {
    try {
      const datos = await reportesApi.getReporteRedes(req.query);
      res.json({
        success: true,
        data: datos
      });
    } catch (error) {
      console.error('Error al obtener reporte de redes:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el reporte'
      });
    }
  },

  exportarReporteRedes: async (req, res) => {
    try {
      const datos = await reportesApi.getReporteRedesCompleto(req.query);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Redes');
      
      worksheet.columns = [
        { header: 'Fecha', key: 'fecha_registro', width: 12 },
        { header: 'Estructura', key: 'waypoint', width: 15 },
        { header: 'Ciudad', key: 'ciudad', width: 15 },
        { header: 'Barrio', key: 'barrio', width: 20 },
        { header: 'Dirección', key: 'direccion_completa', width: 30 },
        { header: 'Material', key: 'material', width: 15 },
        { header: 'Altura', key: 'altura', width: 10 },
        { header: 'Baja', key: 'baja', width: 8 },
        { header: 'Baja Tipo Cable', key: 'baja_tipo_cable', width: 15 },
        { header: 'Baja Estado', key: 'baja_estado_red', width: 12 },
        { header: 'Baja Continuidad', key: 'baja_continuidad_electrica', width: 15 },
        { header: 'Alumbrado', key: 'alumbrado', width: 10 },
        { header: 'Alumbrado Tipo Cable', key: 'alumbrado_tipo_cable', width: 18 },
        { header: 'Alumbrado Estado', key: 'alumbrado_estado_red', width: 15 },
        { header: 'Tierra', key: 'tierra_electrica', width: 10 },
        { header: 'Tierra Estado', key: 'tierra_estado', width: 12 }
      ];
      
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      datos.forEach(row => {
        const fecha = row.fecha_registro ? new Date(row.fecha_registro).toLocaleDateString('es-CO') : '';
        worksheet.addRow({
          ...row,
          fecha_registro: fecha
        });
      });
      
      const { ciudad } = req.query;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_REDES_${ciudad || 'TODAS'}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al exportar reporte de redes:', error);
      res.status(500).json({
        success: false,
        error: 'Error al exportar el reporte'
      });
    }
  },

  // ========== REPORTE DE PODA ==========
  getReportePoda: async (req, res) => {
    try {
      const datos = await reportesApi.getReportePoda(req.query);
      res.json({
        success: true,
        data: datos
      });
    } catch (error) {
      console.error('Error al obtener reporte de poda:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el reporte'
      });
    }
  },

  exportarReportePoda: async (req, res) => {
    try {
      const datos = await reportesApi.getReportePoda(req.query);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Poda');
      
      worksheet.columns = [
        { header: 'Fecha', key: 'fecha_registro', width: 12 },
        { header: 'Estructura', key: 'waypoint', width: 15 },
        { header: 'Ciudad', key: 'ciudad', width: 15 },
        { header: 'Barrio', key: 'barrio', width: 20 },
        { header: 'Dirección', key: 'direccion_completa', width: 30 },
        { header: 'Requiere Poda', key: 'poda_arboles', width: 12 }
      ];
      
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      datos.forEach(row => {
        const fecha = row.fecha_registro ? new Date(row.fecha_registro).toLocaleDateString('es-CO') : '';
        worksheet.addRow({
          ...row,
          fecha_registro: fecha
        });
      });
      
      const { ciudad } = req.query;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_PODA_${ciudad || 'TODAS'}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al exportar reporte de poda:', error);
      res.status(500).json({
        success: false,
        error: 'Error al exportar el reporte'
      });
    }
  },

  // ========== REPORTE DE ESTRUCTURAS ==========
  getReporteEstructuras: async (req, res) => {
    try {
      const datos = await reportesApi.getReporteEstructuras(req.query);
      res.json({
        success: true,
        data: datos
      });
    } catch (error) {
      console.error('Error al obtener reporte de estructuras:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el reporte'
      });
    }
  },

  exportarReporteEstructuras: async (req, res) => {
    try {
      const datos = await reportesApi.getReporteEstructurasCompleto(req.query);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Estructuras');
      
      worksheet.columns = [
        { header: 'Fecha', key: 'fecha_registro', width: 12 },
        { header: 'Estructura', key: 'waypoint', width: 15 },
        { header: 'Ciudad', key: 'ciudad', width: 15 },
        { header: 'Barrio', key: 'barrio', width: 20 },
        { header: 'Dirección', key: 'direccion_completa', width: 30 },
        { header: 'Tipo', key: 'tipo', width: 12 },
        { header: 'Material', key: 'material', width: 15 },
        { header: 'Altura', key: 'altura', width: 10 },
        { header: 'Año Fab.', key: 'ano_fabricacion', width: 10 },
        { header: 'Templete', key: 'templete', width: 15 },
        { header: 'Estado Templete', key: 'estado_templete', width: 15 },
        { header: 'Estado Estructura', key: 'estado_estructura', width: 15 },
        { header: 'Desplomado', key: 'desplomado', width: 12 },
        { header: 'Flectado', key: 'flectado', width: 12 },
        { header: 'Fracturado', key: 'fracturado', width: 12 },
        { header: 'Hierro Base', key: 'hierro_base', width: 12 }
      ];
      
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      datos.forEach(row => {
        const fecha = row.fecha_registro ? new Date(row.fecha_registro).toLocaleDateString('es-CO') : '';
        worksheet.addRow({
          ...row,
          fecha_registro: fecha
        });
      });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_ESTRUCTURAS_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al exportar reporte de estructuras:', error);
      res.status(500).json({
        success: false,
        error: 'Error al exportar el reporte'
      });
    }
  },

  // ========== REPORTE DE PÉRDIDAS ==========
  getReportePerdidas: async (req, res) => {
    try {
      const datos = await reportesApi.getReportePerdidas(req.query);
      res.json({
        success: true,
        data: datos
      });
    } catch (error) {
      console.error('Error al obtener reporte de pérdidas:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el reporte'
      });
    }
  },

  exportarReportePerdidas: async (req, res) => {
    try {
      const datos = await reportesApi.getReportePerdidas(req.query);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Pérdidas');
      
      worksheet.columns = [
        { header: 'Fecha', key: 'fecha_registro', width: 12 },
        { header: 'Estructura', key: 'waypoint', width: 15 },
        { header: 'Ciudad', key: 'ciudad', width: 15 },
        { header: 'Barrio', key: 'barrio', width: 20 },
        { header: 'Dirección', key: 'direccion_completa', width: 30 },
        { header: 'Posible Fraude', key: 'posible_fraude', width: 15 }
      ];
      
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      datos.forEach(row => {
        const fecha = row.fecha_registro ? new Date(row.fecha_registro).toLocaleDateString('es-CO') : '';
        worksheet.addRow({
          ...row,
          fecha_registro: fecha
        });
      });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_PERDIDAS_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al exportar reporte de pérdidas:', error);
      res.status(500).json({
        success: false,
        error: 'Error al exportar el reporte'
      });
    }
  },

  // ========== REPORTE DE FACTIBILIDAD ==========
  getReporteFactibilidad: async (req, res) => {
    try {
      const datos = await reportesApi.getReporteFactibilidad(req.query);
      res.json({
        success: true,
        data: datos
      });
    } catch (error) {
      console.error('Error al obtener reporte de factibilidad:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el reporte'
      });
    }
  },

  exportarReporteFactibilidad: async (req, res) => {
    try {
      const datos = await reportesApi.getReporteFactibilidadCompleto(req.query);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Factibilidad');
      
      worksheet.columns = [
        { header: 'Fecha', key: 'created_at', width: 12 },
        { header: 'Código Poste', key: 'codigo_poste', width: 15 },
        { header: 'Ciudad', key: 'ciudad', width: 15 },
        { header: 'Barrio', key: 'barrio', width: 20 },
        { header: 'Dirección', key: 'direccion', width: 30 },
        { header: 'Operario', key: 'operario', width: 20 },
        { header: 'Proyecto', key: 'proyecto', width: 20 },
        { header: 'Tipo Poste', key: 'tipo_poste', width: 15 },
        { header: 'Altura Poste', key: 'altura_poste', width: 12 },
        { header: 'Coordenadas', key: 'coordenadas', width: 25 },
        { header: 'Observaciones', key: 'observaciones', width: 40 }
      ];
      
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      datos.forEach(row => {
        const fecha = row.created_at ? new Date(row.created_at).toLocaleDateString('es-CO') : '';
        worksheet.addRow({
          ...row,
          created_at: fecha
        });
      });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=Factibilidad_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al exportar reporte de factibilidad:', error);
      res.status(500).json({
        success: false,
        error: 'Error al exportar el reporte'
      });
    }
  }
};

module.exports = reportesController;
