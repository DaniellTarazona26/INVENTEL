import React from 'react'
import './ConfirmModal.css'

const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-icon">⚠️</div>
        <h3>Confirmar Acción</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Sí, salir
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
