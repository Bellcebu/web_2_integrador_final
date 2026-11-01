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
| `localStorage` | Carrito y cambios simulados del CRUD (nunca secretos) |
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

# 3. Levantar el servidor de desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

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
| Administrador | _a definir_ | _a definir_ |
| Cliente | _a definir_ | _a definir_ |
| Visitante | (sin sesión) | — |

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

Se trabaja con la **Modalidad A** del enunciado:

- Los datos iniciales se obtienen con `fetch` (GET) desde `src/data/api-fake.json`.
- Las operaciones de crear, editar y borrar se aplican sobre el estado de React y se guardan en `localStorage`.
- **Ninguna operación de escritura modifica el archivo JSON.** Toda mutación es simulada y vive solo en el navegador.

### Modelo de datos
- **Producto:** `id`, `title`, `description`, `price`, `category_id`, `pictures`, `category`, `tags`.
- **Categoría:** `id`, `title`, `description`, `picture`.
- **Tag:** `id`, `title`.

Cada producto referencia **una categoría** y **cero o más tags**.


## 📁 Estructura del proyecto

```
src/
├── components/      Navbar, Footer, ProductCard, ProtectedRoute, AdminRoute, Loader, ErrorMessage
├── pages/           Home, Products, ProductDetail, Login, Cart, Checkout, Forbidden, NotFound
│   └── admin/       AdminDashboard, AdminProducts, AdminCategories, AdminTags
├── context/         AuthContext, CartContext
├── services/        apiClient, productService, categoryService, tagService, authService
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

