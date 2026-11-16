import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { crearUsuario, editarUsuario, obtenerUsuario } from '../services/usuariosApi.js'
const inicial={run:'',nombre:'',apellidos:'',correo:'',contrasena:'',fechaNacimiento:'',region:'',comuna:'',direccion:'',tipo:'CLIENTE'}
export default function AdminUsuarioFormulario({editar=false}) {
 const [params]=useSearchParams(), id=params.get('id'),navigate=useNavigate()
 const [datos,setDatos]=useState(inicial),[error,setError]=useState(''),[cargando,setCargando]=useState(editar),[guardando,setGuardando]=useState(false)
 useEffect(()=>{if(!editar)return;let vigente=true;obtenerUsuario(id).then(u=>{if(vigente)setDatos({...u,contrasena:''})}).catch(e=>{if(vigente)setError(e.message)}).finally(()=>{if(vigente)setCargando(false)});return()=>{vigente=false}},[editar,id])
 async function guardar(e) {
  e.preventDefault();setError('');setGuardando(true)
  try {const cuerpo={...datos,contrasena:datos.contrasena || null};if(editar)await editarUsuario(id,cuerpo);else await crearUsuario(cuerpo);navigate('/admin/usuarios')}
  catch(e){setError(e.message + (e.errores?.length?' '+e.errores.map(x=>`${x.campo}: ${x.mensaje}`).join('. '):''))}
  finally{setGuardando(false)}
 }
 if(cargando)return <p>Cargando usuario...</p>
 return <><h1>{editar?'Editar usuario':'Crear usuario'}</h1><form className="admin-form" onSubmit={guardar}>
 <div className="admin-form-grid">{[['run','RUN','text',15],['nombre','Nombre','text',50],['apellidos','Apellidos','text',100],['correo','Correo','email',100],['contrasena',editar?'Nueva contraseña (opcional)':'Contraseña','password',72],['fechaNacimiento','Fecha de nacimiento','date'],['region','Región','text',255],['comuna','Comuna','text',255],['direccion','Dirección','text',300]].map(([name,label,type,max])=><div className="admin-campo" key={name}><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} maxLength={max} minLength={name==='contrasena'?8:undefined} required={name!=='contrasena'||!editar} value={datos[name] || ''} onChange={e=>setDatos({...datos,[name]:e.target.value})}/></div>)}
 <div className="admin-campo"><label htmlFor="tipo">Rol</label><select id="tipo" value={datos.tipo} onChange={e=>setDatos({...datos,tipo:e.target.value})}>{['CLIENTE','VENDEDOR','ADMINISTRADOR'].map(r=><option key={r}>{r}</option>)}</select></div></div>
 {error && <p className="error" role="alert">{error}</p>}<button className="admin-boton" disabled={guardando}>{guardando?'Guardando...':'Guardar usuario'}</button> <Link to="/admin/usuarios">Cancelar</Link></form></>
}
