// backend/routes/reportes.js
const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// ========================================
// ENDPOINTS PARA OBTENER DATOS DE REPORTES
// ========================================

// 1. Reporte de Inventario por Operador
router.get('/inventario-operador', reportesController.getInventarioOperador);

// 2. Reporte de Inventario por Inspector
router.get('/inventario-inspector', reportesController.getInventarioInspector);

// 3. Reporte de Redes
router.get('/redes', reportesController.getReporteRedes);

// 4. Reporte de Estructuras
router.get('/estructuras', reportesController.getReporteEstructuras);

// 5. Reporte de Poda
router.get('/poda', reportesController.getReportePoda);

// 6. Reporte de Factibilidad
router.get('/factibilidad', reportesController.getReporteFactibilidad);

// 7. Reporte de Pérdidas
router.get('/perdidas', reportesController.getReportePerdidas);

// ========================================
// ENDPOINTS PARA EXPORTAR REPORTES A EXCEL
// ========================================

// Exportar Inventario por Operador
router.get('/inventario-operador/exportar', reportesController.exportarInventarioOperador);

// Exportar Inventario por Inspector
router.get('/inventario-inspector/exportar', reportesController.exportarInventarioInspector);

// Exportar Reporte de Redes
router.get('/redes/exportar', reportesController.exportarReporteRedes);

// Exportar Reporte de Estructuras
router.get('/estructuras/exportar', reportesController.exportarReporteEstructuras);

// Exportar Reporte de Poda
router.get('/poda/exportar', reportesController.exportarReportePoda);

// Exportar Reporte de Factibilidad
router.get('/factibilidad/exportar', reportesController.exportarReporteFactibilidad);

// Exportar Reporte de Pérdidas
router.get('/perdidas/exportar', reportesController.exportarReportePerdidas);

module.exports = router;
