
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ProductosContext,
  SesionContext
} from '../context/tiendaContext.js'

import { listarUsuarios } from '../services/usuariosApi.js'

function Admin() {

  const { productos } = useContext(ProductosContext)
  const { sesion } = useContext(SesionContext)

  const [cantidadUsuarios, setCantidadUsuarios] = useState(null)
  const [errorUsuarios, setErrorUsuarios] = useState('')

  // Consultar cantidad de usuarios desde MySQL
  useEffect(() => {

    if (sesion?.tipo !== 'Administrador') {
      return
    }

    let activo = true

    async function cargarUsuarios() {

      try {

        const usuarios = await listarUsuarios()

        if (activo) {
          setCantidadUsuarios(usuarios.length)
          setErrorUsuarios('')
        }

      } catch {

        if (activo) {
          setCantidadUsuarios(null)
          setErrorUsuarios(
            'No se pudo consultar la cantidad de usuarios.'
          )
        }

      }
    }

    cargarUsuarios()

    return () => {
      activo = false
    }

  }, [sesion?.tipo])

  // Productos con stock crítico
  const criticos = productos.filter(
    p =>
      p.stockCritico != null &&
      p.stock <= p.stockCritico
  )

  return (
    <>

      <div className="admin-encabezado">

        <p className="admin-etiqueta">
          PANEL DE ADMINISTRACIÓN
        </p>

        <h1>
          Hola, <span>{sesion?.nombre}</span>
        </h1>

        <p>
          Gestiona el catálogo y los usuarios de Level-Up Gamer.
        </p>

      </div>

      <div className="admin-resumen">

        {/* Total de productos */}
        <Link
          className="admin-tarjeta"
          to="/admin/productos"
        >
          <p className="admin-tarjeta-numero">
            {productos.length}
          </p>

          <p className="admin-tarjeta-texto">
            Productos
          </p>
        </Link>

        {/* Total de usuarios desde MySQL */}
        <Link
          className="admin-tarjeta"
          to="/admin/usuarios"
        >
          <p className="admin-tarjeta-numero">
            {cantidadUsuarios ?? '—'}
          </p>

          <p className="admin-tarjeta-texto">
            Usuarios registrados
          </p>
        </Link>

        {/* Productos con stock crítico */}
        <article className="admin-tarjeta">

          <p className="admin-tarjeta-numero">
            {criticos.length}
          </p>

          <p className="admin-tarjeta-texto">
            Productos en stock crítico
          </p>

        </article>

      </div>

      {errorUsuarios && (
        <p className="error" role="alert">
          {errorUsuarios}
        </p>
      )}

      {criticos.length > 0 && (

        <p className="admin-alerta-critico">
          Revisa el stock de:{' '}
          {criticos.map(p => p.nombre).join(', ')}.
        </p>

      )}

    </>
  )
}

export default Admin
