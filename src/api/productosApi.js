import { pedir } from './cliente.js'

const RUTA = '/api/v1/productos'

export const listarProductos = () => pedir(RUTA)

export const crearProducto = (producto) =>
  pedir(RUTA, { protegido: true, method: 'POST', body: JSON.stringify(producto) })

export const editarProducto = (id, producto) =>
  pedir(`${RUTA}/${encodeURIComponent(id)}`, { protegido: true, method: 'PUT', body: JSON.stringify(producto) })

export const desactivarProducto = (id) =>
  pedir(`${RUTA}/${encodeURIComponent(id)}`, { protegido: true, method: 'DELETE' })