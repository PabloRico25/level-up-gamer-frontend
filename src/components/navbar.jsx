
import { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CarritoContext, SesionContext } from '../context/tiendaContext.js'

function Navbar() {

  const navigate = useNavigate()

  const { cantidadTotal } = useContext(CarritoContext)

  const {
    sesion,
    cargandoSesion,
    cerrarSesion
  } = useContext(SesionContext)

  const [cerrando, setCerrando] = useState(false)

  // Cerrar sesión mediante Spring Boot
  async function manejarCerrarSesion(e) {
    e.preventDefault()

    if (cerrando) return

    setCerrando(true)

    try {
      await cerrarSesion()
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      window.alert(
        'No se pudo confirmar el cierre de sesión en el servidor. Revisa tu conexión.'
      )
    } finally {
      setCerrando(false)
    }
  }

  return (
    <header>
      <nav className="navbar" aria-label="Menú principal">

        <Link to="/" className="logo">
          <span>LEVEL-UP</span>
          <small>GAMER</small>
        </Link>

        <div className="menu-principal">
          {sesion?.tipo !== 'Vendedor' && <NavLink to="/" end>Inicio</NavLink>}
          <NavLink to="/productos">Productos</NavLink>
          {sesion?.tipo !== 'Vendedor' && <><NavLink to="/nosotros">Nosotros</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/contacto">Contacto</NavLink></>}
        </div>

        <div className="menu-usuario">

          {cargandoSesion ? (

            <span>Verificando sesión...</span>

          ) : sesion ? (

            <div
              className="usuario-sesion"
              style={{ display: 'flex' }}
            >

              <span id="nombre-usuario">
                Hola, {sesion.nombre}
              </span>

              {(sesion.tipo === 'Administrador' ||
                sesion.tipo === 'Vendedor') && (
                <Link to="/admin">Panel</Link>
              )}

              {sesion.tipo !== 'Vendedor' && <Link to="/mis-compras">Mis compras</Link>}
              <Link
                to="/"
                id="cerrar-sesion"
                onClick={manejarCerrarSesion}
                aria-disabled={cerrando}
              >
                {cerrando ? 'Saliendo...' : 'Salir'}
              </Link>

            </div>

          ) : (

            <>
              <Link to="/login" id="link-ingresar">
                Ingresar
              </Link>

              <Link to="/registro" id="link-registro">
                Registrarse
              </Link>
            </>

          )}

          {sesion?.tipo !== 'Vendedor' && <Link
            to="/carrito"
            className="carrito"
            aria-label={`Carrito: ${cantidadTotal} productos`}
          >

            <svg
              className="carrito-icono"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M3 3h2l2.4 10.2a2 2 0 0 0 2 1.5h7.7a2 2 0 0 0 2-1.6L21 6H6" />
              <circle cx="10" cy="19" r="1" />
              <circle cx="18" cy="19" r="1" />
            </svg>

            <span id="contador-carrito">
              {cantidadTotal}
            </span>

          </Link>}

        </div>
      </nav>
    </header>
  )
}

export default Navbar
