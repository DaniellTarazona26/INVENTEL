import React, { useState, useEffect } from 'react'
import './AgregarFactibilidad.css'
import factibilidadService from '../../services/factibilidadService'
import proyectosService from '../../services/proyectosService'
import ciudadesService from '../../services/ciudadesService'
import empresasService from '../../services/empresasService'
import operadoresService from '../../services/operadoresService'


const AgregarFactibilidad = ({ setCurrentPage }) => {
  const factibilidadIdEditar = localStorage.getItem('editarFactibilidadId')
  
  const [proyectos, setProyectos] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [barrios, setBarrios] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [operadores, setOperadores] = useState([])


  const [paso, setPaso] = useState(1)
  const [cantidadPostes, setCantidadPostes] = useState(1)
  const [posteActual, setPosteActual] = useState(0)
  const [postes, setPostes] = useState([])

  const [datosCompartidos, setDatosCompartidos] = useState({
    proyecto_id: '',
    empresa_id: '',
    operador_id: '',
    ciudad_id: ''
  })

  const [seccionesAbiertas, setSeccionesAbiertas] = useState({
    identificacion: true,
    redElectrica: false,
    poste: false,
    elementosProyectados: false,
    observaciones: false
  })

  const [formData, setFormData] = useState({
    barrio_id: '',
    direccion_via: '',
    direccion_numero: '',
    direccion_coordenada: '',
    poste_plano: '',
    codigo_poste: '',
    tipo_cable: '',
    latitud: '',
    longitud: '',
    
    nivel_tension_at: false,
    nivel_tension_mt: false,
    nivel_tension_bt: false,
    nivel_tension_ap: false,
    elem_transformador: false,
    elem_seccionador: false,
    elem_corta_circuito: false,
    elem_medidor: false,
    elem_bajante_electrico: false,
    tierra_electrica: false,
    
    poste_material: '',
    poste_altura: '',
    poste_resistencia: '',
    poste_uso_carga: '',
    poste_retenida: '',
    poste_estado: '',
    
    telp_pas_cables: '',
    telp_pas_c_coaxial: '',
    telp_pas_c_fibra: '',
    telp_pas_c_drop: '',
    telp_pas_c_rg11: '',
    telp_pas_cajempalme: '',
    telp_pas_cajgpon: '',
    telp_pas_stp: '',
    telp_pas_bajantes: '',
    telp_pas_reservas: '',
    
    telp_act_amplificadores: '',
    telp_act_fuentes: '',
    telp_act_nodooptico: '',
    telp_act_antena: '',
    telp_act_camara_vigil: '',
    
    telp_mth_retencion: '',
    telp_mth_suspencion: '',
    telp_retencion: '',
    telp_ccoaxial: '',
    telp_cfibra: '',
    
    fijacion_herraje: '',
    observacion_tendido: '',
    
    checkYaExisteActivo: false,
    checkDiagonalNoPermitida: false,
    checkSinContinuidad: false,
    checkCruceProhibido: false,
    checkCompensarCarga: false,
    checkTransicionOperador: false,
    checkIngresoCliente: false,
    checkNoCumpleAltura: false,
    checkMas8Cables: false,
    checkFaltaPoste: false,
    
    observaciones: '',
    
    checkCambiarUbicacion: false,
    checkCambiarRuta: false,
    checkPosteApoyo: false,
    checkIncluirCartera: false,
    checkColocarRetenida: false,
    checkCambioNivel: false,
    checkPosteSaturado: false
  })

  const [guardando, setGuardando] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [modoEdicion, setModoEdicion] = useState(false)
  useEffect(() => {
    cargarProyectos()
    cargarCiudades()
    cargarEmpresas()
    cargarOperadores()
  }, [])

  const cargarEmpresas = async () => {
    try {
      const response = await empresasService.obtenerTodas()
      const listaEmpresas = response.empresas || response
      setEmpresas(Array.isArray(listaEmpresas) ? listaEmpresas : [])
    } catch (error) {
      console.error('Error cargando empresas:', error)
      setEmpresas([])
    }
  }

  const cargarOperadores = async () => {
  try {
    const respuesta = await operadoresService.obtenerTodos()
    const operadoresList = Array.isArray(respuesta) ? respuesta : (respuesta.operadores || [])
    setOperadores(operadoresList)
  } catch (error) {
    console.error('Error cargando operadores:', error)
  }
}

  useEffect(() => {
    if (datosCompartidos.proyecto_id && paso === 1) {
      const proyectoSeleccionado = proyectos.find(p => p.id === parseInt(datosCompartidos.proyecto_id))
      if (proyectoSeleccionado) {
        setDatosCompartidos(prev => ({
          ...prev,
          ciudad_id: proyectoSeleccionado.ciudad_id || '',
          empresa_id: proyectoSeleccionado.empresa_id || '',
          operador_id: proyectoSeleccionado.operador_id || ''
        }))
      }
    }
  }, [datosCompartidos.proyecto_id, proyectos, paso])

  useEffect(() => {
    if (datosCompartidos.ciudad_id) {
      cargarBarrios(datosCompartidos.ciudad_id)
    } else {
      setBarrios([])
    }
  }, [datosCompartidos.ciudad_id])

  useEffect(() => {
    if (factibilidadIdEditar) {
      cargarFactibilidad(factibilidadIdEditar)
    }
  }, [factibilidadIdEditar])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (modoEdicion) {
        e.preventDefault()
        e.returnValue = '¿Estás seguro de que quieres salir? Los cambios en edición se perderán.'
        return e.returnValue
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [modoEdicion])
  const cargarProyectos = async () => {
    try {
      const response = await proyectosService.obtenerTodos()
      setProyectos(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error('Error cargando proyectos:', error)
      setMensaje({ tipo: 'error', texto: 'Error al cargar proyectos' })
    }
  }

  const cargarCiudades = async () => {
    try {
      const response = await ciudadesService.obtenerTodas()
      setCiudades(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error('Error cargando ciudades:', error)
      setMensaje({ tipo: 'error', texto: 'Error al cargar ciudades' })
    }
  }

  const cargarBarrios = async (ciudadId) => {
    try {
      const response = await ciudadesService.obtenerBarrios(ciudadId)
      setBarrios(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error('Error cargando barrios:', error)
      setBarrios([])
    }
  }

  const cargarFactibilidad = async (factibilidadId) => {
    try {
      setCargando(true)
      const response = await factibilidadService.obtenerPorId(factibilidadId)
      
      if (response) {
        const fact = response.factibilidad
        
        let checkboxesTendido = []
        let checkboxesSugerencias = []
        
        try {
          checkboxesTendido = typeof fact.checkboxes_tendido === 'string' 
            ? JSON.parse(fact.checkboxes_tendido) 
            : (fact.checkboxes_tendido || [])
          checkboxesSugerencias = typeof fact.checkboxes_sugerencias === 'string' 
            ? JSON.parse(fact.checkboxes_sugerencias) 
            : (fact.checkboxes_sugerencias || [])
        } catch (e) {
          console.error('Error parseando checkboxes:', e)
        }
        
        setDatosCompartidos({
          proyecto_id: fact.proyecto_id || '',
          empresa_id: fact.empresa_id || '',
          operador_id: fact.operador_id || '',
          ciudad_id: fact.ciudad_id || ''
        })
        
        setFormData({
          barrio_id: fact.barrio_id || '',
          direccion_via: fact.direccion_via || '',
          direccion_numero: fact.direccion_numero || '',
          direccion_coordenada: fact.direccion_coordenada || '',
          poste_plano: fact.poste_plano || '',
          codigo_poste: fact.codigo_poste || '',
          tipo_cable: fact.tipo_cable || '',
          latitud: fact.latitud?.toString() || '',
          longitud: fact.longitud?.toString() || '',
          
          nivel_tension_at: fact.nivel_tension_at || false,
          nivel_tension_mt: fact.nivel_tension_mt || false,
          nivel_tension_bt: fact.nivel_tension_bt || false,
          nivel_tension_ap: fact.nivel_tension_ap || false,
          elem_transformador: fact.elem_transformador || false,
          elem_seccionador: fact.elem_seccionador || false,
          elem_corta_circuito: fact.elem_corta_circuito || false,
          elem_medidor: fact.elem_medidor || false,
          elem_bajante_electrico: fact.elem_bajante_electrico || false,
          tierra_electrica: fact.tierra_electrica || false,
          
          poste_material: fact.poste_material || '',
          poste_altura: fact.poste_altura?.toString() || '',
          poste_resistencia: fact.poste_resistencia?.toString() || '',
          poste_uso_carga: fact.poste_uso_carga || '',
          poste_retenida: fact.poste_retenida?.toString() || '',
          poste_estado: fact.poste_estado || '',
          
          telp_pas_cables: fact.telp_pas_cables?.toString() || '',
          telp_pas_c_coaxial: fact.telp_pas_c_coaxial?.toString() || '',
          telp_pas_c_fibra: fact.telp_pas_c_fibra?.toString() || '',
          telp_pas_c_drop: fact.telp_pas_c_drop?.toString() || '',
          telp_pas_c_rg11: fact.telp_pas_c_rg11?.toString() || '',
          telp_pas_cajempalme: fact.telp_pas_cajempalme?.toString() || '',
          telp_pas_cajgpon: fact.telp_pas_cajgpon?.toString() || '',
          telp_pas_stp: fact.telp_pas_stp?.toString() || '',
          telp_pas_bajantes: fact.telp_pas_bajantes?.toString() || '',
          telp_pas_reservas: fact.telp_pas_reservas?.toString() || '',
          
          telp_act_amplificadores: fact.telp_act_amplificadores?.toString() || '',
          telp_act_fuentes: fact.telp_act_fuentes?.toString() || '',
          telp_act_nodooptico: fact.telp_act_nodooptico?.toString() || '',
          telp_act_antena: fact.telp_act_antena?.toString() || '',
          telp_act_camara_vigil: fact.telp_act_camara_vigil?.toString() || '',
          
          telp_mth_retencion: fact.telp_mth_retencion?.toString() || '',
          telp_mth_suspencion: fact.telp_mth_suspencion?.toString() || '',
          telp_retencion: fact.telp_retencion?.toString() || '',
          telp_ccoaxial: fact.telp_ccoaxial?.toString() || '',
          telp_cfibra: fact.telp_cfibra?.toString() || '',
          
          fijacion_herraje: fact.fijacion_herraje || '',
          observacion_tendido: fact.observacion_tendido || '',
          observaciones: fact.observaciones || '',
          
          checkYaExisteActivo: checkboxesTendido.includes('Ya existe activo'),
          checkDiagonalNoPermitida: checkboxesTendido.includes('Diagonal no permitida'),
          checkSinContinuidad: checkboxesTendido.includes('Sin continuidad'),
          checkCruceProhibido: checkboxesTendido.includes('Cruce prohibido'),
          checkCompensarCarga: checkboxesTendido.includes('Compensar carga'),
          checkTransicionOperador: checkboxesTendido.includes('Transición de operador'),
          checkIngresoCliente: checkboxesTendido.includes('Ingreso a cliente'),
          checkNoCumpleAltura: checkboxesTendido.includes('No cumple altura'),
          checkMas8Cables: checkboxesTendido.includes('Más de 8 cables'),
          checkFaltaPoste: checkboxesTendido.includes('Falta poste'),
          
          checkCambiarUbicacion: checkboxesSugerencias.includes('Cambiar ubicación'),
          checkCambiarRuta: checkboxesSugerencias.includes('Cambiar ruta'),
          checkPosteApoyo: checkboxesSugerencias.includes('Poste de apoyo'),
          checkIncluirCartera: checkboxesSugerencias.includes('Incluir en cartera'),
          checkColocarRetenida: checkboxesSugerencias.includes('Colocar retenida'),
          checkCambioNivel: checkboxesSugerencias.includes('Cambio de nivel'),
          checkPosteSaturado: checkboxesSugerencias.includes('Poste saturado')
        })
        
        setPaso(2)
        setModoEdicion(true)
        setMensaje({ tipo: 'info', texto: 'Factibilidad cargada para edición' })
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
      }
    } catch (error) {
      console.error('Error cargando factibilidad:', error)
      setMensaje({ tipo: 'error', texto: 'Error al cargar la factibilidad' })
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000)
    } finally {
      setCargando(false)
    }
  }
  const getEstadoSeccion = (seccion) => {
    let campos = []
    
    switch(seccion) {
      case 'identificacion':
        campos = ['barrio_id', 'direccion_via', 'direccion_numero', 'direccion_coordenada', 'poste_plano', 'codigo_poste', 'tipo_cable', 'latitud', 'longitud']
        break
      case 'redElectrica':
        const tieneNivelTension = formData.nivel_tension_at || formData.nivel_tension_mt || formData.nivel_tension_bt || formData.nivel_tension_ap
        const tieneElemento = formData.elem_transformador || formData.elem_seccionador || formData.elem_corta_circuito || formData.elem_medidor || formData.elem_bajante_electrico
        const tieneTierra = formData.tierra_electrica
  
        if (!tieneNivelTension && !tieneElemento && !tieneTierra) return 'vacio'
  
        const cumpleRequisitos = tieneNivelTension && tieneElemento
  
        if (cumpleRequisitos) return 'completo'
  
        return 'incompleto'
      case 'poste':
        campos = ['poste_material', 'poste_altura', 'poste_resistencia', 'poste_uso_carga', 'poste_retenida', 'poste_estado']
        break
      case 'elementosProyectados':
        const camposPasivos = ['telp_pas_cables', 'telp_pas_cajempalme', 'telp_pas_cajgpon', 'telp_pas_stp', 'telp_pas_bajantes', 'telp_pas_reservas']
        const camposActivos = ['telp_act_amplificadores', 'telp_act_fuentes', 'telp_act_nodooptico', 'telp_act_antena', 'telp_act_camara_vigil']
        
        const todosPasivosLlenos = camposPasivos.every(campo => formData[campo] !== '')
        const todosActivosLlenos = camposActivos.every(campo => formData[campo] !== '')
        const fijacionLlena = formData.fijacion_herraje !== ''
        const observacionTendidoLlena = formData.observacion_tendido.trim() !== ''
        
        const tieneAlgunaCheckbox = formData.checkYaExisteActivo || formData.checkDiagonalNoPermitida || 
          formData.checkSinContinuidad || formData.checkCruceProhibido || formData.checkCompensarCarga || 
          formData.checkTransicionOperador || formData.checkIngresoCliente || formData.checkNoCumpleAltura || 
          formData.checkMas8Cables || formData.checkFaltaPoste
        
        const algunCampoLleno = camposPasivos.some(campo => formData[campo] !== '') || 
          camposActivos.some(campo => formData[campo] !== '') || fijacionLlena || observacionTendidoLlena || tieneAlgunaCheckbox
        
        if (!algunCampoLleno) return 'vacio'
        
        const todosObligatoriosLlenos = todosPasivosLlenos && todosActivosLlenos && fijacionLlena && observacionTendidoLlena && tieneAlgunaCheckbox
        
        if (todosObligatoriosLlenos) return 'completo'
        
        return 'incompleto'

      case 'observaciones':
        const observacionesLlena = formData.observaciones.trim() !== ''
        
        const tieneAlgunaSugerencia = formData.checkCambiarUbicacion || formData.checkCambiarRuta || 
          formData.checkPosteApoyo || formData.checkIncluirCartera || formData.checkColocarRetenida || 
          formData.checkCambioNivel || formData.checkPosteSaturado
        
        if (!observacionesLlena && !tieneAlgunaSugerencia) return 'vacio'
        
        if (observacionesLlena && tieneAlgunaSugerencia) return 'completo'
        
        return 'incompleto'
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
  const iniciarFactibilidad = () => {
    if (!datosCompartidos.proyecto_id) {
      setMensaje({ tipo: 'error', texto: 'Debe seleccionar un proyecto' })
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
      return
    }

    if (!datosCompartidos.empresa_id) {
      setMensaje({ tipo: 'error', texto: 'Debe seleccionar una empresa' })
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
      return
    }

    if (!datosCompartidos.operador_id) {
    setMensaje({ tipo: 'error', texto: 'Debe seleccionar un operador' })
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
    return
  }

    if (cantidadPostes < 1 || cantidadPostes > 50) {
      setMensaje({ tipo: 'error', texto: 'La cantidad debe estar entre 1 y 50' })
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
      return
    }

    const posteVacio = {
      barrio_id: '',
      direccion_via: '',
      direccion_numero: '',
      direccion_coordenada: '',
      poste_plano: '',
      codigo_poste: '',
      tipo_cable: '',
      latitud: '',
      longitud: '',
      
      nivel_tension_at: false,
      nivel_tension_mt: false,
      nivel_tension_bt: false,
      nivel_tension_ap: false,
      elem_transformador: false,
      elem_seccionador: false,
      elem_corta_circuito: false,
      elem_medidor: false,
      elem_bajante_electrico: false,
      tierra_electrica: false,
      
      poste_material: '',
      poste_altura: '',
      poste_resistencia: '',
      poste_uso_carga: '',
      poste_retenida: '',
      poste_estado: '',
      
      telp_pas_cables: '',
      telp_pas_c_coaxial: '',
      telp_pas_c_fibra: '',
      telp_pas_c_drop: '',
      telp_pas_c_rg11: '',
      telp_pas_cajempalme: '',
      telp_pas_cajgpon: '',
      telp_pas_stp: '',
      telp_pas_bajantes: '',
      telp_pas_reservas: '',
      
      telp_act_amplificadores: '',
      telp_act_fuentes: '',
      telp_act_nodooptico: '',
      telp_act_antena: '',
      telp_act_camara_vigil: '',
      
      telp_mth_retencion: '',
      telp_mth_suspencion: '',
      telp_retencion: '',
      telp_ccoaxial: '',
      telp_cfibra: '',
      
      fijacion_herraje: '',
      observacion_tendido: '',
      
      checkYaExisteActivo: false,
      checkDiagonalNoPermitida: false,
      checkSinContinuidad: false,
      checkCruceProhibido: false,
      checkCompensarCarga: false,
      checkTransicionOperador: false,
      checkIngresoCliente: false,
      checkNoCumpleAltura: false,
      checkMas8Cables: false,
      checkFaltaPoste: false,
      
      observaciones: '',
      
      checkCambiarUbicacion: false,
      checkCambiarRuta: false,
      checkPosteApoyo: false,
      checkIncluirCartera: false,
      checkColocarRetenida: false,
      checkCambioNivel: false,
      checkPosteSaturado: false
    }

    const postesVacios = Array(cantidadPostes).fill(null).map(() => ({ ...posteVacio }))
    setPostes(postesVacios)
    setFormData(postesVacios[0])
    setPaso(2)
    setPosteActual(0)
  }

  const continuarSiguientePoste = () => {
    const nuevosPostes = [...postes]
    nuevosPostes[posteActual] = formData
    setPostes(nuevosPostes)

    if (posteActual < cantidadPostes - 1) {
      setPosteActual(posteActual + 1)
      setFormData(nuevosPostes[posteActual + 1])
      window.scrollTo(0, 0)
    } else {
      setPaso(3)
      window.scrollTo(0, 0)
    }
  }

  const volverPosteAnterior = () => {
    if (posteActual > 0) {
      const nuevosPostes = [...postes]
      nuevosPostes[posteActual] = formData
      setPostes(nuevosPostes)
      
      setPosteActual(posteActual - 1)
      setFormData(nuevosPostes[posteActual - 1])
      window.scrollTo(0, 0)
    } else {
      setPaso(1)
    }
  }

  const editarPosteDesdeRevision = (index) => {
    setPosteActual(index)
    setFormData(postes[index])
    setPaso(2)
    window.scrollTo(0, 0)
  }
  const guardarTodasFactibilidades = async () => {
    try {
      setGuardando(true)
      setMensaje({ tipo: 'info', texto: `Guardando ${cantidadPostes} factibilidades...` })

      const promesas = postes.map((posteData) => {
        const checkboxesTendido = []
        if (posteData.checkYaExisteActivo) checkboxesTendido.push('Ya existe activo')
        if (posteData.checkDiagonalNoPermitida) checkboxesTendido.push('Diagonal no permitida')
        if (posteData.checkSinContinuidad) checkboxesTendido.push('Sin continuidad')
        if (posteData.checkCruceProhibido) checkboxesTendido.push('Cruce prohibido')
        if (posteData.checkCompensarCarga) checkboxesTendido.push('Compensar carga')
        if (posteData.checkTransicionOperador) checkboxesTendido.push('Transición de operador')
        if (posteData.checkIngresoCliente) checkboxesTendido.push('Ingreso a cliente')
        if (posteData.checkNoCumpleAltura) checkboxesTendido.push('No cumple altura')
        if (posteData.checkMas8Cables) checkboxesTendido.push('Más de 8 cables')
        if (posteData.checkFaltaPoste) checkboxesTendido.push('Falta poste')

        const checkboxesSugerencias = []
        if (posteData.checkCambiarUbicacion) checkboxesSugerencias.push('Cambiar ubicación')
        if (posteData.checkCambiarRuta) checkboxesSugerencias.push('Cambiar ruta')
        if (posteData.checkPosteApoyo) checkboxesSugerencias.push('Poste de apoyo')
        if (posteData.checkIncluirCartera) checkboxesSugerencias.push('Incluir en cartera')
        if (posteData.checkColocarRetenida) checkboxesSugerencias.push('Colocar retenida')
        if (posteData.checkCambioNivel) checkboxesSugerencias.push('Cambio de nivel')
        if (posteData.checkPosteSaturado) checkboxesSugerencias.push('Poste saturado')

        const datosCompletos = {
          proyecto_id: parseInt(datosCompartidos.proyecto_id) || null,
          empresa_id: parseInt(datosCompartidos.empresa_id) || null,
          operador_id: parseInt(datosCompartidos.operador_id) || null,
          ciudad_id: parseInt(datosCompartidos.ciudad_id) || null,
          barrio_id: parseInt(posteData.barrio_id) || null,
          direccion_via: posteData.direccion_via,
          direccion_numero: posteData.direccion_numero,
          direccion_coordenada: posteData.direccion_coordenada,
          poste_plano: posteData.poste_plano,
          codigo_poste: posteData.codigo_poste,
          tipo_cable: posteData.tipo_cable,
          latitud: parseFloat(posteData.latitud) || 0,
          longitud: parseFloat(posteData.longitud) || 0,
          
          nivel_tension_at: posteData.nivel_tension_at,
          nivel_tension_mt: posteData.nivel_tension_mt,
          nivel_tension_bt: posteData.nivel_tension_bt,
          nivel_tension_ap: posteData.nivel_tension_ap,
          elem_transformador: posteData.elem_transformador,
          elem_seccionador: posteData.elem_seccionador,
          elem_corta_circuito: posteData.elem_corta_circuito,
          elem_medidor: posteData.elem_medidor,
          elem_bajante_electrico: posteData.elem_bajante_electrico,
          tierra_electrica: posteData.tierra_electrica,
          
          poste_material: posteData.poste_material,
          poste_altura: posteData.poste_altura,
          poste_resistencia: posteData.poste_resistencia,
          poste_uso_carga: posteData.poste_uso_carga,
          poste_retenida: posteData.poste_retenida,
          poste_estado: posteData.poste_estado,
          
          telp_pas_cables: parseInt(posteData.telp_pas_cables) || 0,
          telp_pas_c_coaxial: parseInt(posteData.telp_pas_c_coaxial) || 0,
          telp_pas_c_fibra: parseInt(posteData.telp_pas_c_fibra) || 0,
          telp_pas_c_drop: parseInt(posteData.telp_pas_c_drop) || 0,
          telp_pas_c_rg11: parseInt(posteData.telp_pas_c_rg11) || 0,
          telp_pas_cajempalme: parseInt(posteData.telp_pas_cajempalme) || 0,
          telp_pas_cajgpon: parseInt(posteData.telp_pas_cajgpon) || 0,
          telp_pas_stp: parseInt(posteData.telp_pas_stp) || 0,
          telp_pas_bajantes: parseInt(posteData.telp_pas_bajantes) || 0,
          telp_pas_reservas: parseInt(posteData.telp_pas_reservas) || 0,
          
          telp_act_amplificadores: parseInt(posteData.telp_act_amplificadores) || 0,
          telp_act_fuentes: parseInt(posteData.telp_act_fuentes) || 0,
          telp_act_nodooptico: parseInt(posteData.telp_act_nodooptico) || 0,
          telp_act_antena: parseInt(posteData.telp_act_antena) || 0,
          telp_act_camara_vigil: parseInt(posteData.telp_act_camara_vigil) || 0,
          
          telp_mth_retencion: parseInt(posteData.telp_mth_retencion) || 0,
          telp_mth_suspencion: parseInt(posteData.telp_mth_suspencion) || 0,
          telp_retencion: parseInt(posteData.telp_retencion) || 0,
          telp_ccoaxial: parseInt(posteData.telp_ccoaxial) || 0,
          telp_cfibra: parseInt(posteData.telp_cfibra) || 0,
          
          fijacion_herraje: posteData.fijacion_herraje,
          observacion_tendido: posteData.observacion_tendido,
          observaciones: posteData.observaciones,
          
          checkboxes_tendido: checkboxesTendido,
          checkboxes_sugerencias: checkboxesSugerencias
        }

        return factibilidadService.crear(datosCompletos)
      })

      await Promise.all(promesas)
      setMensaje({ tipo: 'success', texto: `✅ ${cantidadPostes} factibilidades creadas exitosamente` })

      setTimeout(() => {
        if (setCurrentPage) setCurrentPage('factibilidad')
      }, 2000)
    } catch (error) {
      console.error('Error al guardar:', error)
      setMensaje({ 
        tipo: 'error', 
        texto: 'Error al guardar: ' + (error.message || 'Error desconocido') 
      })
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000)
    } finally {
      setGuardando(false)
    }
  }

  const handleGuardarEdicion = async () => {
    try {
      if (!datosCompartidos.proyecto_id || !datosCompartidos.empresa_id) {
        setMensaje({ tipo: 'error', texto: 'Proyecto y Empresa son obligatorios' })
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000)
        return
      }

      setGuardando(true)
      setMensaje({ tipo: 'info', texto: 'Actualizando factibilidad...' })

      const checkboxesTendido = []
      if (formData.checkYaExisteActivo) checkboxesTendido.push('Ya existe activo')
      if (formData.checkDiagonalNoPermitida) checkboxesTendido.push('Diagonal no permitida')
      if (formData.checkSinContinuidad) checkboxesTendido.push('Sin continuidad')
      if (formData.checkCruceProhibido) checkboxesTendido.push('Cruce prohibido')
      if (formData.checkCompensarCarga) checkboxesTendido.push('Compensar carga')
      if (formData.checkTransicionOperador) checkboxesTendido.push('Transición de operador')
      if (formData.checkIngresoCliente) checkboxesTendido.push('Ingreso a cliente')
      if (formData.checkNoCumpleAltura) checkboxesTendido.push('No cumple altura')
      if (formData.checkMas8Cables) checkboxesTendido.push('Más de 8 cables')
      if (formData.checkFaltaPoste) checkboxesTendido.push('Falta poste')

      const checkboxesSugerencias = []
      if (formData.checkCambiarUbicacion) checkboxesSugerencias.push('Cambiar ubicación')
      if (formData.checkCambiarRuta) checkboxesSugerencias.push('Cambiar ruta')
      if (formData.checkPosteApoyo) checkboxesSugerencias.push('Poste de apoyo')
      if (formData.checkIncluirCartera) checkboxesSugerencias.push('Incluir en cartera')
      if (formData.checkColocarRetenida) checkboxesSugerencias.push('Colocar retenida')
      if (formData.checkCambioNivel) checkboxesSugerencias.push('Cambio de nivel')
      if (formData.checkPosteSaturado) checkboxesSugerencias.push('Poste saturado')

      const datosAEnviar = {
        proyecto_id: parseInt(datosCompartidos.proyecto_id) || null,
        empresa_id: parseInt(datosCompartidos.empresa_id) || null,
        operador_id: parseInt(datosCompartidos.operador_id) || null,
        ciudad_id: parseInt(datosCompartidos.ciudad_id) || null,
        barrio_id: parseInt(formData.barrio_id) || null,
        direccion_via: formData.direccion_via,
        direccion_numero: formData.direccion_numero,
        direccion_coordenada: formData.direccion_coordenada,
        poste_plano: formData.poste_plano,
        codigo_poste: formData.codigo_poste,
        tipo_cable: formData.tipo_cable,
        latitud: parseFloat(formData.latitud) || 0,
        longitud: parseFloat(formData.longitud) || 0,
        
        nivel_tension_at: formData.nivel_tension_at,
        nivel_tension_mt: formData.nivel_tension_mt,
        nivel_tension_bt: formData.nivel_tension_bt,
        nivel_tension_ap: formData.nivel_tension_ap,
        elem_transformador: formData.elem_transformador,
        elem_seccionador: formData.elem_seccionador,
        elem_corta_circuito: formData.elem_corta_circuito,
        elem_medidor: formData.elem_medidor,
        elem_bajante_electrico: formData.elem_bajante_electrico,
        tierra_electrica: formData.tierra_electrica,
        
        poste_material: formData.poste_material,
        poste_altura: formData.poste_altura,
        poste_resistencia: formData.poste_resistencia,
        poste_uso_carga: formData.poste_uso_carga,
        poste_retenida: formData.poste_retenida,
        poste_estado: formData.poste_estado,
        
        telp_pas_cables: parseInt(formData.telp_pas_cables) || 0,
        telp_pas_c_coaxial: parseInt(formData.telp_pas_c_coaxial) || 0,
        telp_pas_c_fibra: parseInt(formData.telp_pas_c_fibra) || 0,
        telp_pas_c_drop: parseInt(formData.telp_pas_c_drop) || 0,
        telp_pas_c_rg11: parseInt(formData.telp_pas_c_rg11) || 0,
        telp_pas_cajempalme: parseInt(formData.telp_pas_cajempalme) || 0,
        telp_pas_cajgpon: parseInt(formData.telp_pas_cajgpon) || 0,
        telp_pas_stp: parseInt(formData.telp_pas_stp) || 0,
        telp_pas_bajantes: parseInt(formData.telp_pas_bajantes) || 0,
        telp_pas_reservas: parseInt(formData.telp_pas_reservas) || 0,
        
        telp_act_amplificadores: parseInt(formData.telp_act_amplificadores) || 0,
        telp_act_fuentes: parseInt(formData.telp_act_fuentes) || 0,
        telp_act_nodooptico: parseInt(formData.telp_act_nodooptico) || 0,
        telp_act_antena: parseInt(formData.telp_act_antena) || 0,
        telp_act_camara_vigil: parseInt(formData.telp_act_camara_vigil) || 0,
        
        telp_mth_retencion: parseInt(formData.telp_mth_retencion) || 0,
        telp_mth_suspencion: parseInt(formData.telp_mth_suspencion) || 0,
        telp_retencion: parseInt(formData.telp_retencion) || 0,
        telp_ccoaxial: parseInt(formData.telp_ccoaxial) || 0,
        telp_cfibra: parseInt(formData.telp_cfibra) || 0,
        
        fijacion_herraje: formData.fijacion_herraje,
        observacion_tendido: formData.observacion_tendido,
        observaciones: formData.observaciones,
        
        checkboxes_tendido: checkboxesTendido,
        checkboxes_sugerencias: checkboxesSugerencias
      }

      await factibilidadService.actualizar(factibilidadIdEditar, datosAEnviar)
      setMensaje({ tipo: 'success', texto: '✅ Factibilidad actualizada exitosamente' })

      setTimeout(() => {
        localStorage.removeItem('editarFactibilidadId')
        setModoEdicion(false)
        if (setCurrentPage) setCurrentPage('factibilidad')
      }, 2000)
    } catch (error) {
      console.error('Error al actualizar:', error)
      setMensaje({ 
        tipo: 'error', 
        texto: 'Error al actualizar: ' + (error.message || 'Error desconocido') 
      })
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000)
    } finally {
      setGuardando(false)
    }
  }

  const handleCancelarEdicion = () => {
    if (window.confirm('⚠️ ¿Desea cancelar la edición y crear un nuevo registro?\n\nLos cambios no guardados se perderán.')) {
      localStorage.removeItem('editarFactibilidadId')
      window.location.reload()
    }
  }

  const handleRestablecer = () => {
    if (window.confirm('¿Está seguro de que desea restablecer el formulario?')) {
      window.location.reload()
    }
  }
  return (
    <div className="agregar-factibilidad-page">
      {cargando && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Cargando factibilidad...</p>
        </div>
      )}

      {mensaje.texto && (
        <div className={`mensaje-estado mensaje-${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {paso === 1 && !modoEdicion && (
        <div>
          <h2 className="page-title">Configuración de Factibilidad</h2>
          
          <section className="form-section">
            <div className="section-content section-amarillo">
              <div className="form-grid form-grid-4">
                <div className="form-group">
                  <label>Proyecto: <span className="required">*</span></label>
                  <select 
                    value={datosCompartidos.proyecto_id} 
                    onChange={(e) => setDatosCompartidos(prev => ({ ...prev, proyecto_id: e.target.value }))}
                  >
                    <option value="">Seleccione...</option>
                    {proyectos.map(proyecto => (
                      <option key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Empresa: <span className="required">*</span></label>
                  <select 
                    value={datosCompartidos.empresa_id} 
                    onChange={(e) => setDatosCompartidos(prev => ({ ...prev, empresa_id: e.target.value }))}
                    disabled
                  >
                    <option value="">Seleccione...</option>
                    {empresas.map(empresa => (
                      <option key={empresa.id} value={empresa.id}>{empresa.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
    <label>Operador: <span className="required">*</span></label>
    <select 
      value={datosCompartidos.operador_id} 
      onChange={(e) => setDatosCompartidos(prev => ({ ...prev, operador_id: e.target.value }))}
      disabled
    >
      <option value="">Seleccione...</option>
      {operadores.map(operador => (
        <option key={operador.id} value={operador.id}>{operador.nombre}</option>
      ))}
    </select>
  </div>
                
                <div className="form-group">
                  <label>Ciudad: <span className="required">*</span></label>
                  <select 
                    value={datosCompartidos.ciudad_id} 
                    onChange={(e) => setDatosCompartidos(prev => ({ ...prev, ciudad_id: e.target.value }))}
                    disabled
                  >
                    <option value="">Seleccione...</option>
                    {ciudades.map(ciudad => (
                      <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid form-grid-2" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Cantidad de Postes: <span className="required">*</span></label>
                  <input 
                    type="number" 
                    min="1" 
                    max="50" 
                    value={cantidadPostes}
                    onChange={(e) => setCantidadPostes(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button 
                  className="btn-guardar" 
                  onClick={iniciarFactibilidad}
                  disabled={!datosCompartidos.proyecto_id || guardando}
                >
                  Iniciar Registro de Postes
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {paso === 2 && (
        <div>
          <div className="header-section">
            <h2 className="page-title">
              {modoEdicion ? '✏️ EDITAR FACTIBILIDAD' : `Poste ${posteActual + 1} de ${cantidadPostes}`}
            </h2>
            
            {modoEdicion && (
              <button 
                className="btn-nuevo-top" 
                onClick={handleCancelarEdicion}
                disabled={guardando}
              >
                ➕ Nuevo Registro
              </button>
            )}
          </div>

          {!modoEdicion && (
            <div style={{ backgroundColor: '#e0f2fe', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', border: '2px solid #0284c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>Proyecto:</strong> {proyectos.find(p => p.id === parseInt(datosCompartidos.proyecto_id))?.nombre || 'N/A'}</div>
                <div><strong>Empresa:</strong> {empresas.find(e => e.id === parseInt(datosCompartidos.empresa_id))?.nombre || 'N/A'}</div>
                <div><strong>Operador:</strong> {operadores.find(o => o.id === parseInt(datosCompartidos.operador_id))?.nombre || 'N/A'}</div>
                <div><strong>Ciudad:</strong> {ciudades.find(c => c.id === parseInt(datosCompartidos.ciudad_id))?.nombre || 'N/A'}</div>
              </div>
              <div style={{ marginTop: '0.5rem', height: '8px', backgroundColor: '#cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((posteActual + 1) / cantidadPostes) * 100}%`, backgroundColor: '#0284c7', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>
          )}
          <section className={`form-section collapsible ${getEstadoSeccion('identificacion')}`}>
            <h3 
              className="section-title clickable" 
              onClick={() => toggleSeccion('identificacion')}
            >
              <span className={`arrow ${seccionesAbiertas.identificacion ? 'open' : ''}`}>▶</span>
              1. IDENTIFICACIÓN
              <span className="status-indicator"></span>
            </h3>
            
            {seccionesAbiertas.identificacion && (
              <div className="section-content section-amarillo">
                {modoEdicion && (
                  <div className="form-grid form-grid-4" style={{ marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label>Proyecto:</label>
                      <select value={datosCompartidos.proyecto_id} disabled>
                        <option value="">Seleccione...</option>
                        {proyectos.map(proyecto => (
                          <option key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Empresa:</label>
                      <select value={datosCompartidos.empresa_id} disabled>
                        <option value="">Seleccione...</option>
                        {empresas.map(empresa => (
                          <option key={empresa.id} value={empresa.id}>{empresa.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
      <label>Operador:</label>
      <select value={datosCompartidos.operador_id} disabled>
        <option value="">Seleccione...</option>
        {operadores.map(operador => (
          <option key={operador.id} value={operador.id}>{operador.nombre}</option>
        ))}
      </select>
    </div>
                    
                    <div className="form-group">
                      <label>Ciudad:</label>
                      <select value={datosCompartidos.ciudad_id} disabled>
                        <option value="">Seleccione...</option>
                        {ciudades.map(ciudad => (
                          <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Barrio:</label>
                    <select 
                      value={formData.barrio_id} 
                      onChange={(e) => handleInputChange('barrio_id', e.target.value)}
                      disabled={!datosCompartidos.ciudad_id}
                    >
                      <option value="">{!datosCompartidos.ciudad_id ? 'Primero seleccione una ciudad' : 'Seleccione...'}</option>
                      {barrios.map(barrio => (
                        <option key={barrio.id} value={barrio.id}>{barrio.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid form-grid-direccion-especial">
                  <div className="form-group form-group-direccion">
                    <label>Dirección:</label>
                    <div className="direccion-inputs">
                      <select 
                        value={formData.direccion_via} 
                        onChange={(e) => handleInputChange('direccion_via', e.target.value)}
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
                      <input 
                        type="text" 
                        placeholder="Número"
                        value={formData.direccion_numero}
                        onChange={(e) => handleInputChange('direccion_numero', e.target.value)}
                      />
                      <select 
                        value={formData.direccion_coordenada} 
                        onChange={(e) => handleInputChange('direccion_coordenada', e.target.value)}
                      >
                        <option value=""></option>
                        <option value="N">N</option>
                        <option value="S">S</option>
                        <option value="E">E</option>
                        <option value="O">O</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>#Poste en plano:</label>
                    <input 
                      type="text" 
                      value={formData.poste_plano}
                      onChange={(e) => handleInputChange('poste_plano', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Codigo poste:</label>
                    <input 
                      type="text" 
                      value={formData.codigo_poste}
                      onChange={(e) => handleInputChange('codigo_poste', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo de cable:</label>
                    <select 
                      value={formData.tipo_cable}
                      onChange={(e) => handleInputChange('tipo_cable', e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="COAXIAL">COAXIAL</option>
                      <option value="FIBRA">FIBRA</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Latitud:</label>
                    <input 
                      type="text" 
                      placeholder="Ej: 7.889391"
                      value={formData.latitud}
                      onChange={(e) => handleInputChange('latitud', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitud:</label>
                    <input 
                      type="text" 
                      placeholder="Ej: -72.495496"
                      value={formData.longitud}
                      onChange={(e) => handleInputChange('longitud', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
          <section className={`form-section collapsible ${getEstadoSeccion('redElectrica')}`}>
            <h3 
              className="section-title clickable" 
              onClick={() => toggleSeccion('redElectrica')}
            >
              <span className={`arrow ${seccionesAbiertas.redElectrica ? 'open' : ''}`}>▶</span>
              2. RED ELÉCTRICA
              <span className="status-indicator"></span>
            </h3>
            
            {seccionesAbiertas.redElectrica && (
              <div className="section-content">
                <div className="form-row">
                  <div className="form-group-inline">
                    <label>Nivel tensión:</label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.nivel_tension_at}
                        onChange={(e) => handleInputChange('nivel_tension_at', e.target.checked)}
                      /> AT
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.nivel_tension_mt}
                        onChange={(e) => handleInputChange('nivel_tension_mt', e.target.checked)}
                      /> MT
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.nivel_tension_bt}
                        onChange={(e) => handleInputChange('nivel_tension_bt', e.target.checked)}
                      /> BT
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.nivel_tension_ap}
                        onChange={(e) => handleInputChange('nivel_tension_ap', e.target.checked)}
                      /> AP
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group-inline">
                    <label>Elementos existentes:</label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.elem_transformador}
                        onChange={(e) => handleInputChange('elem_transformador', e.target.checked)}
                      /> Transformador
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.elem_seccionador}
                        onChange={(e) => handleInputChange('elem_seccionador', e.target.checked)}
                      /> Seccionador
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.elem_corta_circuito}
                        onChange={(e) => handleInputChange('elem_corta_circuito', e.target.checked)}
                      /> Corta circuito
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.elem_medidor}
                        onChange={(e) => handleInputChange('elem_medidor', e.target.checked)}
                      /> Medidor
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.elem_bajante_electrico}
                        onChange={(e) => handleInputChange('elem_bajante_electrico', e.target.checked)}
                      /> Bajante eléctrico
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group-inline">
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.tierra_electrica}
                        onChange={(e) => handleInputChange('tierra_electrica', e.target.checked)}
                      /> Tierra eléctrica
                    </label>
                  </div>
                </div>
              </div>
            )}
          </section>
          <section className={`form-section collapsible ${getEstadoSeccion('poste')}`}>
            <h3 
              className="section-title clickable" 
              onClick={() => toggleSeccion('poste')}
            >
              <span className={`arrow ${seccionesAbiertas.poste ? 'open' : ''}`}>▶</span>
              3. POSTE
              <span className="status-indicator"></span>
            </h3>
            
            {seccionesAbiertas.poste && (
              <div className="section-content">
                <div className="form-grid form-grid-3">
                  <div className="form-group">
                    <label>Material:</label>
                    <select 
                      value={formData.poste_material} 
                      onChange={(e) => handleInputChange('poste_material', e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="CONCRETO">CONCRETO</option>
                      <option value="FIBRA DE VIDRIO">FIBRA DE VIDRIO</option>
                      <option value="MADERA">MADERA</option>
                      <option value="METALICO">METALICO</option>
                      <option value="RIEL">RIEL</option>
                      <option value="TORRE">TORRE</option>
                      <option value="TORRECILLA">TORRECILLA</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Altura:</label>
                    <select 
                      value={formData.poste_altura} 
                      onChange={(e) => handleInputChange('poste_altura', e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="14">14</option>
                      <option value="16">16</option>
                      <option value="18">18</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Resistencia:</label>
                    <select 
                      value={formData.poste_resistencia} 
                      onChange={(e) => handleInputChange('poste_resistencia', e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="510">510</option>
                      <option value="750">750</option>
                      <option value="1050">1050</option>
                      <option value="1350">1350</option>
                      <option value="2000">2000</option>
                      <option value="3000">3000</option>
                      <option value="5000">5000</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Uso por carga:</label>
                    <select 
                      value={formData.poste_uso_carga} 
                      onChange={(e) => handleInputChange('poste_uso_carga', e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="ANGULO">ANGULO</option>
                      <option value="CONTINUIDAD">CONTINUIDAD</option>
                      <option value="RETENSION">RETENSION</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Retenida existente:</label>
                    <select 
                      value={formData.poste_retenida} 
                      onChange={(e) => handleInputChange('poste_retenida', e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>

                <div className="form-row" style={{marginTop: '1rem'}}>
                  <div className="form-group">
                    <label>Estado del poste:</label>
                    <select 
                      value={formData.poste_estado} 
                      onChange={(e) => handleInputChange('poste_estado', e.target.value)}
                      style={{width: '300px'}}
                    >
                      <option value="">Seleccione...</option>
                      <option value="Inclinado">Inclinado</option>
                      <option value="Flectado">Flectado</option>
                      <option value="Fracturado">Fracturado</option>
                      <option value="Hierro en la base">Hierro en la base</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </section>
          <section className={`form-section collapsible ${getEstadoSeccion('elementosProyectados')}`}>
            <h3 
              className="section-title clickable" 
              onClick={() => toggleSeccion('elementosProyectados')}
            >
              <span className={`arrow ${seccionesAbiertas.elementosProyectados ? 'open' : ''}`}>▶</span>
              4. ELEMENTOS TELECOMUNICACIÓN PROYECTADOS
              <span className="status-indicator"></span>
            </h3>
            
            {seccionesAbiertas.elementosProyectados && (
              <div className="section-content">
                <div className="subsection subsection-azul">
                  <h4 className="subsection-title">PASIVOS</h4>
                  <div className="form-grid form-grid-4">
                    <div className="form-group">
                      <label>Cables:</label>
                      <select 
                        value={formData.telp_pas_cables} 
                        onChange={(e) => handleInputChange('telp_pas_cables', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Cajas empalme:</label>
                      <select 
                        value={formData.telp_pas_cajempalme} 
                        onChange={(e) => handleInputChange('telp_pas_cajempalme', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Cajas GPON:</label>
                      <select 
                        value={formData.telp_pas_cajgpon} 
                        onChange={(e) => handleInputChange('telp_pas_cajgpon', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>STP:</label>
                      <select 
                        value={formData.telp_pas_stp} 
                        onChange={(e) => handleInputChange('telp_pas_stp', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Bajantes:</label>
                      <select 
                        value={formData.telp_pas_bajantes} 
                        onChange={(e) => handleInputChange('telp_pas_bajantes', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Reservas:</label>
                      <select 
                        value={formData.telp_pas_reservas} 
                        onChange={(e) => handleInputChange('telp_pas_reservas', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="subsection subsection-azul">
                  <h4 className="subsection-title">ACTIVOS</h4>
                  <div className="form-grid form-grid-3">
                    <div className="form-group">
                      <label>Amplificadores:</label>
                      <select 
                        value={formData.telp_act_amplificadores} 
                        onChange={(e) => handleInputChange('telp_act_amplificadores', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Fuentes:</label>
                      <select 
                        value={formData.telp_act_fuentes} 
                        onChange={(e) => handleInputChange('telp_act_fuentes', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Nodo óptico:</label>
                      <select 
                        value={formData.telp_act_nodooptico} 
                        onChange={(e) => handleInputChange('telp_act_nodooptico', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Antena:</label>
                      <select 
                        value={formData.telp_act_antena} 
                        onChange={(e) => handleInputChange('telp_act_antena', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Cámara vigilancia:</label>
                      <select 
                        value={formData.telp_act_camara_vigil} 
                        onChange={(e) => handleInputChange('telp_act_camara_vigil', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="subsection subsection-amarillo">
                  <h4 className="subsection-title">MÉTODO DE TENDIDO</h4>
                  <div className="form-grid form-grid-3">
                    <div className="form-group">
                      <label>Retención:</label>
                      <select 
                        value={formData.telp_mth_retencion} 
                        onChange={(e) => handleInputChange('telp_mth_retencion', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Suspensión:</label>
                      <select 
                        value={formData.telp_mth_suspencion} 
                        onChange={(e) => handleInputChange('telp_mth_suspencion', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Retenida:</label>
                      <select 
                        value={formData.telp_retencion} 
                        onChange={(e) => handleInputChange('telp_retencion', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>C. Coaxial:</label>
                      <select 
                        value={formData.telp_ccoaxial} 
                        onChange={(e) => handleInputChange('telp_ccoaxial', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>C. Fibra:</label>
                      <select 
                        value={formData.telp_cfibra} 
                        onChange={(e) => handleInputChange('telp_cfibra', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-grid form-grid-2" style={{marginTop: '1rem'}}>
                  <div className="form-group">
                    <label>Fijación Herraje:</label>
                    <select 
                      value={formData.fijacion_herraje}
                      onChange={(e) => handleInputChange('fijacion_herraje', e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      <option value="CONTINUIDAD">CONTINUIDAD</option>
                      <option value="RETENCION">RETENCION</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Observación del Tendido:</label>
                    <textarea 
                      value={formData.observacion_tendido}
                      onChange={(e) => handleInputChange('observacion_tendido', e.target.value)}
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <div className="form-row" style={{marginTop: '1rem'}}>
                  <div className="form-group-inline">
                    <label>Observaciones del tendido:</label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkYaExisteActivo}
                        onChange={(e) => handleInputChange('checkYaExisteActivo', e.target.checked)}
                      /> Ya existe activo
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkDiagonalNoPermitida}
                        onChange={(e) => handleInputChange('checkDiagonalNoPermitida', e.target.checked)}
                      /> Diagonal no permitida
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkSinContinuidad}
                        onChange={(e) => handleInputChange('checkSinContinuidad', e.target.checked)}
                      /> Sin continuidad
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkCruceProhibido}
                        onChange={(e) => handleInputChange('checkCruceProhibido', e.target.checked)}
                      /> Cruce prohibido
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkCompensarCarga}
                        onChange={(e) => handleInputChange('checkCompensarCarga', e.target.checked)}
                      /> Compensar carga
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkTransicionOperador}
                        onChange={(e) => handleInputChange('checkTransicionOperador', e.target.checked)}
                      /> Transición de operador
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkIngresoCliente}
                        onChange={(e) => handleInputChange('checkIngresoCliente', e.target.checked)}
                      /> Ingreso a cliente
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkNoCumpleAltura}
                        onChange={(e) => handleInputChange('checkNoCumpleAltura', e.target.checked)}
                      /> No cumple altura
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkMas8Cables}
                        onChange={(e) => handleInputChange('checkMas8Cables', e.target.checked)}
                      /> Más de 8 cables
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkFaltaPoste}
                        onChange={(e) => handleInputChange('checkFaltaPoste', e.target.checked)}
                      /> Falta poste
                    </label>
                  </div>
                </div>
              </div>
            )}
          </section>
          <section className={`form-section collapsible ${getEstadoSeccion('observaciones')}`}>
            <h3 
              className="section-title clickable" 
              onClick={() => toggleSeccion('observaciones')}
            >
              <span className={`arrow ${seccionesAbiertas.observaciones ? 'open' : ''}`}>▶</span>
              5. OBSERVACIONES
              <span className="status-indicator"></span>
            </h3>
            
            {seccionesAbiertas.observaciones && (
              <div className="section-content">
                <div className="form-group">
                  <label>Observaciones Generales:</label>
                  <textarea 
                    value={formData.observaciones}
                    onChange={(e) => handleInputChange('observaciones', e.target.value)}
                    rows="4"
                    placeholder="Escriba aquí las observaciones generales..."
                  ></textarea>
                </div>

                <div className="form-row" style={{marginTop: '1rem'}}>
                  <div className="form-group-inline">
                    <label>Sugerencias:</label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkCambiarUbicacion}
                        onChange={(e) => handleInputChange('checkCambiarUbicacion', e.target.checked)}
                      /> Cambiar ubicación
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkCambiarRuta}
                        onChange={(e) => handleInputChange('checkCambiarRuta', e.target.checked)}
                      /> Cambiar ruta
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkPosteApoyo}
                        onChange={(e) => handleInputChange('checkPosteApoyo', e.target.checked)}
                      /> Poste de apoyo
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkIncluirCartera}
                        onChange={(e) => handleInputChange('checkIncluirCartera', e.target.checked)}
                      /> Incluir en cartera
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkColocarRetenida}
                        onChange={(e) => handleInputChange('checkColocarRetenida', e.target.checked)}
                      /> Colocar retenida
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkCambioNivel}
                        onChange={(e) => handleInputChange('checkCambioNivel', e.target.checked)}
                      /> Cambio de nivel
                    </label>
                    <label className="checkbox-inline">
                      <input 
                        type="checkbox"
                        checked={formData.checkPosteSaturado}
                        onChange={(e) => handleInputChange('checkPosteSaturado', e.target.checked)}
                      /> Poste saturado
                    </label>
                  </div>
                </div>
              </div>
            )}
          </section>
          {!modoEdicion && (
            <div className="botones-navegacion" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button 
                className="btn-secundario" 
                onClick={volverPosteAnterior}
                disabled={guardando}
              >
                {posteActual === 0 ? '← Volver a Configuración' : '← Poste Anterior'}
              </button>
              
              <button 
                className="btn-guardar" 
                onClick={continuarSiguientePoste}
                disabled={guardando}
              >
                {posteActual === cantidadPostes - 1 ? 'Ir a Revisión →' : 'Siguiente Poste →'}
              </button>
            </div>
          )}

          {modoEdicion && (
            <div className="botones-accion" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                className="btn-guardar" 
                onClick={handleGuardarEdicion}
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button 
                className="btn-secundario" 
                onClick={handleRestablecer}
                disabled={guardando}
              >
                Restablecer
              </button>
            </div>
          )}
        </div>
      )}
      {paso === 3 && (
        <div>
          <h2 className="page-title">Revisión de {cantidadPostes} Postes</h2>
          
          <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', border: '2px solid #0284c7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div><strong>Proyecto:</strong> {proyectos.find(p => p.id === parseInt(datosCompartidos.proyecto_id))?.nombre || 'N/A'}</div>
              <div><strong>Empresa:</strong> {empresas.find(e => e.id === parseInt(datosCompartidos.empresa_id))?.nombre || 'N/A'}</div>
              <div><strong>Ciudad:</strong> {ciudades.find(c => c.id === parseInt(datosCompartidos.ciudad_id))?.nombre || 'N/A'}</div>
            </div>
            <p style={{ margin: 0, color: '#0369a1' }}>
              <strong>Total de postes a crear: {cantidadPostes}</strong>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {postes.map((poste, index) => (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '6px', 
                  padding: '1rem', 
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#0284c7', borderBottom: '2px solid #0284c7', paddingBottom: '0.5rem' }}>
                  Poste {index + 1}
                </h4>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Barrio:</strong> {barrios.find(b => b.id === parseInt(poste.barrio_id))?.nombre || 'N/A'}
                  </p>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Dirección:</strong> {poste.direccion_via} {poste.direccion_numero} {poste.direccion_coordenada}
                  </p>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>#Poste en plano:</strong> {poste.poste_plano || 'N/A'}
                  </p>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Código:</strong> {poste.codigo_poste || 'N/A'}
                  </p>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Tipo cable:</strong> {poste.tipo_cable || 'N/A'}
                  </p>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Coordenadas:</strong> {poste.latitud && poste.longitud ? `${poste.latitud}, ${poste.longitud}` : 'N/A'}
                  </p>
                </div>
                <button 
                  onClick={() => editarPosteDesdeRevision(index)}
                  style={{
                    marginTop: '0.75rem',
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#0284c7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                  disabled={guardando}
                >
                  ✏️ Editar
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #cbd5e1' }}>
            <button 
              className="btn-secundario" 
              onClick={() => {
                const nuevosPostes = [...postes]
                nuevosPostes[cantidadPostes - 1] = formData
                setPostes(nuevosPostes)
                setPaso(2)
                setPosteActual(cantidadPostes - 1)
                window.scrollTo(0, 0)
              }}
              disabled={guardando}
            >
              ← Volver al último poste
            </button>
            
            <button 
              className="btn-guardar" 
              onClick={guardarTodasFactibilidades}
              disabled={guardando}
              style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
            >
              {guardando ? 'Guardando...' : `💾 Guardar ${cantidadPostes} Factibilidades`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgregarFactibilidad