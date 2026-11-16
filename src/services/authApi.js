const API_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
let accessToken = null
let renovacion = null
let generacion = 0
async function solicitar(ruta, opciones = {}) {
 const respuesta = await fetch(`${API_URL}/api/v1/auth${ruta}`, { ...opciones, credentials: 'include', headers: { 'Content-Type': 'application/json', ...opciones.headers } })
 const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null)
 if (!respuesta.ok) { const e = new Error(datos?.message || datos?.detail || 'No se pudo completar la autenticación'); e.estado = respuesta.status; throw e }
 return datos
}
export function registrarUsuario(datos) { return solicitar('/registro', {method:'POST',body:JSON.stringify(datos)}) }
export async function iniciarSesion(correo, contrasena) {
 const respuesta = await solicitar('/login', {method:'POST',body:JSON.stringify({correo,contrasena})})
 generacion++; accessToken=respuesta.accessToken; return respuesta
}
export function renovarSesion() {
 if (!renovacion) {
  const actual=generacion
  const renovar=async()=> {
   const respuesta=await solicitar('/refresh',{method:'POST',headers:{'X-Requested-With':'XMLHttpRequest'}})
   if(actual===generacion) accessToken=respuesta.accessToken
   return respuesta
  }
  // La cookie se comparte entre pestañas: serializar también en navegadores con Web Locks.
  renovacion=(globalThis.navigator?.locks ? navigator.locks.request('levelup-refresh',renovar) : renovar())
   .catch(e=> { if(e.estado===401 && actual===generacion) { accessToken=null; globalThis.dispatchEvent?.(new Event('sesion-invalida')) } throw e })
   .finally(()=> {renovacion=null})
 }
 return renovacion
}
export function obtenerMiPerfil() {
 if(!accessToken) return Promise.reject(new Error('No hay sesión activa'))
 return solicitar('/me',{headers:{Authorization:`Bearer ${accessToken}`}})
}
export async function cerrarSesion() {
 // Esperar renovación activa antes de revocar su cookie más reciente.
 if(renovacion) await renovacion.catch(()=>{})
 await solicitar('/logout',{method:'POST',headers:{'X-Requested-With':'XMLHttpRequest'}})
 generacion++; accessToken=null
}
export function obtenerAccessToken() { return accessToken }
