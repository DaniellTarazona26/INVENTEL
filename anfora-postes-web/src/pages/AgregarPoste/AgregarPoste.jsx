import React, { useState, useEffect } from 'react'
import './AgregarPoste.css'
import inventarioService from '../../services/inventarioService'
import ciudadesService from '../../services/ciudadesService'
import operadoresService from '../../services/operadoresService'
import empresasService from '../../services/empresasService'

const AgregarPoste = ({ setCurrentPage }) => {
  
  const inventarioIdEditar = localStorage.getItem('editarInventarioId')

  const [ciudades, setCiudades] = useState([])
  const [barrios, setBarrios] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [operadores, setOperadores] = useState([])

  const [seccionesAbiertas, setSeccionesAbiertas] = useState({
    ubicacion: true,
    estructura: false,
    tipoRed: false,
    estadoEstructura: false,
    estados: false,
    operadores: false
  })

  const [formData, setFormData] = useState({
    ciudadId: '',
    empresaId: '',
    barrio: '',
    direccion1: '',
    direccion2: '',
    direccion3: '',
    direccion4: '',
    waypoint: '',
    tipo: '',
    marcada: '',
    codigoEstructura: '',
    consecutivoPoste: '',
    material: '',
    cRotura: '',
    templete: '',  
    estadoTemplete: '',
    altura: '',
    anoFabricacion: '',
    bajantesElectricos: '',  
    baja: '',  
    bajaTipoCable: '',
    bajaEstado: '',
    bajaContinuidad: '',
    caja1: '',
    caja2: '',
    alumbrado: '',  
    alumbradoTipoCable: '',
    alumbradoEstado: '',
    lampara1Tipo: '',
    lampara1ExisteCodigo: '',
    lampara1Codigo: '',
    lampara1Danada: '',
    lampara1Encendida: '',
    lampara2Tipo: '',
    lampara2ExisteCodigo: '',
    lampara2Codigo: '',
    lampara2Danada: '',
    lampara2Encendida: '',
    tierraElectrica: '',  
    tierraEstado: '',
    tierraSuelta: '',
    tierraDesconectada: '',
    tierraRota: '',
    elementosAdicionales: 'NO APLICA',  
    lampara: '',
    camaraTv: '',
    corneta: '',
    aviso: '',
    cajaMetalica: '',
    otro: '',
    posibleFraude: '',
    estadoEstructura: '',
    desplomado: '',
    flectado: '',
    fracturado: '',
    hierroBase: '',
    podaArboles: ''
  })

  const [operadoresSeleccionados, setOperadoresSeleccionados] = useState([])
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [modoEdicion, setModoEdicion] = useState(false)
  const [allowNavigation, setAllowNavigation] = useState(false)

  useEffect(() => {
    cargarCiudades()
    cargarEmpresas()
    cargarOperadores()
  }, [])

  useEffect(() => {
    if (formData.ciudadId) {
      cargarBarrios(formData.ciudadId)
    } else {
      setBarrios([])
      setFormData(prev => ({ ...prev, barrio: '' }))
    }
  }, [formData.ciudadId])

  useEffect(() => {
    if (inventarioIdEditar) {
      cargarInventario(inventarioIdEditar)
    }
  }, [inventarioIdEditar])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (modoEdicion && !allowNavigation) {
        e.preventDefault()
        e.returnValue = '¿Estás seguro de que quieres salir? Los cambios en edición se perderán.'
        return e.returnValue
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [modoEdicion, allowNavigation])

  const cargarCiudades = async () => {
    try {
      const response = await ciudadesService.obtenerTodas()
      setCiudades(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error('Error cargando ciudades:', error)
      setCiudades([])
      mostrarMensaje('error', 'Error al cargar las ciudades')
    }
  }

  const cargarBarrios = async (ciudadId) => {
    try {
      const response = await ciudadesService.obtenerBarrios(ciudadId)
      setBarrios(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error('Error cargando barrios:', error)
      setBarrios([])
      mostrarMensaje('error', 'Error al cargar los barrios')
    }
  }

  const cargarEmpresas = async () => {
    try {
      const response = await empresasService.obtenerTodas()
      const listaEmpresas = response.empresas || response
      setEmpresas(Array.isArray(listaEmpresas) ? listaEmpresas : [])
    } catch (error) {
      console.error('Error cargando empresas:', error)
      setEmpresas([])
      mostrarMensaje('error', 'Error al cargar las empresas')
    }
  }

  const cargarOperadores = async () => {
    try {
      const response = await operadoresService.obtenerTodos()
      const listaOperadores = response.operadores || response
      const nombresOperadores = listaOperadores.map(op => op.nombre)
      setOperadores(nombresOperadores)
    } catch (error) {
      console.error('Error cargando operadores:', error)
      setOperadores([])
    }
  }

  const cargarInventario = async (inventarioId) => {
    try {
      setLoading(true)
      const response = await inventarioService.obtenerPorId(inventarioId)
      
      if (response.success) {
        const inv = response.inventario

        let empresaIdDelInventario = inv.empresa_id || ''
        
        setFormData({
          ciudadId: inv.ciudad_id || '',
          empresaId: empresaIdDelInventario,
          barrio: inv.barrio_id || '',
          direccion1: inv.direccion_campo1 || '',
          direccion2: inv.direccion_campo2 || '',
          direccion3: inv.direccion_campo3 || '',
          direccion4: inv.direccion_campo4 || '',
          waypoint: inv.waypoint || '',
          tipo: inv.tipo || '',
          marcada: inv.marcada || '',
          codigoEstructura: inv.codigo_estructura || '',
          consecutivoPoste: inv.consecutivo_poste || '',
          material: inv.material || '',
          cRotura: inv.carga_rotura || '',
          templete: inv.templete || '',
          estadoTemplete: inv.estado_templete || '',
          altura: inv.altura || '',
          anoFabricacion: inv.ano_fabricacion || '',
          bajantesElectricos: inv.bajantes_electricos || '',
          baja: inv.baja || '',
          bajaTipoCable: inv.baja_tipo_cable || '',
          bajaEstado: inv.baja_estado_red || '',
          bajaContinuidad: inv.baja_continuidad_electrica || '',
          caja1: inv.caja1 || '',
          caja2: inv.caja2 || '',
          alumbrado: inv.alumbrado || '',
          alumbradoTipoCable: inv.alumbrado_tipo_cable || '',
          alumbradoEstado: inv.alumbrado_estado_red || '',
          lampara1Tipo: inv.lampara1_tipo || '',
          lampara1ExisteCodigo: inv.lampara1_existe_codigo || '',
          lampara1Codigo: inv.lampara1_codigo || '',
          lampara1Danada: inv.lampara1_danada || '',
          lampara1Encendida: inv.lampara1_encendida || '',
          lampara2Tipo: inv.lampara2_tipo || '',
          lampara2ExisteCodigo: inv.lampara2_existe_codigo || '',
          lampara2Codigo: inv.lampara2_codigo || '',
          lampara2Danada: inv.lampara2_danada || '',
          lampara2Encendida: inv.lampara2_encendida || '',
          tierraElectrica: inv.tierra_electrica || '',
          tierraEstado: inv.tierra_estado || '',
          tierraSuelta: inv.tierra_suelta || '',
          tierraDesconectada: inv.tierra_desconectada || '',
          tierraRota: inv.tierra_rota || '',
          elementosAdicionales: inv.elementos_adicionales || 'NO APLICA',
          lampara: inv.lampara || '',
          camaraTv: inv.camara_tv || '',
          corneta: inv.corneta || '',
          aviso: inv.aviso || '',
          cajaMetalica: inv.caja_metalica || '',
          otro: inv.otro || '',
          posibleFraude: inv.posible_fraude || '',
          estadoEstructura: inv.estado_estructura || '',
          desplomado: inv.desplomado || '',
          flectado: inv.flectado || '',
          fracturado: inv.fracturado || '',
          hierroBase: inv.hierro_base || '',
          podaArboles: inv.poda_arboles || ''
        })
        
        if (inv.operadores && Array.isArray(inv.operadores)) {
          setOperadoresSeleccionados(inv.operadores)
        }
        
        setModoEdicion(true)
        mostrarMensaje('info', 'Inventario cargado para edición')
      }
    } catch (error) {
      console.error('Error cargando inventario:', error)
      mostrarMensaje('error', 'Error al cargar el inventario')
    } finally {
      setLoading(false)
    }
  }

  const getEstadoSeccion = (seccion) => {
    let campos = []
    
    switch(seccion) {
      case 'ubicacion':
        campos = ['ciudadId', 'barrio', 'waypoint', 'empresaId']
        break
        
      case 'estructura':
        campos = ['tipo', 'material', 'altura', 'anoFabricacion', 'templete', 'bajantesElectricos']
        break
        
      case 'tipoRed':
        const tipoRedPrincipales = ['baja', 'alumbrado', 'tierraElectrica']
        const todosRespondidos = tipoRedPrincipales.every(campo => formData[campo] !== '')
        
        if (!todosRespondidos) {
          const algunoRespondido = tipoRedPrincipales.some(campo => formData[campo] !== '')
          return algunoRespondido ? 'incompleto' : 'vacio'
        }
        
        let completo = true
        
        if (formData.baja === 'SI') {
          if (!formData.bajaTipoCable || !formData.bajaEstado || !formData.bajaContinuidad) {
            completo = false
          }
          if (!formData.caja1 || !formData.caja2) {
            completo = false
          }
        }
        
        if (formData.alumbrado === 'SI') {
          if (!formData.alumbradoTipoCable || !formData.alumbradoEstado) {
            completo = false
          }
          
          if (!formData.lampara1Tipo) {
            completo = false
          }
          
          if (formData.lampara1Tipo && formData.lampara1Tipo !== 'NO EXISTE') {
            if (!formData.lampara1ExisteCodigo || !formData.lampara1Danada || !formData.lampara1Encendida) {
              completo = false
            }
            if (formData.lampara1ExisteCodigo === 'SI' && !formData.lampara1Codigo) {
              completo = false
            }
          }
          
          if (formData.lampara2Tipo && formData.lampara2Tipo !== '' && formData.lampara2Tipo !== 'NO EXISTE') {
            if (!formData.lampara2ExisteCodigo || !formData.lampara2Danada || !formData.lampara2Encendida) {
              completo = false
            }
            if (formData.lampara2ExisteCodigo === 'SI' && !formData.lampara2Codigo) {
              completo = false
            }
          }
        }
        
        if (formData.tierraElectrica === 'SI') {
          if (!formData.tierraEstado) {
            completo = false
          }
          if (!formData.tierraSuelta || !formData.tierraDesconectada || !formData.tierraRota) {
            completo = false
          }
        }
        
        if (formData.elementosAdicionales === 'APLICA') {
          const camposElementos = [
            'lampara',
            'camaraTv',
            'corneta',
            'aviso',
            'cajaMetalica',
            'otro',
            'posibleFraude'
          ]
          
          const todosElementosLlenos = camposElementos.every(campo => formData[campo] !== '')
          if (!todosElementosLlenos) {
            completo = false
          }
        }
        
        return completo ? 'completo' : 'incompleto'
        
      case 'estadoEstructura':
        campos = ['estadoEstructura']
        break
        
      case 'estados':
        campos = ['podaArboles']
        break
        
      case 'operadores':
        return operadoresSeleccionados.length > 0 ? 'completo' : 'vacio'
    }
    
    const camposTocados = campos.some(campo => formData[campo] !== '')
    const camposCompletos = campos.every(campo => formData[campo] !== '')
    
    if (camposCompletos) return 'completo'
    if (camposTocados) return 'incompleto'
    return 'vacio'
  }

  const toggleSeccion = (seccion) => {
    setSeccionesAbiertas(prev => ({
      ...prev,
      [seccion]: !prev[seccion]
    }))
  }

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const toggleOperador = (operador) => {
    if (operadoresSeleccionados.includes(operador)) {
      setOperadoresSeleccionados(operadoresSeleccionados.filter(o => o !== operador))
    } else {
      setOperadoresSeleccionados([...operadoresSeleccionados, operador])
    }
  }

  const handleGuardarYContinuar = async () => {
    if (!formData.empresaId) {
      mostrarMensaje('error', '❌ La empresa es obligatoria')
      return
    }

    if (!formData.ciudadId) {
      mostrarMensaje('error', '❌ La ciudad es obligatoria')
      return
    }

    if (!formData.barrio) {
      mostrarMensaje('error', '❌ El barrio es obligatorio')
      return
    }

    if (!formData.waypoint) {
      mostrarMensaje('error', '❌ El WayPoint es obligatorio')
      return
    }

    if (!formData.tipo) {
      mostrarMensaje('error', '❌ El Tipo de estructura es obligatorio')
      return
    }

    if (!formData.material) {
      mostrarMensaje('error', '❌ El Material es obligatorio')
      return
    }

    if (!formData.altura) {
      mostrarMensaje('error', '❌ La Altura es obligatoria')
      return
    }

    if (!formData.anoFabricacion) {
      mostrarMensaje('error', '❌ El Año de fabricación es obligatorio')
      return
    }

    if (!formData.templete) {
      mostrarMensaje('error', '❌ El Templete es obligatorio')
      return
    }

    if (formData.templete !== 'NO EXISTE' && !formData.estadoTemplete) {
      mostrarMensaje('error', '❌ El Estado del templete es obligatorio')
      return
    }

    if (!formData.bajantesElectricos) {
      mostrarMensaje('error', '❌ Bajantes eléctricos es obligatorio')
      return
    }

    if (!formData.baja) {
      mostrarMensaje('error', '❌ El campo Baja es obligatorio')
      return
    }

    if (formData.baja === 'SI') {
      if (!formData.bajaTipoCable) {
        mostrarMensaje('error', '❌ Tipo de cable (Baja) es obligatorio')
        return
      }
      if (!formData.bajaEstado) {
        mostrarMensaje('error', '❌ Estado de la red (Baja) es obligatorio')
        return
      }
      if (!formData.bajaContinuidad) {
        mostrarMensaje('error', '❌ Continuidad eléctrica (Baja) es obligatoria')
        return
      }
      if (!formData.caja1) {
        mostrarMensaje('error', '❌ Caja #1 es obligatoria')
        return
      }
      if (!formData.caja2) {
        mostrarMensaje('error', '❌ Caja #2 es obligatoria')
        return
      }
    }

    if (!formData.alumbrado) {
      mostrarMensaje('error', '❌ El campo Alumbrado es obligatorio')
      return
    }

    if (formData.alumbrado === 'SI') {
      if (!formData.alumbradoTipoCable) {
        mostrarMensaje('error', '❌ Tipo de cable (Alumbrado) es obligatorio')
        return
      }
      if (!formData.alumbradoEstado) {
        mostrarMensaje('error', '❌ Estado de la red (Alumbrado) es obligatorio')
        return
      }
      if (!formData.lampara1Tipo) {
        mostrarMensaje('error', '❌ Tipo de lámpara #1 es obligatorio')
        return
      }
      
      if (formData.lampara1Tipo !== 'NO EXISTE') {
        if (!formData.lampara1ExisteCodigo) {
          mostrarMensaje('error', '❌ ¿Existe código? (Lámpara #1) es obligatorio')
          return
        }
        if (!formData.lampara1Danada) {
          mostrarMensaje('error', '❌ ¿Dañada? (Lámpara #1) es obligatorio')
          return
        }
        if (!formData.lampara1Encendida) {
          mostrarMensaje('error', '❌ ¿Encendida? (Lámpara #1) es obligatorio')
          return
        }
        if (formData.lampara1ExisteCodigo === 'SI' && !formData.lampara1Codigo) {
          mostrarMensaje('error', '❌ Código de lámpara #1 es obligatorio')
          return
        }
      }
      
      if (formData.lampara2Tipo && formData.lampara2Tipo !== 'NO EXISTE' && formData.lampara2Tipo !== '') {
        if (!formData.lampara2ExisteCodigo) {
          mostrarMensaje('error', '❌ ¿Existe código? (Lámpara #2) es obligatorio')
          return
        }
        if (!formData.lampara2Danada) {
          mostrarMensaje('error', '❌ ¿Dañada? (Lámpara #2) es obligatorio')
          return
        }
        if (!formData.lampara2Encendida) {
          mostrarMensaje('error', '❌ ¿Encendida? (Lámpara #2) es obligatorio')
          return
        }
        if (formData.lampara2ExisteCodigo === 'SI' && !formData.lampara2Codigo) {
          mostrarMensaje('error', '❌ Código de lámpara #2 es obligatorio')
          return
        }
      }
    }

    if (!formData.tierraElectrica) {
      mostrarMensaje('error', '❌ El campo Tierra Eléctrica es obligatorio')
      return
    }

    if (formData.tierraElectrica === 'SI') {
      if (!formData.tierraEstado) {
        mostrarMensaje('error', '❌ Estado de tierra es obligatorio')
        return
      }
      if (!formData.tierraSuelta) {
        mostrarMensaje('error', '❌ Tierra suelta es obligatorio')
        return
      }
      if (!formData.tierraDesconectada) {
        mostrarMensaje('error', '❌ Tierra desconectada es obligatorio')
        return
      }
      if (!formData.tierraRota) {
        mostrarMensaje('error', '❌ Tierra rota es obligatorio')
        return
      }
    }

    if (formData.elementosAdicionales === 'APLICA') {
      if (!formData.lampara) {
        mostrarMensaje('error', '❌ Lámpara (elementos adicionales) es obligatorio')
        return
      }
      if (!formData.camaraTv) {
        mostrarMensaje('error', '❌ Cámara TV es obligatorio')
        return
      }
      if (!formData.corneta) {
        mostrarMensaje('error', '❌ Corneta es obligatorio')
        return
      }
      if (!formData.aviso) {
        mostrarMensaje('error', '❌ Aviso es obligatorio')
        return
      }
      if (!formData.cajaMetalica) {
        mostrarMensaje('error', '❌ Caja metálica es obligatorio')
        return
      }
      if (!formData.otro) {
        mostrarMensaje('error', '❌ Otro es obligatorio')
        return
      }
      if (!formData.posibleFraude) {
        mostrarMensaje('error', '❌ Posible fraude es obligatorio')
        return
      }
    }

    if (!formData.estadoEstructura) {
      mostrarMensaje('error', '❌ Estado de estructura es obligatorio')
      return
    }

    if (formData.estadoEstructura === 'NO') {
      if (!formData.desplomado) {
        mostrarMensaje('error', '❌ Desplomado es obligatorio')
        return
      }
      if (!formData.flectado) {
        mostrarMensaje('error', '❌ Flectado es obligatorio')
        return
      }
      if (!formData.fracturado) {
        mostrarMensaje('error', '❌ Fracturado es obligatorio')
        return
      }
      if (!formData.hierroBase) {
        mostrarMensaje('error', '❌ Hierro en la base es obligatorio')
        return
      }
    }

    if (!formData.podaArboles) {
      mostrarMensaje('error', '❌ Poda de árboles es obligatorio')
      return
    }

    if (operadoresSeleccionados.length === 0) {
      mostrarMensaje('error', '❌ Debe seleccionar al menos un operador')
      return
    }

    try {
      setLoading(true)

      const datosEnviar = {
        ...formData,
        operadores: operadoresSeleccionados
      }

      const response = await inventarioService.crearParcial(datosEnviar)

      if (response.success) {
        localStorage.setItem('inventarioParcialId', response.inventario.id)
        localStorage.setItem('operadoresSeleccionados', JSON.stringify(operadoresSeleccionados))
        
        setAllowNavigation(true)
        setModoEdicion(false)
        
        mostrarMensaje('success', '✅ Datos guardados. Redirigiendo a operadores...')
        
        setTimeout(() => {
          setCurrentPage('agregar-operadores')
        }, 1500)
      }

    } catch (error) {
      console.error('Error guardando inventario:', error)
      const mensajeError = error.error || error.message || 'Error al guardar'
      mostrarMensaje('error', `❌ ${mensajeError}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGuardar = async () => {
    if (!formData.empresaId) {
      mostrarMensaje('error', '❌ La empresa es obligatoria')
      return
    }

    if (!formData.ciudadId) {
      mostrarMensaje('error', '❌ La ciudad es obligatoria')
      return
    }

    if (!formData.barrio) {
      mostrarMensaje('error', '❌ El barrio es obligatorio')
      return
    }

    if (!formData.waypoint) {
      mostrarMensaje('error', '❌ El WayPoint es obligatorio')
      return
    }

    if (!formData.tipo) {
      mostrarMensaje('error', '❌ El Tipo de estructura es obligatorio')
      return
    }

    if (!formData.material) {
      mostrarMensaje('error', '❌ El Material es obligatorio')
      return
    }

    if (!formData.altura) {
      mostrarMensaje('error', '❌ La Altura es obligatoria')
      return
    }

    if (!formData.anoFabricacion) {
      mostrarMensaje('error', '❌ El Año de fabricación es obligatorio')
      return
    }

    if (!formData.templete) {
      mostrarMensaje('error', '❌ El Templete es obligatorio')
      return
    }

    if (formData.templete !== 'NO EXISTE' && !formData.estadoTemplete) {
      mostrarMensaje('error', '❌ El Estado del templete es obligatorio')
      return
    }

    if (!formData.bajantesElectricos) {
      mostrarMensaje('error', '❌ Bajantes eléctricos es obligatorio')
      return
    }

    if (!formData.baja) {
      mostrarMensaje('error', '❌ El campo Baja es obligatorio')
      return
    }

    if (formData.baja === 'SI') {
      if (!formData.bajaTipoCable) {
        mostrarMensaje('error', '❌ Tipo de cable (Baja) es obligatorio')
        return
      }
      if (!formData.bajaEstado) {
        mostrarMensaje('error', '❌ Estado de la red (Baja) es obligatorio')
        return
      }
      if (!formData.bajaContinuidad) {
        mostrarMensaje('error', '❌ Continuidad eléctrica (Baja) es obligatoria')
        return
      }
      if (!formData.caja1) {
        mostrarMensaje('error', '❌ Caja #1 es obligatoria')
        return
      }
      if (!formData.caja2) {
        mostrarMensaje('error', '❌ Caja #2 es obligatoria')
        return
      }
    }

    if (!formData.alumbrado) {
      mostrarMensaje('error', '❌ El campo Alumbrado es obligatorio')
      return
    }

    if (formData.alumbrado === 'SI') {
      if (!formData.alumbradoTipoCable) {
        mostrarMensaje('error', '❌ Tipo de cable (Alumbrado) es obligatorio')
        return
      }
      if (!formData.alumbradoEstado) {
        mostrarMensaje('error', '❌ Estado de la red (Alumbrado) es obligatorio')
        return
      }
      if (!formData.lampara1Tipo) {
        mostrarMensaje('error', '❌ Tipo de lámpara #1 es obligatorio')
        return
      }
      
      if (formData.lampara1Tipo !== 'NO EXISTE') {
        if (!formData.lampara1ExisteCodigo) {
          mostrarMensaje('error', '❌ ¿Existe código? (Lámpara #1) es obligatorio')
          return
        }
        if (!formData.lampara1Danada) {
          mostrarMensaje('error', '❌ ¿Dañada? (Lámpara #1) es obligatorio')
          return
        }
        if (!formData.lampara1Encendida) {
          mostrarMensaje('error', '❌ ¿Encendida? (Lámpara #1) es obligatorio')
          return
        }
        if (formData.lampara1ExisteCodigo === 'SI' && !formData.lampara1Codigo) {
          mostrarMensaje('error', '❌ Código de lámpara #1 es obligatorio')
          return
        }
      }
      
      if (formData.lampara2Tipo && formData.lampara2Tipo !== 'NO EXISTE' && formData.lampara2Tipo !== '') {
        if (!formData.lampara2ExisteCodigo) {
          mostrarMensaje('error', '❌ ¿Existe código? (Lámpara #2) es obligatorio')
          return
        }
        if (!formData.lampara2Danada) {
          mostrarMensaje('error', '❌ ¿Dañada? (Lámpara #2) es obligatorio')
          return
        }
        if (!formData.lampara2Encendida) {
          mostrarMensaje('error', '❌ ¿Encendida? (Lámpara #2) es obligatorio')
          return
        }
        if (formData.lampara2ExisteCodigo === 'SI' && !formData.lampara2Codigo) {
          mostrarMensaje('error', '❌ Código de lámpara #2 es obligatorio')
          return
        }
      }
    }

    if (!formData.tierraElectrica) {
      mostrarMensaje('error', '❌ El campo Tierra Eléctrica es obligatorio')
      return
    }

    if (formData.tierraElectrica === 'SI') {
      if (!formData.tierraEstado) {
        mostrarMensaje('error', '❌ Estado de tierra es obligatorio')
        return
      }
      if (!formData.tierraSuelta) {
        mostrarMensaje('error', '❌ Tierra suelta es obligatorio')
        return
      }
      if (!formData.tierraDesconectada) {
        mostrarMensaje('error', '❌ Tierra desconectada es obligatorio')
        return
      }
      if (!formData.tierraRota) {
        mostrarMensaje('error', '❌ Tierra rota es obligatorio')
        return
      }
    }

    if (formData.elementosAdicionales === 'APLICA') {
      if (!formData.lampara) {
        mostrarMensaje('error', '❌ Lámpara (elementos adicionales) es obligatorio')
        return
      }
      if (!formData.camaraTv) {
        mostrarMensaje('error', '❌ Cámara TV es obligatorio')
        return
      }
      if (!formData.corneta) {
        mostrarMensaje('error', '❌ Corneta es obligatorio')
        return
      }
      if (!formData.aviso) {
        mostrarMensaje('error', '❌ Aviso es obligatorio')
        return
      }
      if (!formData.cajaMetalica) {
        mostrarMensaje('error', '❌ Caja metálica es obligatorio')
        return
      }
      if (!formData.otro) {
        mostrarMensaje('error', '❌ Otro es obligatorio')
        return
      }
      if (!formData.posibleFraude) {
        mostrarMensaje('error', '❌ Posible fraude es obligatorio')
        return
      }
    }

    if (!formData.estadoEstructura) {
      mostrarMensaje('error', '❌ Estado de estructura es obligatorio')
      return
    }

    if (formData.estadoEstructura === 'NO') {
      if (!formData.desplomado) {
        mostrarMensaje('error', '❌ Desplomado es obligatorio')
        return
      }
      if (!formData.flectado) {
        mostrarMensaje('error', '❌ Flectado es obligatorio')
        return
      }
      if (!formData.fracturado) {
        mostrarMensaje('error', '❌ Fracturado es obligatorio')
        return
      }
      if (!formData.hierroBase) {
        mostrarMensaje('error', '❌ Hierro en la base es obligatorio')
        return
      }
    }

    if (!formData.podaArboles) {
      mostrarMensaje('error', '❌ Poda de árboles es obligatorio')
      return
    }

    if (operadoresSeleccionados.length === 0) {
      mostrarMensaje('error', '❌ Debe seleccionar al menos un operador')
      return
    }

    try {
      setLoading(true)

      const datosEnviar = {
        ...formData,
        operadores: operadoresSeleccionados
      }

      let response

      if (modoEdicion && inventarioIdEditar) {
        response = await inventarioService.actualizar(inventarioIdEditar, datosEnviar)
        mostrarMensaje('success', '✅ Inventario actualizado exitosamente')
      } else {
        response = await inventarioService.crear(datosEnviar)
        mostrarMensaje('success', '✅ Inventario creado exitosamente')
      }

      setTimeout(() => {
        localStorage.removeItem('editarInventarioId')
        setModoEdicion(false)
        if (setCurrentPage) setCurrentPage('inventario')
      }, 2000)

    } catch (error) {
      console.error('Error guardando inventario:', error)
      const mensajeError = error.error || error.message || 'Error al guardar el inventario'
      mostrarMensaje('error', `❌ ${mensajeError}`)
    } finally {
      setLoading(false)
    }
  }

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => {
      setMensaje({ tipo: '', texto: '' })
    }, 5000)
  }

  const handleLimpiar = () => {
    if (window.confirm('¿Está seguro de que desea limpiar todo el formulario?')) {
      setFormData({
        ciudadId: '',
        empresaId: '',
        barrio: '',
        direccion1: '',
        direccion2: '',
        direccion3: '',
        direccion4: '',
        waypoint: '',
        tipo: '',
        marcada: '',
        codigoEstructura: '',
        consecutivoPoste: '',
        material: '',
        cRotura: '',
        templete: '',
        estadoTemplete: '',
        altura: '',
        anoFabricacion: '',
        bajantesElectricos: '',
        baja: '',
        bajaTipoCable: '',
        bajaEstado: '',
        bajaContinuidad: '',
        caja1: '',
        caja2: '',
        alumbrado: '',
        alumbradoTipoCable: '',
        alumbradoEstado: '',
        lampara1Tipo: '',
        lampara1ExisteCodigo: '',
        lampara1Codigo: '',
        lampara1Danada: '',
        lampara1Encendida: '',
        lampara2Tipo: '',
        lampara2ExisteCodigo: '',
        lampara2Codigo: '',
        lampara2Danada: '',
        lampara2Encendida: '',
        tierraElectrica: '',
        tierraEstado: '',
        tierraSuelta: '',
        tierraDesconectada: '',
        tierraRota: '',
        elementosAdicionales: 'NO APLICA',
        lampara: '',
        camaraTv: '',
        corneta: '',
        aviso: '',
        cajaMetalica: '',
        otro: '',
        posibleFraude: '',
        estadoEstructura: '',
        desplomado: '',
        flectado: '',
        fracturado: '',
        hierroBase: '',
        podaArboles: ''
      })
      setOperadoresSeleccionados([])
    }
  }

  const handleCancelarEdicion = () => {
    if (window.confirm('⚠️ ¿Desea cancelar la edición y crear un nuevo registro?\n\nLos cambios no guardados se perderán.')) {
      localStorage.removeItem('editarInventarioId')
      setModoEdicion(false)
      
      setFormData({
        ciudadId: '',
        empresaId: '',
        barrio: '',
        direccion1: '',
        direccion2: '',
        direccion3: '',
        direccion4: '',
        waypoint: '',
        tipo: '',
        marcada: '',
        codigoEstructura: '',
        consecutivoPoste: '',
        material: '',
        cRotura: '',
        templete: '',
        estadoTemplete: '',
        altura: '',
        anoFabricacion: '',
        bajantesElectricos: '',
        baja: '',
        bajaTipoCable: '',
        bajaEstado: '',
        bajaContinuidad: '',
        caja1: '',
        caja2: '',
        alumbrado: '',
        alumbradoTipoCable: '',
        alumbradoEstado: '',
        lampara1Tipo: '',
        lampara1ExisteCodigo: '',
        lampara1Codigo: '',
        lampara1Danada: '',
        lampara1Encendida: '',
        lampara2Tipo: '',
        lampara2ExisteCodigo: '',
        lampara2Codigo: '',
        lampara2Danada: '',
        lampara2Encendida: '',
        tierraElectrica: '',
        tierraEstado: '',
        tierraSuelta: '',
        tierraDesconectada: '',
        tierraRota: '',
        elementosAdicionales: 'NO APLICA',
        lampara: '',
        camaraTv: '',
        corneta: '',
        aviso: '',
        cajaMetalica: '',
        otro: '',
        posibleFraude: '',
        estadoEstructura: '',
        desplomado: '',
        flectado: '',
        fracturado: '',
        hierroBase: '',
        podaArboles: ''
      })
      setOperadoresSeleccionados([])
      
      mostrarMensaje('info', '✅ Modo edición cancelado. Ahora puedes crear un nuevo registro.')
    }
  }

  return (
    <div className="agregar-poste-page">
      <div className="header-section">
        <h2 className="page-title">
          {modoEdicion ? '✏️ EDITAR INVENTARIO' : '📝 AGREGAR INVENTARIO'}
        </h2>
        
        {modoEdicion && (
          <button 
            className="btn-nuevo-top" 
            onClick={handleCancelarEdicion}
            disabled={loading}
          >
            ➕ Nuevo Registro
          </button>
        )}
      </div>

      {mensaje.texto && (
        <div className={`mensaje mensaje-${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Guardando inventario...</p>
        </div>
      )}

      <section className={`form-section collapsible ${getEstadoSeccion('ubicacion')}`}>
        <h3 
          className="section-title clickable" 
          onClick={() => toggleSeccion('ubicacion')}
        >
          <span className={`arrow ${seccionesAbiertas.ubicacion ? 'open' : ''}`}>▶</span>
          1. UBICACIÓN
          <span className="status-indicator"></span>
        </h3>
        
        {seccionesAbiertas.ubicacion && (
          <div className="section-content">
            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label>Ciudad: *</label>
                <select 
                  value={formData.ciudadId}
                  onChange={(e) => handleInputChange('ciudadId', e.target.value)}
                >
                  <option value="">Seleccione ciudad</option>
                  {ciudades.map(ciudad => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Empresa: *</label>
                <select 
                  value={formData.empresaId}
                  onChange={(e) => handleInputChange('empresaId', e.target.value)}
                >
                  <option value="">Seleccione Empresa</option>
                  {empresas.map(empresa => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid form-grid-2">
              <div className="form-group">
                <label>Barrio: *</label>
                <select 
                  value={formData.barrio}
                  onChange={(e) => handleInputChange('barrio', e.target.value)}
                  disabled={!formData.ciudadId}
                >
                  <option value="">
                    {!formData.ciudadId ? 'Primero seleccione una ciudad' : 'Seleccione barrio'}
                  </option>
                  {barrios.map(barrio => (
                    <option key={barrio.id} value={barrio.id}>
                      {barrio.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid form-grid-direccion-completa">
              <div className="form-group">
                <label>C / A / D / K / Lo / Mz / T:</label>
                <select 
                  value={formData.direccion1}
                  onChange={(e) => handleInputChange('direccion1', e.target.value)}
                >
                  <option value=""></option>
                  <option value="C">C</option>
                  <option value="A">A</option>
                  <option value="D">D</option>
                  <option value="K">K</option>
                  <option value="Lo">Lo</option>
                  <option value="Mz">Mz</option>
                  <option value="T">T</option>
                </select>
              </div>

              <div className="form-group">
                <label>Número / Letra:</label>
                <input 
                  type="text" 
                  value={formData.direccion2}
                  onChange={(e) => handleInputChange('direccion2', e.target.value)}
                  placeholder="Ej: 45"
                />
              </div>

              <div className="form-group">
                <label># / A / Bis / Lo / Cs:</label>
                <select 
                  value={formData.direccion3}
                  onChange={(e) => handleInputChange('direccion3', e.target.value)}
                >
                  <option value=""></option>
                  <option value="#">#</option>
                  <option value="A">A</option>
                  <option value="Bis">Bis</option>
                  <option value="Lo">Lo</option>
                  <option value="Cs">Cs</option>
                </select>
              </div>

              <div className="form-group">
                <label>Número / Letra:</label>
                <input 
                  type="text" 
                  value={formData.direccion4}
                  onChange={(e) => handleInputChange('direccion4', e.target.value)}
                  placeholder="Ej: 32-15"
                />
              </div>
            </div>

            <div className="form-grid form-grid-1">
              <div className="form-group">
                <label>Dirección Completa:</label>
                <input 
                  type="text" 
                  className="direccion-completa-display"
                  value={`${formData.direccion1} ${formData.direccion2} ${formData.direccion3} ${formData.direccion4}`.trim()}
                  readOnly
                  disabled
                />
              </div>
            </div>
            
            <div className="form-grid form-grid-1">
              <div className="form-group">
                <label>WayPoint: *</label>
                <input 
                  type="text" 
                  placeholder="Obligatorio"
                  value={formData.waypoint}
                  onChange={(e) => handleInputChange('waypoint', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <section className={`form-section collapsible ${getEstadoSeccion('estructura')}`}>
        <h3 
          className="section-title clickable" 
          onClick={() => toggleSeccion('estructura')}
        >
          <span className={`arrow ${seccionesAbiertas.estructura ? 'open' : ''}`}>▶</span>
          2. ESTRUCTURA
          <span className="status-indicator"></span>
        </h3>
        
        {seccionesAbiertas.estructura && (
          <div className="section-content">
            <div className="form-grid form-grid-4">
              <div className="form-group">
                <label>Tipo: *</label>
                <select 
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                >
                  <option value=""></option>
                  <option value="SENCILLA">SENCILLA</option>
                  <option value="DOBLE">DOBLE</option>
                </select>
              </div>

              <div className="form-group">
                <label>Marcada:</label>
                <select 
                  value={formData.marcada}
                  onChange={(e) => handleInputChange('marcada', e.target.value)}
                >
                  <option value=""></option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>

              <div className="form-group">
                <label>Código estructura:</label>
                <input 
                  type="text" 
                  placeholder="Ej: 123456"
                  value={formData.codigoEstructura}
                  onChange={(e) => handleInputChange('codigoEstructura', e.target.value)}
                  disabled={formData.marcada !== 'SI'}
                />
              </div>

              <div className="form-group">
                <label>Consecutivo poste:</label>
                <input 
                  type="text" 
                  placeholder="Ej: 123456"
                  value={formData.consecutivoPoste}
                  onChange={(e) => handleInputChange('consecutivoPoste', e.target.value)}
                  disabled={formData.marcada !== 'SI'}
                />
              </div>
            </div>

            <div className="form-grid form-grid-4">
              <div className="form-group">
                <label>Material: *</label>
                <select 
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                >
                  <option value=""></option>
                  <option value="CONCRETO">CONCRETO</option>
                  <option value="MADERA">MADERA</option>
                  <option value="METALICO">METÁLICO</option>
                  <option value="FIBRA DE VIDRIO">FIBRA DE VIDRIO</option>
                  <option value="TUBULAR">TUBULAR</option>
                  <option value="OTRO">OTRO</option>
                  <option value="PVC">PVC</option>
                </select>
              </div>

              <div className="form-group">
                <label>C. de Rotura:</label>
                <select 
                  value={formData.cRotura}
                  onChange={(e) => handleInputChange('cRotura', e.target.value)}
                >
                  <option value=""></option>
                  <option value="510">510</option>
                  <option value="750">750</option>
                  <option value="1050">1050</option>
                  <option value="1275">1275</option>
                  <option value="1500">1500</option>
                  <option value="1750">1750</option>
                  <option value="2550">2550</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>

              <div className="form-group">
                <label>Templete: *</label>
                <select 
                  value={formData.templete}
                  onChange={(e) => handleInputChange('templete', e.target.value)}
                >
                  <option value=""></option>
                  <option value="NO EXISTE">NO EXISTE</option>
                  <option value="ANCLAJE RIENDA">ANCLAJE RIENDA</option>
                  <option value="TORNAPUNTA">TORNAPUNTA</option>
                  <option value="PALO MUERTO">PALO MUERTO</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estado templete:</label>
                <select 
                  value={formData.estadoTemplete}
                  onChange={(e) => handleInputChange('estadoTemplete', e.target.value)}
                  disabled={formData.templete === 'NO EXISTE' || !formData.templete}
                >
                  <option value=""></option>
                  <option value="BUENO">BUENO</option>
                  <option value="REGULAR">REGULAR</option>
                  <option value="MALO">MALO</option>
                </select>
              </div>
            </div>

            <div className="form-grid form-grid-4">
              <div className="form-group">
                <label>Altura: *</label>
                <select 
                  value={formData.altura}
                  onChange={(e) => handleInputChange('altura', e.target.value)}
                >
                  <option value=""></option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="18">18</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>

              <div className="form-group">
                <label>Año fabricación: *</label>
                <input 
                  type="text" 
                  placeholder="Ej: 2020"
                  value={formData.anoFabricacion}
                  onChange={(e) => handleInputChange('anoFabricacion', e.target.value)}
                  maxLength="4"
                />
              </div>

              <div className="form-group">
                <label>Bajantes Eléctricos: *</label>
                <select 
                  value={formData.bajantesElectricos}
                  onChange={(e) => handleInputChange('bajantesElectricos', e.target.value)}
                >
                  <option value=""></option>
                  <option value="NO">NO</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="form-group"></div>
            </div>
          </div>
        )}
      </section>

      <section className={`form-section collapsible ${getEstadoSeccion('tipoRed')}`}>
        <h3 
          className="section-title clickable" 
          onClick={() => toggleSeccion('tipoRed')}
        >
          <span className={`arrow ${seccionesAbiertas.tipoRed ? 'open' : ''}`}>▶</span>
          3. TIPO DE RED
          <span className="status-indicator"></span>
        </h3>
        
        {seccionesAbiertas.tipoRed && (
          <div className="section-content">
            
            <div className="subsection subsection-baja">
              <h4 className="subsection-title">BAJA</h4>
              <div className="form-grid form-grid-4">
                <div className="form-group">
                  <label>Baja: *</label>
                  <select 
                    value={formData.baja}
                    onChange={(e) => handleInputChange('baja', e.target.value)}
                  >
                    <option value=""></option>
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tipo cable:</label>
                  <select 
                    value={formData.bajaTipoCable}
                    onChange={(e) => handleInputChange('bajaTipoCable', e.target.value)}
                    disabled={formData.baja !== 'SI'}
                  >
                    <option value=""></option>
                    <option value="DUPLEX">DUPLEX</option>
                    <option value="TRIPLEX">TRIPLEX</option>
                    <option value="CUADRUPLEX">CUADRUPLEX</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Estado de la red:</label>
                  <select 
                    value={formData.bajaEstado}
                    onChange={(e) => handleInputChange('bajaEstado', e.target.value)}
                    disabled={formData.baja !== 'SI'}
                  >
                    <option value=""></option>
                    <option value="BUENO">BUENO</option>
                    <option value="REGULAR">REGULAR</option>
                    <option value="MALO">MALO</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Continuidad eléctrica:</label>
                  <select 
                    value={formData.bajaContinuidad}
                    onChange={(e) => handleInputChange('bajaContinuidad', e.target.value)}
                    disabled={formData.baja !== 'SI'}
                  >
                    <option value=""></option>
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>

              {formData.baja === 'SI' && (
                <div className="subsection-inner">
                  <h5 className="subsection-subtitle">CAJAS DISTRIBUCIÓN ELÉCTRICA</h5>
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label>Caja #1:</label>
                      <select 
                        value={formData.caja1}
                        onChange={(e) => handleInputChange('caja1', e.target.value)}
                      >
                        <option value=""></option>
                        <option value="NO EXISTE">NO EXISTE</option>
                        <option value="BUENA">BUENA</option>
                        <option value="ABIERTA">ABIERTA</option>
                        <option value="SIN TAPA">SIN TAPA</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Caja #2:</label>
                      <select 
                        value={formData.caja2}
                        onChange={(e) => handleInputChange('caja2', e.target.value)}
                      >
                        <option value=""></option>
                        <option value="NO EXISTE">NO EXISTE</option>
                        <option value="BUENA">BUENA</option>
                        <option value="ABIERTA">ABIERTA</option>
                        <option value="SIN TAPA">SIN TAPA</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="subsection subsection-alumbrado">
              <h4 className="subsection-title">ALUMBRADO</h4>
              <div className="form-grid form-grid-3">
                <div className="form-group">
                  <label>Alumbrado: *</label>
                  <select 
                    value={formData.alumbrado}
                    onChange={(e) => handleInputChange('alumbrado', e.target.value)}
                  >
                    <option value=""></option>
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tipo cable:</label>
                  <select 
                    value={formData.alumbradoTipoCable}
                    onChange={(e) => handleInputChange('alumbradoTipoCable', e.target.value)}
                    disabled={formData.alumbrado !== 'SI'}
                  >
                    <option value=""></option>
                    <option value="DUPLEX">DUPLEX</option>
                    <option value="TRIPLEX">TRIPLEX</option>
                    <option value="CUADRUPLEX">CUADRUPLEX</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Estado de la red:</label>
                  <select 
                    value={formData.alumbradoEstado}
                    onChange={(e) => handleInputChange('alumbradoEstado', e.target.value)}
                    disabled={formData.alumbrado !== 'SI'}
                  >
                    <option value=""></option>
                    <option value="BUENO">BUENO</option>
                    <option value="REGULAR">REGULAR</option>
                    <option value="MALO">MALO</option>
                  </select>
                </div>
              </div>

              {formData.alumbrado === 'SI' && (
                <div className="subsection-inner">
                  <h5 className="subsection-subtitle">LÁMPARA #1</h5>
                  <div className="form-grid form-grid-5">
                    <div className="form-group">
                      <label>Tipo:</label>
                      <select 
                        value={formData.lampara1Tipo}
                        onChange={(e) => handleInputChange('lampara1Tipo', e.target.value)}
                      >
                        <option value=""></option>
                        <option value="NO EXISTE">NO EXISTE</option>
                        <option value="LED">LED</option>
                        <option value="SODIO">SODIO</option>
                        <option value="MERCURIO">MERCURIO</option>
                        <option value="OTRO">OTRO</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>¿Existe código?:</label>
                      <select 
                        value={formData.lampara1ExisteCodigo}
                        onChange={(e) => handleInputChange('lampara1ExisteCodigo', e.target.value)}
                        disabled={formData.lampara1Tipo === 'NO EXISTE' || !formData.lampara1Tipo}
                      >
                        <option value=""></option>
                        <option value="NO">NO</option>
                        <option value="SI">SI</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Código:</label>
                      <input 
                        type="text" 
                        value={formData.lampara1Codigo}
                        onChange={(e) => handleInputChange('lampara1Codigo', e.target.value)}
                        disabled={formData.lampara1ExisteCodigo !== 'SI'}
                        placeholder="Código"
                      />
                    </div>

                    <div className="form-group">
                      <label>¿Dañada?:</label>
                      <select 
                        value={formData.lampara1Danada}
                        onChange={(e) => handleInputChange('lampara1Danada', e.target.value)}
                        disabled={formData.lampara1Tipo === 'NO EXISTE' || !formData.lampara1Tipo}
                      >
                        <option value=""></option>
                        <option value="NO">NO</option>
                        <option value="SI">SI</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>¿Encendida?:</label>
                      <select 
                        value={formData.lampara1Encendida}
                        onChange={(e) => handleInputChange('lampara1Encendida', e.target.value)}
                        disabled={formData.lampara1Tipo === 'NO EXISTE' || !formData.lampara1Tipo}
                      >
                        <option value=""></option>
                        <option value="NO">NO</option>
                        <option value="SI">SI</option>
                      </select>
                    </div>
                  </div>

                  <h5 className="subsection-subtitle">LÁMPARA #2</h5>
                  <div className="form-grid form-grid-5">
                    <div className="form-group">
                      <label>Tipo:</label>
                      <select 
                        value={formData.lampara2Tipo}
                        onChange={(e) => handleInputChange('lampara2Tipo', e.target.value)}
                      >
                        <option value=""></option>
                        <option value="NO EXISTE">NO EXISTE</option>
                        <option value="LED">LED</option>
                        <option value="SODIO">SODIO</option>
                        <option value="MERCURIO">MERCURIO</option>
                        <option value="OTRO">OTRO</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>¿Existe código?:</label>
                      <select 
                        value={formData.lampara2ExisteCodigo}
                        onChange={(e) => handleInputChange('lampara2ExisteCodigo', e.target.value)}
                        disabled={formData.lampara2Tipo === 'NO EXISTE' || !formData.lampara2Tipo}
                      >
                        <option value=""></option>
                        <option value="NO">NO</option>
                        <option value="SI">SI</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Código:</label>
                      <input 
                        type="text" 
                        value={formData.lampara2Codigo}
                        onChange={(e) => handleInputChange('lampara2Codigo', e.target.value)}
                        disabled={formData.lampara2ExisteCodigo !== 'SI'}
                        placeholder="Código"
                      />
                    </div>

                    <div className="form-group">
                      <label>¿Dañada?:</label>
                      <select 
                        value={formData.lampara2Danada}
                        onChange={(e) => handleInputChange('lampara2Danada', e.target.value)}
                        disabled={formData.lampara2Tipo === 'NO EXISTE' || !formData.lampara2Tipo}
                      >
                        <option value=""></option>
                        <option value="NO">NO</option>
                        <option value="SI">SI</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>¿Encendida?:</label>
                      <select 
                        value={formData.lampara2Encendida}
                        onChange={(e) => handleInputChange('lampara2Encendida', e.target.value)}
                        disabled={formData.lampara2Tipo === 'NO EXISTE' || !formData.lampara2Tipo}
                      >
                        <option value=""></option>
                        <option value="NO">NO</option>
                        <option value="SI">SI</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="subsection subsection-tierra">
              <h4 className="subsection-title">TIERRA ELÉCTRICA</h4>
              <div className="form-grid form-grid-5">
                <div className="form-group">
                  <label>Tierra eléctrica: *</label>
                  <select 
                    value={formData.tierraElectrica}
                    onChange={(e) => handleInputChange('tierraElectrica', e.target.value)}
                  >
                    <option value=""></option>
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Estado:</label>
                  <select 
                    value={formData.tierraEstado}
                    onChange={(e) => handleInputChange('tierraEstado', e.target.value)}
                    disabled={formData.tierraElectrica !== 'SI'}
                  >
                    <option value=""></option>
                    <option value="BUENO">BUENO</option>
                    <option value="REGULAR">REGULAR</option>
                    <option value="MALO">MALO</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>¿Suelta?:</label>
                  <select 
                    value={formData.tierraSuelta}
                    onChange={(e) => handleInputChange('tierraSuelta', e.target.value)}
                    disabled={formData.tierraElectrica !== 'SI'}
                  >
                    <option value=""></option>
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>¿Desconectada?:</label>
                  <select 
                    value={formData.tierraDesconectada}
                    onChange={(e) => handleInputChange('tierraDesconectada', e.target.value)}
                    disabled={formData.tierraElectrica !== 'SI'}
                  >
                    <option value=""></option>
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>¿Rota?:</label>
                  <select 
                    value={formData.tierraRota}
                    onChange={(e) => handleInputChange('tierraRota', e.target.value)}
                    disabled={formData.tierraElectrica !== 'SI'}
                  >
                    <option value=""></option>
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="subsection subsection-elementos">
              <h4 className="subsection-title">ELEMENTOS ADICIONALES</h4>
              <div className="form-grid form-grid-1">
                <div className="form-group">
                  <label>Elementos Adicionales:</label>
                  <select 
                    value={formData.elementosAdicionales}
                    onChange={(e) => handleInputChange('elementosAdicionales', e.target.value)}
                  >
                    <option value="NO APLICA">NO APLICA</option>
                    <option value="APLICA">APLICA</option>
                  </select>
                </div>
              </div>

              {formData.elementosAdicionales === 'APLICA' && (
                <div className="form-grid form-grid-7">
                  <div className="form-group">
                    <label>Lámpara:</label>
                    <select 
                      value={formData.lampara}
                      onChange={(e) => handleInputChange('lampara', e.target.value)}
                    >
                      <option value=""></option>
                      <option value="NO">NO</option>
                      <option value="SI">SI</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Cámara TV:</label>
                    <select 
                      value={formData.camaraTv}
                      onChange={(e) => handleInputChange('camaraTv', e.target.value)}
                    >
                      <option value=""></option>
                      <option value="NO">NO</option>
                      <option value="SI">SI</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Corneta:</label>
                    <select 
                      value={formData.corneta}
                      onChange={(e) => handleInputChange('corneta', e.target.value)}
                    >
                      <option value=""></option>
                      <option value="NO">NO</option>
                      <option value="SI">SI</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Aviso:</label>
                    <select 
                      value={formData.aviso}
                      onChange={(e) => handleInputChange('aviso', e.target.value)}
                    >
                      <option value=""></option>
                      <option value="NO">NO</option>
                      <option value="SI">SI</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Caja metálica:</label>
                    <select 
                      value={formData.cajaMetalica}
                      onChange={(e) => handleInputChange('cajaMetalica', e.target.value)}
                    >
                      <option value=""></option>
                      <option value="NO">NO</option>
                      <option value="SI">SI</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Otro:</label>
                    <select 
                      value={formData.otro}
                      onChange={(e) => handleInputChange('otro', e.target.value)}
                    >
                      <option value=""></option>
                      <option value="NO">NO</option>
                      <option value="SI">SI</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Posible fraude:</label>
                    <select 
                      value={formData.posibleFraude}
                      onChange={(e) => handleInputChange('posibleFraude', e.target.value)}
                    >
                      <option value=""></option>
                      <option value="NO">NO</option>
                      <option value="SI">SI</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className={`form-section collapsible ${getEstadoSeccion('estadoEstructura')}`}>
        <h3 
          className="section-title clickable" 
          onClick={() => toggleSeccion('estadoEstructura')}
        >
          <span className={`arrow ${seccionesAbiertas.estadoEstructura ? 'open' : ''}`}>▶</span>
          4. ESTADO ESTRUCTURA
          <span className="status-indicator"></span>
        </h3>
        
        {seccionesAbiertas.estadoEstructura && (
          <div className="section-content">
            <div className="form-grid form-grid-1">
              <div className="form-group">
                <label>¿La estructura está en buen estado?: *</label>
                <select 
                  value={formData.estadoEstructura}
                  onChange={(e) => handleInputChange('estadoEstructura', e.target.value)}
                >
                  <option value=""></option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>
            </div>

            {formData.estadoEstructura === 'NO' && (
              <div className="form-grid form-grid-4">
                <div className="form-group">
                  <label>¿Desplomado?:</label>
                  <select 
                    value={formData.desplomado}
                    onChange={(e) => handleInputChange('desplomado', e.target.value)}
                  >
                    <option value=""></option>
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>¿Flectado?:</label>
                  <select 
                    value={formData.flectado}
                    onChange={(e) => handleInputChange('flectado', e.target.value)}
                  >
                    <option value=""></option>
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>¿Fracturado?:</label>
                  <select 
                    value={formData.fracturado}
                    onChange={(e) => handleInputChange('fracturado', e.target.value)}
                  >
                    <option value=""></option>
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>¿Hierro en la base?:</label>
                  <select 
                    value={formData.hierroBase}
                    onChange={(e) => handleInputChange('hierroBase', e.target.value)}
                  >
                    <option value=""></option>
                    <option value="NO">NO</option>
                    <option value="SI">SI</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className={`form-section collapsible ${getEstadoSeccion('estados')}`}>
        <h3 
          className="section-title clickable" 
          onClick={() => toggleSeccion('estados')}
        >
          <span className={`arrow ${seccionesAbiertas.estados ? 'open' : ''}`}>▶</span>
          5. ESTADOS
          <span className="status-indicator"></span>
        </h3>
        
        {seccionesAbiertas.estados && (
          <div className="section-content">
            <div className="form-grid form-grid-1">
              <div className="form-group">
                <label>Poda de árboles: *</label>
                <select 
                  value={formData.podaArboles}
                  onChange={(e) => handleInputChange('podaArboles', e.target.value)}
                >
                  <option value=""></option>
                  <option value="NO REQUIERE">NO REQUIERE</option>
                  <option value="REQUIERE">REQUIERE</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className={`form-section collapsible ${getEstadoSeccion('operadores')}`}>
        <h3 
          className="section-title clickable" 
          onClick={() => toggleSeccion('operadores')}
        >
          <span className={`arrow ${seccionesAbiertas.operadores ? 'open' : ''}`}>▶</span>
          6. OPERADORES *
          <span className="status-indicator"></span>
        </h3>
        
        {seccionesAbiertas.operadores && (
          <div className="section-content">
            <div className="operadores-grid">
              {operadores.map((operador) => (
                <div 
                  key={operador}
                  className={`operador-checkbox ${operadoresSeleccionados.includes(operador) ? 'selected' : ''}`}
                  onClick={() => toggleOperador(operador)}
                >
                  <input 
                    type="checkbox"
                    checked={operadoresSeleccionados.includes(operador)}
                    onChange={() => toggleOperador(operador)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label>{operador}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="botones-accion">
        {!modoEdicion && (
          <button 
            className="btn-limpiar"
            onClick={handleLimpiar}
            disabled={loading}
            type="button"
          >
            🗑️ Limpiar
          </button>
        )}

        <div className="botones-derecha">
          {modoEdicion ? (
            <>
              <button 
                className="btn-guardar"
                onClick={handleGuardar}
                disabled={loading}
                type="button"
              >
                💾 Actualizar
              </button>
              <button 
                className="btn-guardar-continuar"
                onClick={() => {
                  setAllowNavigation(true)
                  localStorage.setItem('editarInventarioId', inventarioIdEditar)
                  setCurrentPage('agregar-operadores')
                }}
                disabled={loading}
                type="button"
              >
                Página Siguiente →
              </button>
            </>
          ) : (
            <button 
              className="btn-guardar-continuar"
              onClick={handleGuardarYContinuar}
              disabled={loading}
              type="button"
            >
              Guardar y Continuar →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgregarPoste
