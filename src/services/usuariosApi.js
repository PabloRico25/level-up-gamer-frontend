import { pedir } from '../api/cliente.js'
const ruta='/api/v1/usuarios'
export const listarUsuarios=()=>pedir(ruta,{protegido:true})
export const obtenerUsuario=id=>pedir(`${ruta}/${encodeURIComponent(id)}`,{protegido:true})
export const crearUsuario=datos=>pedir(ruta,{protegido:true,method:'POST',body:JSON.stringify(datos)})
export const editarUsuario=(id,datos)=>pedir(`${ruta}/${encodeURIComponent(id)}`,{protegido:true,method:'PUT',body:JSON.stringify(datos)})
export const eliminarUsuario=id=>pedir(`${ruta}/${encodeURIComponent(id)}`,{protegido:true,method:'DELETE'})
export const cambiarRolUsuario=(id,tipo)=>pedir(`${ruta}/${encodeURIComponent(id)}/rol`,{protegido:true,method:'PATCH',body:JSON.stringify({tipo})})
