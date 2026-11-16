
import { useContext } from 'react'
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom'

import { SesionContext } from '../context/tiendaContext.js'

function AdminLayout() {

  const { sesion, cargandoSesion } = useContext(SesionContext)
  const { pathname } = useLocation()

  // Esperar mientras se recupera la sesión
  if (cargandoSesion) {
    return (
      <main className="admin-contenido">
        <p>Verificando permisos...</p>
      </main>
    )
  }

  // Sin sesión: ir al login
  if (!sesion) {
    return <Navigate to="/login" replace />
  }

  const esAdministrador = sesion.tipo === 'Administrador'
  const esVendedor = sesion.tipo === 'Vendedor'

  // Los clientes no pueden acceder al panel
  if (!esAdministrador && !esVendedor) {
    return <Navigate to="/" replace />
  }

  // Rutas que puede consultar un vendedor
  const rutasVendedor = [
    '/admin/productos',
    '/admin/producto-detalle',
    '/admin/boletas',
    '/admin/boleta-detalle'
  ]

  // El vendedor solo puede entrar a esas rutas
  if (
    esVendedor &&
    !rutasVendedor.includes(pathname)
  ) {
    return <Navigate to="/admin/productos" replace />
  }

  return (
    <div className="admin-layout">

      <aside className="admin-menu">

        <Link to="/admin" className="admin-logo">
          <span>LEVEL-UP</span>
          <small>ADMIN</small>
        </Link>

        <nav className="admin-nav">

          {/* Solo administrador */}
          {esAdministrador && (
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive ? 'activo' : ''
              }
            >
              Inicio
            </NavLink>
          )}

          {/* Administrador y vendedor */}
          <NavLink
            to="/admin/productos"
            className={({ isActive }) =>
              isActive ? 'activo' : ''
            }
          >
            Productos
          </NavLink>

          <NavLink to="/admin/boletas">Órdenes</NavLink>
          {/* Solo administrador */}
          {esAdministrador && (
            <NavLink
              to="/admin/usuarios"
              className={({ isActive }) =>
                isActive ? 'activo' : ''
              }
            >
              Usuarios
            </NavLink>
          )}

        </nav>

        <Link to="/" className="admin-volver">
          ← Volver a la tienda
        </Link>

      </aside>

      <main className="admin-contenido">
        <Outlet />
      </main>

    </div>
  )
}

export default AdminLayout
