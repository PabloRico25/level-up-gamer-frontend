# level-up-gamer-frontend

Interfaz web de la tienda **LEVEL-UP GAMER**. Proyecto de Desarrollo Fullstack II (DSY1104), Duoc UC.

Equipo: Cristian Flores, Gabriel Bustamante, Pablo Rico y Bastián Díaz.
Repositorio hermano: [`level-up-gamer-backend`](https://github.com/PabloRico25/level-up-gamer-backend) (Spring Boot).

React con Vite. Consume la API del backend mediante `VITE_API_URL`.

## Qué incluye

- Catálogo con filtros y detalle de producto.
- Registro e inicio de sesión, con sesión persistente: al recargar la página se mantiene.
- Carrito y compra. El carrito solo se vacía al completar la compra, y el 20 % de descuento Duoc se calcula con el correo de la cuenta.
- Boletas propias del cliente.
- Panel de administración con productos, usuarios y órdenes, según el rol.
- Páginas informativas: inicio, nosotros, blog y contacto.

### Qué ve cada rol

| Rol | Ve |
|---|---|
| Sin sesión | Inicio, catálogo, detalle, registro y login |
| Cliente | Lo anterior, carrito, compra y **Mis compras** |
| Vendedor | Panel con **Productos** y **Órdenes**, solo con "Ver" |
| Administrador | Panel completo, incluido **Usuarios** |

Si un vendedor intenta entrar a una ruta que no le corresponde, por ejemplo `/admin/usuarios`, la aplicación lo redirige a `/admin/productos`.

## Requisitos

- Node.js 22.12 o superior (compatible con Vite 8) y npm.
- El backend corriendo en `http://localhost:8080`. Sus instrucciones están en el README de `level-up-gamer-backend`.

## Puesta en marcha

Desde esta carpeta:

```
npm ci
npm run dev
```

Abrir `http://localhost:5173`.

- Si hace falta cambiar la URL del backend, copiar `.env.example` a `.env` y editar `VITE_API_URL`. Por defecto es `http://localhost:8080`.
- Usar el mismo host en el frontend y el backend (`localhost` con `localhost`), porque la renovación de sesión usa una cookie `SameSite`.
- **Windows:** si PowerShell responde que la ejecución de scripts está deshabilitada y no deja correr `npm`, usar el Símbolo del sistema (cmd) en su lugar.
- Para detener el servidor de desarrollo, presionar `Ctrl+C` en su terminal.

## Primer acceso

No hay contraseñas predefinidas. El administrador se crea en el backend (ver su README). Con ese administrador se crean los demás roles desde **Usuarios** en el panel. Los clientes también pueden registrarse solos desde la página.

## Comprobaciones

| Comando | Qué revisa |
|---|---|
| `npm run build` | Que el proyecto compile |
| `npm run lint` | Estilo y errores de código |
| `npm run test:smoke` | Prueba rápida de arranque |
| `npm test` | Pruebas con Karma. Requiere Chrome; si no lo detecta, definir `CHROME_BIN` |

La cobertura publicada corresponde solo a `utils/tienda.js`.

## Estructura

```
src/
  api/          cliente HTTP y acceso a productos, categorías y boletas
  components/   componentes reutilizables
  context/      estado compartido (carrito, productos y usuarios)
  pages/        pantallas (catálogo, carrito, administración...)
  services/     autenticación y usuarios
  utils/        lógica de la tienda
tests/          pruebas unitarias y de integración
documentacion/  capturas del recorrido real
```

## Notas

- No procesa pagos bancarios: la compra registra una boleta y descuenta stock en el backend.
- El manual de usuario se entrega como documento aparte.
- No subir `node_modules`, `dist`, `coverage` ni `.env`.
