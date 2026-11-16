# level-up-gamer-frontend

Proyecto de Desarrollo Fullstack II (DSY1104), Duoc UC. Equipo: Cristian Flores, Gabriel Bustamante, Pablo Rico y Bastián Díaz.
Repositorio hermano: `level-up-gamer-backend` (Spring Boot).

React con Vite. Consume el backend Spring Boot de la entrega mediante VITE_API_URL.

Requisitos: Node 22.12+ compatible con Vite 8 y npm. Desde esta carpeta ejecutar npm ci y npm run dev. Abrir http://localhost:5173. Copiar .env.example a .env solo si necesita cambiarse la URL del backend; por defecto http://localhost:8080. Mantener el mismo host en frontend/backend para cookies SameSite.

Comprobaciones: npm run build, npm run lint, npm run test:smoke y npm test. Para Karma se requiere Chrome; configurar CHROME_BIN si no se detecta. La cobertura publicada corresponde solo a utils/tienda.js.

Incluye catálogo/filtros, detalle, registro/login, sesión persistente, carrito y compra, boletas propias, panel de productos/usuarios y órdenes por rol, y páginas informativas originales. El carrito solo se vacía al completar la compra. No procesa pagos bancarios. En documentacion/capturas están las capturas del recorrido real; el manual de usuario se entrega como documento aparte.

No hay contraseñas locales predefinidas. Crear administrador en backend y los demás roles desde su panel. No entregar node_modules, dist, coverage ni .env.
