import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarBoletas } from '../api/boletasApi.js'
import { formatoPrecio } from '../utils/tienda.js'
export default function Boletas({admin=false}) {
 const [boletas,setBoletas]=useState([]), [error,setError]=useState(''),[cargando,setCargando]=useState(true)
 useEffect(()=> {let vigente=true; listarBoletas().then(x=>{if(vigente)setBoletas(x)}).catch(e=>{if(vigente)setError(e.message)}).finally(()=>{if(vigente)setCargando(false)});return()=>{vigente=false}},[])
 return <section className="container py-5"><h1>{admin?'Órdenes':'Mis compras'}</h1>
 {cargando && <p>Cargando boletas...</p>}{error && <p role="alert">{error}</p>}
 {!cargando && !error && !boletas.length && <p>No hay compras registradas.</p>}
 {!!boletas.length && <div className="admin-tabla-contenedor"><table className="admin-tabla"><thead><tr><th>Boleta</th><th>Fecha</th><th>Total</th><th>Detalle</th></tr></thead><tbody>{boletas.map(b=><tr key={b.id}><td>#{b.id}</td><td>{(b.fecha || b.fechaEmision)?.replace('T',' ')}</td><td>{formatoPrecio(b.total)}</td><td><Link to={admin?`/admin/boleta-detalle?id=${b.id}`:`/boleta/${b.id}`}>Ver boleta</Link></td></tr>)}</tbody></table></div>}
 </section>
}
