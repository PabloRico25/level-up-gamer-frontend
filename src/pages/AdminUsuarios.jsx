import { Link } from 'react-router-dom'

import { useContext, useEffect, useState } from 'react'

import { SesionContext } from '../context/tiendaContext.js'

import {
  listarUsuarios,
  eliminarUsuario,
  cambiarRolUsuario
} from '../services/usuariosApi.js'

const roles = [
  { valor: 'CLIENTE', nombre: 'Cliente' },
  { valor: 'VENDEDOR', nombre: 'Vendedor' },
  { valor: 'ADMINISTRADOR', nombre: 'Administrador' }
]

function AdminUsuarios() {

  const { sesion, cargandoSesion } = useContext(SesionContext)

  const [usuarios, setUsuarios] = useState([])
  const [rolesSeleccionados, setRolesSeleccionados] = useState({})

  const [cargando, setCargando] = useState(true)
  const [guardandoId, setGuardandoId] = useState(null)

  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Obtener usuarios desde MySQL
  useEffect(() => {

    if (cargandoSesion || sesion?.tipo !== 'Administrador') {
      return
    }

    let activo = true

    async function cargarUsuarios() {

      setCargando(true)
      setError('')

      try {

        const datos = await listarUsuarios()

        if (activo) {
          setUsuarios(datos)
        }

      } catch (error) {

        if (activo) {
          setError(
            error.message || 'No se pudieron cargar los usuarios.'
          )
        }

      } finally {

        if (activo) {
          setCargando(false)
        }

      }
    }

    cargarUsuarios()

    return () => {
      activo = false
    }

  }, [cargandoSesion, sesion?.tipo])

  async function desactivar(usuario) {
    if(!window.confirm(`¿Desactivar a ${usuario.nombre}? Sus boletas se conservarán.`)) return
    setGuardandoId(usuario.id); setError('')
    try {await eliminarUsuario(usuario.id);setUsuarios(actual=>actual.filter(u=>u.id!==usuario.id));setMensaje('Usuario desactivado.')}
    catch(e){setError(e.message)}finally{setGuardandoId(null)}
  }
  // Seleccionar un nuevo rol
  function seleccionarRol(id, tipo) {

    setRolesSeleccionados(actual => ({
      ...actual,
      [id]: tipo
    }))

    setError('')
    setMensaje('')
  }

  // Guardar el cambio en Spring Boot
  async function guardarRol(usuario) {

    const nuevoRol =
      rolesSeleccionados[usuario.id] ?? usuario.tipo

    if (nuevoRol === usuario.tipo) {
      return
    }

    setGuardandoId(usuario.id)
    setError('')
    setMensaje('')

    try {

      const actualizado = await cambiarRolUsuario(
        usuario.id,
        nuevoRol
      )

      // Actualizar la tabla de React
      setUsuarios(actual =>
        actual.map(item =>
          item.id === usuario.id ? actualizado : item
        )
      )

      setRolesSeleccionados(actual => ({
        ...actual,
        [usuario.id]: actualizado.tipo
      }))

      setMensaje(
        `Rol de ${actualizado.nombre} actualizado correctamente.`
      )

    } catch (error) {

      setError(
        error.message || 'No se pudo cambiar el rol.'
      )

    } finally {

      setGuardandoId(null)

    }
  }

  // Esperar a comprobar la sesión
  if (cargandoSesion) {
    return <p>Verificando sesión...</p>
  }

  // Solo administradores
  if (sesion?.tipo !== 'Administrador') {
    return <p>No tienes permisos para ver los usuarios.</p>
  }

  return (
    <>

      <div className="admin-encabezado admin-encabezado-fila">

        <div>
          <p className="admin-etiqueta">
            GESTIÓN DE USUARIOS
          </p>

          <h1>Usuarios</h1><Link className="admin-boton" to="/admin/usuario-nuevo">Crear usuario</Link>
        </div>

      </div>

      {cargando && (
        <p className="p-4">
          Cargando usuarios...
        </p>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {mensaje && (
        <p className="registro-exitoso" role="status">
          {mensaje}
        </p>
      )}

      {!cargando && !error && usuarios.length === 0 && (
        <p className="p-4">
          No hay usuarios registrados.
        </p>
      )}

      {!cargando && usuarios.length > 0 && (

        <div className="admin-tabla-contenedor">

          <table className="admin-tabla">

            <thead>
              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>

              {usuarios.map(usuario => {

                const rolActual =
                  rolesSeleccionados[usuario.id] ?? usuario.tipo

                const esMiCuenta =
                  usuario.id === sesion.id

                const sinCambios =
                  rolActual === usuario.tipo

                return (

                  <tr key={usuario.id}>

                    <td>{usuario.run}</td>

                    <td>
                      {usuario.nombre} {usuario.apellidos}
                    </td>

                    <td>{usuario.correo}</td>

                    <td>

                      <select
                        aria-label={`Rol de ${usuario.nombre}`}
                        value={rolActual}
                        disabled={
                          guardandoId !== null || esMiCuenta
                        }
                        onChange={e =>
                          seleccionarRol(
                            usuario.id,
                            e.target.value
                          )
                        }
                      >

                        {roles.map(rol => (
                          <option
                            key={rol.valor}
                            value={rol.valor}
                          >
                            {rol.nombre}
                          </option>
                        ))}

                      </select>

                    </td>

                    <td>

                      <Link className="admin-accion" to={`/admin/usuario-detalle?id=${usuario.id}`}>Ver</Link>
                      <Link className="admin-accion" to={`/admin/usuario-editar?id=${usuario.id}`}>Editar</Link>
                      <button type="button" className="admin-accion-eliminar" disabled={guardandoId!==null||esMiCuenta} onClick={()=>desactivar(usuario)}>Desactivar</button>
                      <button
                        type="button"
                        className="admin-accion"
                        disabled={
                          sinCambios ||
                          esMiCuenta ||
                          guardandoId !== null
                        }
                        onClick={() => guardarRol(usuario)}
                      >

                        {guardandoId === usuario.id
                          ? 'Guardando...'
                          : 'Guardar'}

                      </button>

                    </td>

                  </tr>

                )
              })}

            </tbody>

          </table>

        </div>

      )}

    </>
  )
}

export default AdminUsuarios
