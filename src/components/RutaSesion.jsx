import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { SesionContext } from '../context/tiendaContext.js'
export default function RutaSesion({children}) {
 const {sesion,cargandoSesion}=useContext(SesionContext)
 if(cargandoSesion) return <p className="container py-5">Recuperando sesión...</p>
 if(!sesion) return <Navigate to="/login" replace />
 if(sesion.tipo==='Vendedor') return <Navigate to="/admin/boletas" replace />
 return children
}
