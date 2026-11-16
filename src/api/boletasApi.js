import { pedir } from './cliente.js'
export const comprar=items=>pedir('/api/v1/boletas',{protegido:true,method:'POST',body:JSON.stringify({items:items.map(({id,cantidad})=>({productoId:id,cantidad}))})})
export const listarBoletas=()=>pedir('/api/v1/boletas',{protegido:true})
export const obtenerBoleta=id=>pedir(`/api/v1/boletas/${encodeURIComponent(id)}`,{protegido:true})
