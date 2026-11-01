# web_2_integrador_final

**E-commerce SPA en React con roles, rutas protegidas y API REST**
Trabajo Práctico Integrador Final · Desarrollo Web 2
UNTDF · Tecnicatura Universitaria en Desarrollo de Aplicaciones
📅 Entrega: **03/11/2026**

---

## 👥 Integrantes

| Integrante | Rol en el proyecto |
|---|---|
| **Prado Alejandro** | B: Lógica, datos, sesión y administración |
| **Castro Carrillo Abril** | A: Tienda, interfaz pública y carrito |

---

## 🧩 División de responsabilidades

### Parte A: Tienda (Castro Carrillo Abril)
- Componentes de interfaz: `Navbar`, `Footer`, `ProductCard`, `Loader`, `ErrorMessage`.
- **Home** (`/`): categorías visibles, secciones por tags (Promoción, Orgánico, etc.), tarjetas y búsqueda.
- **Catálogo** (`/productos`): filtros combinables por categoría y tag, búsqueda textual, orden por precio y estados de carga, error y vacío.
- **Detalle** (`/productos/:id`): información e imágenes; la compra exige iniciar sesión.
- **CartContext**: agregar, quitar y cambiar cantidades, subtotal y persistencia en `localStorage`.
- **Carrito** (`/carrito`) y **Checkout** (`/checkout`) con compra simulada.
- Casos de prueba de compra y persistencia del carrito.

### Parte B: Lógica, datos y administración (Prado Alejandro)
- **Servicios** (`apiClient`, `productService`, `categoryService`, `tagService`, `authService`):
  - `fetch` con `async/await`, `try/catch` y control de `response.ok`.
  - Distinción de errores de red, 401/403 y 404.
  - Normalización de productos, categorías y tags.
  - Persistencia simulada de los cambios en `localStorage`.
  - Validación del rol en la capa de servicio antes de cada escritura.
- **AuthContext**, cuentas demo y pantalla de **Login** (`/login`).
- **ProtectedRoute**, **AdminRoute** y las páginas `/403` y 404.
- **Panel de administración** (`/admin`): CRUD de productos, categorías y tags, con tablas, formularios, validaciones y confirmación antes de borrar.
- Resolución de referencias y dependencias (por ejemplo, eliminar una categoría con productos asociados).
- Casos de prueba de acceso, CRUD y fallas de red.

### Tareas compartidas
- Estructura base del proyecto y definición de rutas en `App.jsx`.
- Contrato de los servicios (nombres y retornos de las funciones) y de `useAuth()`.
- Integración final, pruebas, documentación y video.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| [React 19](https://react.dev/) | Componentes funcionales, props, state y hooks |
| [Vite 8](https://vite.dev/) | Entorno de desarrollo y build |
| [React Router 7](https://reactrouter.com/) | Navegación SPA, rutas dinámicas y protegidas |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilos |
| Context API | Sesión (`AuthContext`) y carrito (`CartContext`) |
| `fetch` + `async/await` | Consultas asincrónicas a los datos |
| Proxy de Vite | Reenvía `/api/*` a la API de la cátedra agregando el token del lado del servidor |
| `localStorage` | Carrito y sesión simulada (nunca secretos) |
| [ESLint 9](https://eslint.org/) | Calidad de código: `eqeqeq`, `jsx-key`, reglas de Hooks y variables sin usar |

---

## 🚀 Instalación y ejecución

**Requisitos:** Node.js 20 o superior y npm.

```bash
# 1. Clonar el repositorio
git clone https://github.com/Bellcebu/web_2_integrador_final.git
cd web_2_integrador_final

# 2. Instalar dependencias
npm install

# 3. Crear el archivo .env a partir de la plantilla y completar API_TOKEN
cp .env.example .env

# 4. Levantar el servidor de desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Variables de entorno (`.env`)

| Variable | Descripción |
|---|---|
| `API_URL` | URL de la API de la cátedra (por defecto `https://ecommerce.fedegonzalez.com`) |
| `API_TOKEN` | Token personal para la API. **Se pide a la cátedra; no está en el repositorio.** |

- El archivo `.env` está en `.gitignore` y **nunca se sube**; el repositorio solo incluye `.env.example` con `API_TOKEN` vacío.
- Las variables **no llevan el prefijo `VITE_`** a propósito: Vite solo expone al navegador las variables `VITE_*`, así que `API_TOKEN` queda únicamente en el proceso de Node que corre el servidor.
- Si se cambia el `.env`, hay que reiniciar `npm run dev`. Si falta `API_TOKEN`, la terminal muestra un aviso.

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | Análisis estático con ESLint |
| `npm run lint:fix` | Corrige automáticamente lo que ESLint puede arreglar |

---

## 🔐 Cuentas demo y permisos

> ⚠️ Son **cuentas de demostración ficticias**, definidas solo para la práctica. No son credenciales reales.

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | `admin` | `admin123` |
| Cliente | `cliente` | `cliente123` |
| Visitante | (sin sesión) | — |

- Las cuentas están definidas en `src/services/authService.js` y la pantalla de login las muestra para completarlas con un clic.
- La sesión es **simulada**: se guarda solo el `username` en `localStorage` (nunca la contraseña) y el rol se vuelve a leer de las cuentas demo al recargar, así que editar `localStorage` a mano no da permisos de admin.
- Además de proteger rutas y botones, los servicios validan el rol (`exigirAdmin()`) antes de cada operación de escritura.
- **Esto no reemplaza la autorización de un servidor**: el código del frontend es visible para cualquiera, por lo que la protección del CRUD es una simulación.

### Matriz de permisos

| Acción | Visitante | Cliente | Admin |
|---|:---:|:---:|:---:|
| Ver catálogo y detalle | ✅ | ✅ | ✅ |
| Buscar y filtrar | ✅ | ✅ | ✅ |
| Agregar al carrito / comprar | 🔒 Login requerido | ✅ | ✅ |
| CRUD productos | ❌ | ❌ | ✅ |
| CRUD categorías | ❌ | ❌ | ✅ |
| CRUD tags | ❌ | ❌ | ✅ |

### Rutas

| Ruta | Acceso |
|---|---|
| `/` | Público |
| `/productos` | Público |
| `/productos/:id` | Público |
| `/login` | Público |
| `/carrito` | Requiere sesión (`ProtectedRoute`) |
| `/checkout` | Requiere sesión (`ProtectedRoute`) |
| `/admin` | Solo admin (`AdminRoute`) |
| `/admin/productos` | Solo admin (`AdminRoute`) |
| `/admin/categorias` | Solo admin (`AdminRoute`) |
| `/admin/tags` | Solo admin (`AdminRoute`) |
| `/403` | Acceso denegado |
| `*` | 404: página no encontrada |

Un visitante que intenta entrar a una ruta protegida se redirige a `/login`. Un usuario sin rol admin que intenta entrar a `/admin/*` se redirige a `/403`.

---

## 🗂️ Origen de datos

Los datos vienen de la **API REST de la cátedra** ([documentación](https://ecommerce.fedegonzalez.com/docs)) a través de un **proxy de Vite** que funciona como backend intermediario:

```
Navegador (React) ──► /api/products/ ──► Proxy de Vite (agrega el token) ──► https://ecommerce.fedegonzalez.com/products/
```

- El frontend **nunca conoce el token**: todas las peticiones van a `/api/...` y el proxy (`vite.config.js`) agrega el header `Authorization: Bearer <API_TOKEN>` leyendo el `.env`.
- Así se cumple que el token no esté en el código de React, en variables `VITE_*` ni en el repositorio.
- **Limitación:** el proxy solo existe mientras corre `npm run dev` o `npm run preview`. Si se sube `dist/` a un hosting estático, haría falta un backend real que cumpla la misma función.
- Las operaciones de escritura (crear, editar, borrar) se hacen contra la API real, por lo que los cambios persisten al recargar.
- El token es compartido por el equipo: todos los que lo usan ven y modifican los mismos datos.

### Capa de servicios
- `apiClient.js` centraliza el `fetch`: controla `response.ok`, usa `try/catch` y distingue error de red, 401/403, 404, 422 (datos inválidos) y errores del servidor con mensajes comprensibles.
- Acepta un `AbortController` (`signal`) para cancelar peticiones cuando un componente se desmonta y evitar solicitudes duplicadas.
- Los servicios **normalizan** las respuestas para que los componentes siempre reciban la misma forma; por ejemplo, convierten las rutas de imágenes (`/uploads/...`) en URLs completas.
- Los IDs se validan antes de consultar la API (por ejemplo `/productos/abc` responde "no encontrado" sin hacer la petición).
- La API solo filtra productos por categoría; la búsqueda por texto, el filtro por tags y el orden por precio se hacen en el frontend.

### Modelo de datos
- **Producto:** `id`, `title`, `description`, `price`, `category_id`, `pictures`, `category`, `tags`.
- **Categoría:** `id`, `title`, `description`, `picture`.
- **Tag:** `id`, `title`.

Cada producto referencia **una categoría** y **cero o más tags**.


## 📁 Estructura del proyecto

```
src/
├── components/      Layout, Navbar, Footer, ProductCard, Estrella, ProtectedRoute, AdminRoute, Loader, ErrorMessage
├── pages/           Home, Products, ProductDetail, Login, Cart, Checkout, Forbidden, NotFound
│   └── admin/       AdminDashboard, AdminProducts, AdminCategories, AdminTags
├── context/         AuthContext, CartContext
├── services/        apiClient, productService, categoryService, tagService, authService, validaciones
├── data/            api-fake.json
├── styles/
├── App.jsx          Definición de rutas
├── main.jsx         Punto de entrada
└── index.css        Tailwind
```

---

## 📸 Capturas y video

_Pendiente: se agregarán al finalizar el desarrollo._

---

