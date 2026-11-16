import Carrito from '../src/pages/Carrito.jsx'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../src/components/ProductCard.jsx'
import { CarritoContext, SesionContext, ProductosContext } from '../src/context/tiendaContext.js'

window.LevelUpTest = {
  renderCarrito(contenedor, vaciar, recargar) {
    const root=createRoot(contenedor)
    flushSync(()=>root.render(<MemoryRouter><SesionContext.Provider value={{sesion:{tipo:'Cliente',correo:'prueba@duoc.cl'}}}><ProductosContext.Provider value={{productos:[{id:'A',nombre:'Mouse',precio:100,stock:5}],recargar}}><CarritoContext.Provider value={{carrito:[{id:'A',cantidad:1}],cambiarCantidad:()=>{},eliminarDelCarrito:()=>{},vaciarCarrito:vaciar}}><Carrito/></CarritoContext.Provider></ProductosContext.Provider></SesionContext.Provider></MemoryRouter>))
    return ()=>root.unmount()
  },
  renderCard(contenedor, producto, agregar = () => {}, sesion = null) {
    const root = createRoot(contenedor)
    flushSync(() => {
      root.render(
        <MemoryRouter>
          <SesionContext.Provider value={{sesion}}><CarritoContext.Provider value={{ agregarAlCarrito: agregar }}>
            <ProductCard producto={producto} />
          </CarritoContext.Provider></SesionContext.Provider>
        </MemoryRouter>
      )
    })
    return () => root.unmount()
  }
}
