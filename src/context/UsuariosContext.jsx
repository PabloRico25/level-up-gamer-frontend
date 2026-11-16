
import { useEffect, useRef, useState } from 'react'

import {
  iniciarSesion as loginApi,
  renovarSesion,
  obtenerMiPerfil,
  cerrarSesion as logoutApi
} from '../services/authApi.js'

import { SesionContext } from './tiendaContext.js'

// Adaptar roles de Spring Boot a React
function adaptarUsuario(usuario) {

  if (!usuario) return null

  const roles = {
    ADMINISTRADOR: 'Administrador',
    VENDEDOR: 'Vendedor',
    CLIENTE: 'Cliente'
  }

  return {
    ...usuario,
    tipo: roles[usuario.tipo] || usuario.tipo
  }
}

export function UsuariosProvider({ children }) {

  const [sesion, setSesion] = useState(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)

  const restauracionRef = useRef(null)
  const revisionRef = useRef(0)

  useEffect(() => {
    const invalidar=()=>setSesion(null)
    window.addEventListener('sesion-invalida',invalidar)
    return ()=>window.removeEventListener('sesion-invalida',invalidar)
  }, [])

  // Recuperar sesión al abrir la página
  useEffect(() => {

    let activo = true
    const revision = revisionRef.current

    if (!restauracionRef.current) {

      restauracionRef.current = (async () => {

        try {
          await renovarSesion()
          return await obtenerMiPerfil()
        } catch {
          return null
        }

      })()
    }

    restauracionRef.current
      .then(usuario => {

        if (activo && revisionRef.current === revision) {
          setSesion(adaptarUsuario(usuario))
        }

      })
      .finally(() => {

        if (activo) {
          setCargandoSesion(false)
        }

      })

    return () => {
      activo = false
    }

  }, [])

  const usuarioId = sesion?.id

  // Actualizar perfil al volver a la pestaña
  useEffect(() => {

    if (!usuarioId || cargandoSesion) return

    let activo = true
    const revision = revisionRef.current

    async function actualizarPerfil() {

      try {

        let usuario

        try {
          usuario = await obtenerMiPerfil()
        } catch {
          await renovarSesion()
          usuario = await obtenerMiPerfil()
        }

        if (activo && revisionRef.current === revision) {
          setSesion(adaptarUsuario(usuario))
        }

      } catch (error) {

        console.warn(
          'No se pudo actualizar el perfil:',
          error.message
        )

      }
    }

    window.addEventListener('focus', actualizarPerfil)

    return () => {
      activo = false
      window.removeEventListener('focus', actualizarPerfil)
    }

  }, [usuarioId, cargandoSesion])

  // Iniciar sesión con Spring Boot
  async function iniciarSesion(correo, contrasena) {

    revisionRef.current++
    const respuesta = await loginApi(correo, contrasena)

    setSesion(adaptarUsuario(respuesta.usuario))

    return respuesta
  }

  // Cerrar sesión
  async function cerrarSesion() {

    revisionRef.current++
    await logoutApi()
    setSesion(null)

  }

  return (
    <SesionContext.Provider value={{
      sesion,
      cargandoSesion,
      iniciarSesion,
      cerrarSesion
    }}>
      {children}
    </SesionContext.Provider>
  )
}
