# Guía: Testing unitario y mutation testing (Jest + Stryker)

**Proyecto:** API Node.js con Express  
**Herramientas:** Jest + Stryker JS  
**Alcance:** documenta el estado actual del repositorio (no un roadmap inventado).

---

## Tabla de contenidos

1. [Producto actual](#1-producto-actual)
2. [Pruebas con Jest](#2-pruebas-con-jest)
3. [Stryker (mutation testing)](#3-stryker-mutation-testing)
4. [Scripts](#4-scripts)
5. [Reportes](#5-reportes)
6. [CI/CD](#6-cicd)
7. [Comandos de referencia](#7-comandos-de-referencia)
8. [Métricas](#8-métricas)

---

## 1. Producto actual

### Stack

- Express `^5.1.0`
- MySQL + Sequelize (`mysql2` `^3.24.3`, `sequelize` `^6.37.8`) para modelos/repositorios
- Node en Docker: `node:20-alpine` (`api/dockerfile`)

### Endpoints (`api/index.js`)

| Método | Ruta | Handler |
|--------|------|---------|
| `GET` | `/` | `getHome` → `Hello World!` |
| `GET` | `/about/:id` | `getUserById` → usuario en memoria o `404` |
| `GET` | `/reverse/:str` | `reverseUserString` → `{ original, reversed }` |
| `GET` | `/reverse-http/:str` | `reverseUserStringHttp` → proxy HTTP a `/reverse/...`; `502` si falla el upstream |
| `GET` | `/async/:id` | `getUserAsync` → mismo resultado que `/about/:id` tras 1 s |
| `GET` | `/retry/:id` | `getUserWithRetry` → `503` las primeras `failures` veces (`?failures=N`), luego usuario o `404` |

Usuarios en memoria: `{ id: 1, name: "Alice" }`, `{ id: 2, name: "Bob" }`, `{ id: 3, name: "Charlie" }`.

### Estructura relevante

```text
api/
├── index.js
├── controllers/mainController.js
├── lib/string.js
├── src/models|repositories|interfaces
├── __test__/endpoints.test.js
├── stryker.config.json
├── package.json
└── dockerfile
```

---

## 2. Pruebas con Jest

### Dependencias

- `jest` `^30.2.0`
- `supertest` `^7.1.4` (presente; los tests actuales ejercitan handlers directamente)

No hay `jest.config.js` en el repo: Jest usa su configuración por defecto y encuentra `**/__test__/**/*.test.js` / `*.test.js`.

### Archivo de tests

Único suite versionado: `api/__test__/endpoints.test.js`.

Cubre, entre otros:

- `getHome`
- `getUserById` (éxito, prefijo `parseInt`, varios `404`)
- `reverseUserString` (cadenas, Unicode, emoji UTF-16, `TypeError` con `null`/`undefined`)
- `reverseUserStringHttp` (éxito y `502`; usa `REVERSE_UPSTREAM_BASE_URL`)
- `getUserAsync` (timers falsos; éxito y `404`)
- `getUserWithRetry` (dos `503` y éxito en el tercer intento con `failures=2`)

### Scripts

```json
"test": "jest",
"test:coverage": "jest --coverage"
```

```bash
cd api
npm test
npm run test:coverage
```

---

## 3. Stryker (mutation testing)

### Dependencias

```bash
npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner
```

Versiones en el proyecto: `@stryker-mutator/core` y `@stryker-mutator/jest-runner` `^10.0.0`.

### Configuración (`api/stryker.config.json`)

```json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "packageManager": "npm",
  "reporters": ["html", "clear-text", "progress"],
  "testRunner": "jest",
  "coverageAnalysis": "perTest",
  "mutate": [
    "lib/**/*.js",
    "controllers/**/*.js"
  ]
}
```

- **Reporters:** HTML, consola y barra de progreso
- **coverageAnalysis:** `perTest`
- **mutate:** utilidades en `lib/` y handlers en `controllers/`

### `.gitignore`

Se ignoran artefactos de mutación:

```text
/api/.stryker-tmp
/api/reports
```

---

## 4. Scripts

En `api/package.json`:

```json
"scripts": {
  "start": "node index.js",
  "test": "jest",
  "test:coverage": "jest --coverage",
  "test:mutation": "stryker run"
}
```

```bash
cd api
npm run test:mutation
```

Flujo típico:

1. Leer `stryker.config.json`
2. Mutar archivos bajo `mutate`
3. Ejecutar Jest por mutante
4. Clasificar: killed / survived / timeout / error
5. Emitir reportes

---

## 5. Reportes

Tras `npm run test:mutation`:

```text
api/reports/mutation/mutation.html
```

Abrir el HTML en un navegador. Incluye mutation score, mutantes por archivo y detalle original vs mutado.

---

## 6. CI/CD

En este repositorio **no** hay workflow bajo `.github/workflows/` en el momento de actualizar esta guía.

Si se añade CI, el comando correcto de mutación es:

```bash
npm run test:mutation
```

(no `npm test:mutation`). La imagen Docker del proyecto usa Node **20**.

---

## 7. Comandos de referencia

```bash
# Desarrollo
cd api
npm start

# Tests
npm test
npm run test:coverage
npm run test:mutation

# Dependencias
npm install

# Limpieza local de artefactos Stryker
# (rutas relativas a api/)
rm -rf .stryker-tmp reports
```

Docker Compose (raíz del repo, con `.env`):

```bash
docker compose up --build
```

Variables de entorno: ver [README.md](../../README.md).

---

## 8. Métricas

```text
Mutation Score = (mutantes killed / mutantes totales) × 100%
```

Orientación habitual:

- **≥ 80%:** buena calidad de tests para el código mutado
- **Survived:** casos a reforzar con tests más estrictos

Stryker solo evalúa bien el código cubierto por tests; conviene cobertura razonable antes de interpretar el score.

---

## Resumen de archivos de testing

| Archivo | Rol |
|---------|-----|
| `api/__test__/endpoints.test.js` | Tests de handlers |
| `api/stryker.config.json` | Configuración Stryker |
| `api/package.json` | Scripts y deps de test/mutación |
| `.gitignore` | Ignora `.stryker-tmp` y `reports` |
| `api/reports/mutation/mutation.html` | Reporte generado (no versionado) |

---

*Documento alineado con el código y la configuración del repositorio. Para instalación y endpoints de producto, ver el README raíz.*
