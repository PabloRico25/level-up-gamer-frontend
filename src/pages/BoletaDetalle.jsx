import { useEffect, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { obtenerBoleta } from '../api/boletasApi.js'
import { formatoPrecio } from '../utils/tienda.js'
export default function BoletaDetalle({admin=false}) {
 const params=useParams(),[query]=useSearchParams(),location=useLocation()
 const id=params.id || query.get('id')
 const [resultado,setResultado]=useState(null)
 const boleta=resultado?.id===id ? resultado.boleta : null
 const error=resultado?.id===id ? resultado.error : ''
 useEffect(()=>{let vigente=true;obtenerBoleta(id).then(boleta=>{if(vigente)setResultado({id,boleta,error:''})}).catch(e=>{if(vigente)setResultado({id,boleta:null,error:e.message})});return()=>{vigente=false}},[id])
 return <section className="container py-5"><h1>Boleta #{id}</h1>
 {location.state?.compraConfirmada && <p role="status">Compra completada correctamente. Tu boleta quedó registrada.</p>}
 {error && <p role="alert">{error}</p>}{!boleta && !error && <p>Cargando...</p>}
 {boleta && <><p>Fecha: {(boleta.fecha || boleta.fechaEmision)?.replace('T',' ')}</p><div className="admin-tabla-contenedor"><table className="admin-tabla"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio de compra</th><th>Subtotal</th></tr></thead><tbody>{boleta.items.map(i=><tr key={i.productoId}><td>{i.productoId}</td><td>{i.cantidad}</td><td>{formatoPrecio(i.precioUnitario)}</td><td>{formatoPrecio(i.subtotal)}</td></tr>)}</tbody></table></div><p>Subtotal: {formatoPrecio(boleta.subtotal)}</p><p>Descuento: {formatoPrecio(boleta.descuento)}</p><h2>Total: {formatoPrecio(boleta.total)}</h2></>}
 <Link to={admin?'/admin/boletas':'/mis-compras'}>Volver a las compras</Link></section>
}
