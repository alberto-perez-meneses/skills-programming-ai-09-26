# API Node.js (curso 26)

API REST de ejemplo con Express, capa de datos MySQL/Sequelize y pruebas con Jest + Stryker.

## Requisitos

- Node.js 20 (imagen Docker: `node:20-alpine`)
- npm
- Docker y Docker Compose (opcional, para API + MySQL)

## Estructura

```text
api/
├── index.js                 # App Express y rutas
├── controllers/             # Handlers HTTP
├── lib/                     # Utilidades (reverseString)
├── src/                     # Modelos, repositorios e interfaces Sequelize
├── __test__/                # Pruebas Jest
├── stryker.config.json      # Mutation testing
├── dockerfile
└── doc/practica.md          # Guía de testing / mutación
docker-compose.yml
mydb/                        # init.sql y my.cnf para MySQL
```

## Instalación local

```bash
cd api
npm install
```

## Variables de entorno

Definir en `.env` en la raíz del repositorio (no versionar secretos). Nombres usados por el proyecto:

| Variable | Uso |
|----------|-----|
| `NODE_ENV` | Entorno de la API en Compose |
| `API_PORT` | Puerto host mapeado al contenedor API (`3000`) |
| `DB_HOST` | Host MySQL (Sequelize) |
| `DB_PORT` | Puerto MySQL (por defecto `3306` si no es número válido) |
| `DB_USER` | Usuario MySQL |
| `DB_PASSWORD` | Contraseña MySQL |
| `DB_NAME` | Nombre de base de datos |
| `MYSQL_VERSION` | Tag de imagen MySQL |
| `MYSQL_PORT` | Puerto host de MySQL |
| `MYSQL_ROOT_PASSWORD` | Root password del contenedor MySQL |
| `MYSQL_DATABASE` | Base creada al iniciar MySQL |
| `MYSQL_USER` | Usuario de aplicación MySQL |
| `MYSQL_PASSWORD` | Contraseña del usuario MySQL |
| `PORT` | Puerto usado por `reverseUserStringHttp` al armar la URL local (por defecto `3000`) |
| `REVERSE_UPSTREAM_BASE_URL` | Base URL del upstream de `GET /reverse-http/:str` |

El esquema se inicializa con `mydb/init.sql` (tablas `users` y `notes`). Las rutas HTTP actuales usan un catálogo de usuarios **en memoria**, no Sequelize.

## Ejecución

```bash
# Solo API (desde api/)
npm start
# Escucha en el puerto 3000
```

Con Docker Compose (desde la raíz, con `.env` configurado):

```bash
docker compose up --build
```

## Endpoints

Todos son `GET` públicos (sin autenticación).

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Texto `Hello World!` |
| `GET` | `/about/:id` | Usuario en memoria (`1` Alice, `2` Bob, `3` Charlie). `404` si no existe |
| `GET` | `/reverse/:str` | `{ original, reversed }` vía `lib/string.js` |
| `GET` | `/reverse-http/:str` | Llama por HTTP a `/reverse/...` (usa `REVERSE_UPSTREAM_BASE_URL` o `http://127.0.0.1:$PORT`). Errores de upstream → `502` |
| `GET` | `/async/:id` | Igual que `/about/:id` tras ~1 s de delay |
| `GET` | `/retry/:id?failures=N` | Responde `503` las primeras `N` peticiones por `id`, luego el usuario (`200`) o `404` |

## Testing

Desde `api/`:

```bash
npm test                 # Jest
npm run test:coverage    # Jest con cobertura
npm run test:mutation    # Stryker (muta lib/** y controllers/**)
```

Reporte HTML de mutación: `api/reports/mutation/mutation.html` (ignorado por git).

Detalle del flujo de mutation testing: [api/doc/practica.md](api/doc/practica.md).

## Dependencias principales

- **runtime:** `express` ^5.1.0, `mysql2` ^3.24.3, `sequelize` ^6.37.8
- **dev:** `jest` ^30.2.0, `supertest` ^7.1.4, `@stryker-mutator/core` ^10.0.0, `@stryker-mutator/jest-runner` ^10.0.0
