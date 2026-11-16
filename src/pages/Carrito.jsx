import { comprar } from '../api/boletasApi.js'
import { useContext, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CarritoContext, ProductosContext, SesionContext } from '../context/tiendaContext.js'
import { calcularTotales, formatoPrecio } from '../utils/tienda.js'

function Carrito() {
  const { carrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito } = useContext(CarritoContext)
  const { productos, recargar } = useContext(ProductosContext)
  const { sesion } = useContext(SesionContext)
  const items = carrito.map(item => ({ ...productos.find(p => p.id === item.id), cantidad: item.cantidad }))
  const { subtotal, descuento, total } = calcularTotales(carrito, productos, sesion?.correo)
  const navigate = useNavigate()
  const [comprando, setComprando] = useState(false)
  const [errorCompra, setErrorCompra] = useState('')
  const bloqueo = useRef(false)
  async function finalizarCompra() {
    if (!items.length || bloqueo.current) return
    if (!sesion) { navigate('/login'); return }
    bloqueo.current = true; setComprando(true); setErrorCompra('')
    try {
      const boleta = await comprar(carrito)
      vaciarCarrito()
      await recargar()
      navigate(`/boleta/${boleta.id}`, { state: { compraConfirmada: true } })
    } catch (e) {
      setErrorCompra(e.message + ' El carrito se conserva. Si hubo un corte de conexión, revisa Mis compras antes de volver a confirmar.')
      await recargar()
    } finally { bloqueo.current = false; setComprando(false) }
  }
  if (sesion?.tipo === 'Vendedor') return <Navigate to="/admin/productos" replace />
  return (
    <main><section className="carrito-pagina">
      <div className="ruta-carrito"><Link to="/">Inicio</Link><span>/</span><span>Tu carrito</span></div>
      <h1>Tu carrito</h1>
      <div className="carrito-contenido">
        <div className="carrito-productos">
          <div id="lista-carrito">
            {items.length === 0 ? <p className="carrito-vacio">Tu carrito está vacío.</p> : items.map(producto => (
              <article className="item-carrito" key={producto.id}>
                <div className="item-carrito-imagen"><img src={producto.imagen} alt={producto.nombre}/></div>
                <div className="item-carrito-info">
                  <h3><Link to={`/detalle-producto?id=${producto.id}`}>{producto.nombre}</Link></h3>
                  <p className="item-carrito-precio">{formatoPrecio(producto.precio)} c/u · {formatoPrecio(producto.precio * producto.cantidad)}</p>
                  <div className="item-carrito-cantidad">
                    <label htmlFor={`cantidad-${producto.id}`}>Cantidad (máx. {producto.stock})</label>
                    <input id={`cantidad-${producto.id}`} type="number" min="1" max={producto.stock} value={producto.cantidad} onChange={e => cambiarCantidad(producto.id, e.target.value)} />
                  </div>
                </div>
                <button type="button" className="boton-eliminar" onClick={() => eliminarDelCarrito(producto.id)}>Eliminar</button>
              </article>
            ))}
          </div>
          <Link to="/productos" className="seguir-comprando">← Seguir comprando</Link>
        </div>
        <aside className="resumen-carrito">
          <h2>Resumen del carrito</h2>
          <div className="resumen-linea"><span>Subtotal</span><span>{formatoPrecio(subtotal)}</span></div>
          <div className="resumen-linea"><span>Descuento Duoc (20%)</span><span>−{formatoPrecio(descuento)}</span></div>
          <div className="resumen-total"><span>Total productos</span><span>{formatoPrecio(total)}</span></div>
          <button type="button" className="boton-finalizar" disabled={!items.length || comprando} onClick={finalizarCompra}>{comprando ? 'Registrando compra...' : 'Finalizar compra'}</button>
          {!sesion && <p className="mensaje-duoc-carrito">Inicia sesión con tu cuenta Duoc para aplicar el descuento.</p>}
          <p>La compra registra una boleta y descuenta stock. No procesa pagos bancarios ni despacho.</p>{errorCompra && <p className="error" role="alert">{errorCompra}</p>}
        </aside>
      </div>
    </section></main>
  )
}
export default Carrito
