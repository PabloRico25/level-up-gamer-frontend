import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { obtenerUsuario } from '../services/usuariosApi.js'
export default function AdminUsuarioDetalle() {
 const [params]=useSearchParams(),id=params.get('id'),[usuario,setUsuario]=useState(null),[error,setError]=useState('')
 useEffect(()=>{let vigente=true;obtenerUsuario(id).then(u=>{if(vigente)setUsuario(u)}).catch(e=>{if(vigente)setError(e.message)});return()=>{vigente=false}},[id])
 return <><h1>Detalle de usuario</h1>{error&&<p role="alert">{error}</p>}{!usuario&&!error&&<p>Cargando...</p>}{usuario&&<><dl>{Object.entries(usuario).filter(([k])=>!['id','activo'].includes(k)).map(([k,v])=><div className="admin-detalle-dato" key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl><Link to={`/admin/usuario-editar?id=${usuario.id}`}>Editar</Link></>} <Link to="/admin/usuarios">Volver</Link></>
}
