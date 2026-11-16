import { obtenerAccessToken, renovarSesion } from '../services/authApi.js'
const BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
export class ErrorApi extends Error {
 constructor(estado,mensaje,errores=[]) {super(mensaje);this.estado=estado;this.errores=errores}
}
export async function pedir(ruta, opciones={}) {
 const { protegido=false, ...config }=opciones
 const enviar=()=>fetch(`${BASE}${ruta}`,{...config,headers:{'Content-Type':'application/json',...(protegido && obtenerAccessToken()?{Authorization:`Bearer ${obtenerAccessToken()}`} : {}),...config.headers}})
 let respuesta
 try { respuesta=await enviar() } catch {throw new ErrorApi(0,'No se pudo conectar con el servidor. Revisa que el backend esté encendido.')}
 if(protegido && respuesta.status===401) {
  await renovarSesion()
  try {respuesta=await enviar()} catch {throw new ErrorApi(0,'No se pudo conectar con el servidor.')}
 }
 if(respuesta.status===204) return null
 const cuerpo=await respuesta.json().catch(()=>null)
 if(!respuesta.ok) throw new ErrorApi(respuesta.status,cuerpo?.message || 'Ocurrió un error en el servidor.',cuerpo?.errores || [])
 return cuerpo
}
