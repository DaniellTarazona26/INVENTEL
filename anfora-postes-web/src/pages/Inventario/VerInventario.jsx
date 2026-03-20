import React, { useState, useEffect } from 'react'
import inventarioService from '../../services/inventarioService'
import inventarioOperadoresService from '../../services/inventarioOperadoresService'

const VerInventario = ({ setCurrentPage }) => {
  const inventarioId = localStorage.getItem('verInventarioId')
  const [inv, setInv] = useState(null)
  const [operadores, setOperadores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const resInv = await inventarioService.obtenerPorId(inventarioId)
        if (resInv.success) setInv(resInv.inventario)

        const resOps = await inventarioOperadoresService.obtenerPorInventario(inventarioId)
        if (resOps.success) setOperadores(resOps.operadores || [])
      } catch (e) {
        console.error('Error cargando inventario:', e)
      } finally {
        setLoading(false)
      }
    }
    if (inventarioId) cargar()
  }, [inventarioId])

  const campo = (label, valor) => (
    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
      <strong>{label}:</strong> {valor || '-'}
    </p>
  )

  const badge = (valor) => (
    <span style={{
      display: 'inline-block',
      padding: '0.15rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.8rem',
      backgroundColor: valor === 'SI' ? '#d1fae5' : '#f3f4f6',
      color: valor === 'SI' ? '#065f46' : '#6b7280',
      border: `1px solid ${valor === 'SI' ? '#6ee7b7' : '#d1d5db'}`
    }}>
      {valor || '-'}
    </span>
  )

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  )

  if (!inv) return (
    <div className="mensaje mensaje-error">No se encontró el inventario.</div>
  )

  return (
    <div style={{ maxWidth: '100%', padding: '0' }}>

      {/* HEADER */}
      <div className="header-section">
        <h2 className="page-title">👁️ VER INVENTARIO</h2>
        <button
          className="btn-nuevo-top"
          onClick={() => {
            localStorage.removeItem('verInventarioId')
            setCurrentPage('inventario')
          }}
        >
          ← Volver al listado
        </button>
      </div>

      {/* TARJETA IDENTIFICACIÓN */}
      <section className="form-section collapsible completo" style={{ marginBottom: '0.5rem' }}>
        <h3 className="section-title">📍 IDENTIFICACIÓN</h3>
        <div className="section-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem 1.5rem' }}>
            {campo('WayPoint', inv.waypoint)}
            {campo('Código estructura', inv.codigo_estructura)}
            {campo('Consecutivo poste', inv.consecutivo_poste)}
            {campo('Dirección', inv.direccion_completa)}
            {campo('Barrio', inv.barrio)}
            {campo('Fecha registro', inv.fecha_registro
              ? new Date(inv.fecha_registro).toLocaleDateString('es-CO')
              : null)}
          </div>
        </div>
      </section>

      {/* TARJETA ESTRUCTURA */}
      <section className="form-section collapsible completo" style={{ marginBottom: '0.5rem' }}>
        <h3 className="section-title">🏗️ ESTRUCTURA</h3>
        <div className="section-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem 1.5rem' }}>
            {campo('Tipo', inv.tipo)}
            {campo('Material', inv.material)}
            {campo('Altura', inv.altura)}
            {campo('Resistencia', inv.resistencia)}
            {campo('Uso por carga', inv.uso_carga)}
            {campo('Retenida', inv.retenida)}
            {campo('Estado estructura', inv.estado_estructura)}
            {campo('Propietario', inv.propietario)}
          </div>
        </div>
      </section>

      {/* TARJETA RED ELÉCTRICA */}
      <section className="form-section collapsible completo" style={{ marginBottom: '0.5rem' }}>
        <h3 className="section-title">⚡ RED ELÉCTRICA</h3>
        <div className="section-content">

          {/* BAJA */}
          <div className="subsection subsection-baja" style={{ marginBottom: '0.75rem' }}>
            <h4 className="subsection-title">BAJA</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem 1.5rem' }}>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Baja:</strong> {badge(inv.baja)}</p>
              {campo('Tipo cable', inv.baja_tipo_cable)}
              {campo('Estado red', inv.baja_estado_red)}
              {campo('Continuidad eléctrica', inv.baja_continuidad_electrica)}
              {campo('Caja 1', inv.caja1)}
              {campo('Caja 2', inv.caja2)}
            </div>
          </div>

          {/* MEDIA */}
          <div className="subsection subsection-media" style={{ marginBottom: '0.75rem' }}>
            <h4 className="subsection-title">MEDIA</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem 1.5rem' }}>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Media:</strong> {badge(inv.media)}</p>
              {campo('Transformador', inv.media_tipo_cable)}
              {campo('Macromedidor', inv.media_estado_red)}
              {campo('Fuga', inv.media_continuidad_electrica)}
              {campo('Corta Circuito', inv.caja3)}
              {campo('Seccionador', inv.caja4)}
            </div>
          </div>

          {/* ALUMBRADO */}
          <div className="subsection subsection-alumbrado">
            <h4 className="subsection-title">ALUMBRADO</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem 1.5rem' }}>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Alumbrado:</strong> {badge(inv.alumbrado)}</p>
              {campo('Tipo cable', inv.alumbrado_tipo_cable)}
              {campo('Estado red', inv.alumbrado_estado_red)}
              {campo('Continuidad eléctrica', inv.alumbrado_continuidad_electrica)}
            </div>
          </div>

        </div>
      </section>

      {/* TARJETA ESTADOS */}
      <section className="form-section collapsible completo" style={{ marginBottom: '0.5rem' }}>
        <h3 className="section-title">📊 ESTADOS</h3>
        <div className="section-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem 1.5rem' }}>
            {campo('Estado poste', inv.estado_poste)}
            {campo('Tierra eléctrica', inv.tierra_electrica)}
            {campo('Retenida estado', inv.retenida_estado)}
          </div>
        </div>
      </section>

      {/* TARJETAS DE OPERADORES */}
      {operadores.length > 0 && (
        <section className="form-section collapsible completo" style={{ marginBottom: '0.5rem' }}>
          <h3 className="section-title">📡 OPERADORES ({operadores.length})</h3>
          <div className="section-content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {operadores.map((op) => (
                <div key={op.operador_nombre} style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '1rem',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}>
                  <h4 style={{
                    margin: '0 0 0.75rem 0',
                    color: '#1e40af',
                    borderBottom: '2px solid #3b82f6',
                    paddingBottom: '0.5rem',
                    fontSize: '0.95rem'
                  }}>
                    📡 {op.operador_nombre}
                  </h4>

                  <div style={{ fontSize: '0.88rem', lineHeight: '1.7' }}>
                    <p style={{ margin: '0.2rem 0' }}><strong>Herrajes:</strong> {op.herrajes ?? '-'} &nbsp;|&nbsp; <strong>Coaxial:</strong> {op.coaxial ?? '-'} &nbsp;|&nbsp; <strong>Fibra:</strong> {op.fibra_optica ?? '-'}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>UTP:</strong> {op.utp ?? '-'} &nbsp;|&nbsp; <strong>Telefónico:</strong> {op.telefonico ?? '-'} &nbsp;|&nbsp; <strong>Guaya:</strong> {op.guaya ?? '-'}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>Marquilla:</strong> {op.marquilla || '-'} &nbsp;|&nbsp; <strong>Cruce en vía:</strong> {op.cruce_via === '1' ? 'SÍ' : op.cruce_via === '0' ? 'NO' : '-'}</p>

                    {/* Activos */}
                    {(op.activo_amplificador || op.activo_nodo_optico || op.activo_fuente_poder ||
                      op.activo_amplificador_110v || op.activo_nodo_optico_110v ||
                      op.activo_fuente_poder_110v || op.activo_switch_110v) && (
                      <p style={{ margin: '0.2rem 0' }}>
                        <strong>Activos:</strong>{' '}
                        {[
                          op.activo_amplificador && 'Amplificador',
                          op.activo_nodo_optico && 'Nodo Óptico',
                          op.activo_fuente_poder && 'Fuente Poder',
                          op.activo_amplificador_110v && 'Amplificador 110v',
                          op.activo_nodo_optico_110v && 'Nodo Óptico 110v',
                          op.activo_fuente_poder_110v && 'Fuente 110v',
                          op.activo_switch_110v && 'Switch 110v',
                        ].filter(Boolean).join(', ')}
                      </p>
                    )}

                    {/* Pasivos */}
                    {(op.pasivo_caja_nap || op.pasivo_caja_empalme || op.pasivo_reserva || op.pasivo_bajante) && (
                      <p style={{ margin: '0.2rem 0' }}>
                        <strong>Pasivos:</strong>{' '}
                        {[
                          op.pasivo_caja_nap && 'Caja NAP',
                          op.pasivo_caja_empalme && 'Caja Empalme',
                          op.pasivo_reserva && 'Reserva',
                          op.pasivo_bajante && 'Bajante',
                        ].filter(Boolean).join(', ')}
                      </p>
                    )}

                    {/* Observaciones */}
                    {op.observaciones && (
                      <p style={{ margin: '0.2rem 0', fontStyle: 'italic', color: '#6b7280' }}>
                        💬 {op.observaciones}
                      </p>
                    )}
                    {Array.isArray(op.observaciones_checkboxes) && op.observaciones_checkboxes.length > 0 && (
                      <p style={{ margin: '0.2rem 0', color: '#6b7280', fontSize: '0.82rem' }}>
                        🏷️ {op.observaciones_checkboxes.join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {operadores.length === 0 && (
        <div className="mensaje mensaje-info">
          ℹ️ Este inventario no tiene operadores registrados.
        </div>
      )}

      {/* BOTÓN VOLVER */}
      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button
          className="btn-limpiar"
          onClick={() => {
            localStorage.removeItem('verInventarioId')
            setCurrentPage('inventario')
          }}
        >
          ← Volver al listado
        </button>
      </div>

    </div>
  )
}

export default VerInventario
