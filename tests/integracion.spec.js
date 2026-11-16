/* global describe, it, expect, jasmine, spyOn */
const esperar=()=>new Promise(r=>setTimeout(r,40))
describe('Integración de interfaz',()=>{
 it('El vendedor no ve el botón de añadir al carrito',()=>{
  const nodo=document.createElement('div');document.body.appendChild(nodo)
  const quitar=window.LevelUpTest.renderCard(nodo,{id:'A',nombre:'Mouse',precio:100,stock:5},()=>{},{tipo:'Vendedor'})
  expect(nodo.querySelector('button')).toBeNull();quitar();nodo.remove()
 })
 it('Compra exitosa vacía el carrito y actualiza catálogo',async()=>{
  spyOn(window,'fetch').and.resolveTo(new Response(JSON.stringify({id:10}),{status:201}))
  const nodo=document.createElement('div');document.body.appendChild(nodo)
  const vaciar=jasmine.createSpy('vaciar'),recargar=jasmine.createSpy('recargar').and.resolveTo()
  const quitar=window.LevelUpTest.renderCarrito(nodo,vaciar,recargar)
  nodo.querySelector('.boton-finalizar').click();await esperar()
  expect(vaciar).toHaveBeenCalledTimes(1);expect(recargar).toHaveBeenCalledTimes(1);quitar();nodo.remove()
 })
 it('Stock insuficiente conserva carrito y muestra error',async()=>{
  spyOn(window,'fetch').and.resolveTo(new Response(JSON.stringify({message:'Stock insuficiente'}),{status:409}))
  const nodo=document.createElement('div');document.body.appendChild(nodo)
  const vaciar=jasmine.createSpy('vaciar'),recargar=jasmine.createSpy('recargar').and.resolveTo()
  const quitar=window.LevelUpTest.renderCarrito(nodo,vaciar,recargar)
  nodo.querySelector('.boton-finalizar').click();await esperar()
  expect(vaciar).not.toHaveBeenCalled();expect(nodo.textContent).toContain('Stock insuficiente');quitar();nodo.remove()
 })
 it('Doble clic durante compra envía una sola solicitud',async()=>{
  let resolver
  const enviar=spyOn(window,'fetch').and.callFake(()=>new Promise(r=>{resolver=r}))
  const nodo=document.createElement('div');document.body.appendChild(nodo)
  const quitar=window.LevelUpTest.renderCarrito(nodo,()=>{},async()=>{})
  const boton=nodo.querySelector('.boton-finalizar');boton.click();boton.click()
  expect(enviar).toHaveBeenCalledTimes(1)
  resolver(new Response(JSON.stringify({id:11}),{status:201}));await esperar();quitar();nodo.remove()
 })
})
