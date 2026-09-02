Estoy en modo de solo lectura, así que no puedo crear archivos. Aquí tienes el contenido completo del archivo Markdown para que lo guardes como `Guia-Mutation-Testing.md`:

```markdown
# Guía Completa: Del Producto Original al Reporte de Mutaciones

**Proyecto:** API Node.js con Mutation Testing  
**Herramientas:** Jest + Stryker  
**Fecha:** 2025

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Paso 1: Producto Original](#paso-1-producto-original---api-nodejs-con-express)
3. [Paso 2: Configuración de Jest para Testing](#paso-2-configuración-de-jest-para-testing)
4. [Paso 3: Instalación de Stryker](#paso-3-instalación-de-stryker-para-mutation-testing)
5. [Paso 4: Configuración de Stryker](#paso-4-configuración-de-stryker)
6. [Paso 5: Scripts y Ejecución](#paso-5-agregar-script-de-mutation-testing)
7. [Paso 6: Integración CI/CD](#paso-6-integración-con-github-actions-cicd)
8. [Paso 7: Generación del Reporte](#paso-7-generación-y-visualización-del-reporte-de-mutaciones)
9. [Resumen de Archivos](#resumen-de-archivos-modificadoscreados)
10. [Comandos de Referencia](#comandos-de-referencia-rápida)
11. [Métricas Importantes](#métricas-importantes-del-reporte-de-mutaciones)
12. [Conclusión](#conclusión)

---

## Introducción

Esta guía documenta paso a paso la transformación de una API Node.js básica en un proyecto con mutation testing usando Stryker. El proceso incluye la configuración de tests unitarios con Jest, la integración de mutation testing, y la generación de reportes HTML detallados.

**Objetivo:** Establecer un proceso completo de testing que permita evaluar la calidad de los tests mediante mutation testing, identificando áreas donde los tests pueden ser mejorados.

---

## Paso 1: Producto Original - API Node.js con Express

### Estado Inicial del Proyecto

El proyecto comenzó como una API REST básica construida con Node.js y Express, sin ningún tipo de testing configurado.

### Características del Producto Original

- **Framework:** Express.js v5.1.0
- **Base de datos:** MySQL con Sequelize ORM
- **Endpoints principales:**
  - `GET /` - Retorna "Hello World!"
  - `GET /about/:id` - Busca un usuario por ID
  - `GET /reverse/:str` - Invierte una cadena de texto

### Estructura de Archivos Inicial

```
api/
├── index.js              # Aplicación Express principal
├── lib/
│   ├── time.js          # Funciones de utilidad (determinar día/noche)
│   └── string.js        # Funciones de manipulación de strings
├── src/
│   ├── repositories/    # Patrón Repository para acceso a datos
│   ├── models/          # Modelos de Sequelize
│   └── utils/           # Utilidades (graceful shutdown, config)
└── package.json         # Dependencias básicas
```

### Dependencias Iniciales

```json
{
  "dependencies": {
    "express": "^5.1.0",
    "mysql2": "^3.11.0",
    "sequelize": "^6.37.0"
  }
}
```

**Estado:** Sin herramientas de testing, sin cobertura de código, sin validación automática de calidad.

---

## Paso 2: Configuración de Jest para Testing

### 2.1 Instalación de Jest

El primer paso fue instalar Jest como framework de testing:

```bash
npm install --save-dev jest
```

**Versión instalada:** Jest v30.2.0

### 2.2 Creación del Archivo de Configuración Jest

Se creó el archivo `jest.config.js` con la siguiente configuración:

```javascript
module.exports = {
    testEnvironment: "node",
    testMatch: [
        "**/__test__/**/*.test.js"
    ],
    collectCoverageFrom: [
        "lib/**/*.js"
    ]
};
```

**Explicación de la configuración:**

- **`testEnvironment: "node"`**: Especifica que los tests se ejecutarán en un entorno Node.js (no en un navegador)
- **`testMatch`**: Define el patrón para encontrar archivos de test. Todos los archivos `.test.js` dentro de carpetas `__test__` serán ejecutados
- **`collectCoverageFrom`**: Indica qué archivos deben ser analizados para generar reportes de cobertura. En este caso, todos los archivos `.js` dentro de `lib/`

### 2.3 Creación de Tests Unitarios

Se crearon tres archivos de test principales:

#### 2.3.1 Tests para Funciones de Tiempo (`__test__/dayornight.test.js`)

Este archivo contiene 17 casos de prueba para la función `whatPartOfDay()`:

- **Casos válidos de Daylight (7-17):**
  - Hora 7 → "Daylight"
  - Hora 12 → "Daylight"
  - Hora 17 → "Daylight"

- **Casos válidos de Night (0-6 y 18-23):**
  - Hora 0 → "Night"
  - Hora 3 → "Night"
  - Hora 6 → "Night"
  - Hora 18 → "Night"
  - Hora 23 → "Night"

- **Casos inválidos (retornan "Undetermined"):**
  - Hora -1 → "Undetermined"
  - Hora 25 → "Undetermined"
  - null → "Undetermined"
  - undefined → "Undetermined"
  - String "7" → "Undetermined"
  - String "abc" → "Undetermined"
  - Objeto {} → "Undetermined"
  - Decimal 7.5 → "Undetermined"
  - Decimal 12.3 → "Undetermined"

#### 2.3.2 Tests para Funciones de Strings (`__test__/lib.strings.test.js`)

Tests para las funciones `reverseString()` y `findUserById()`:

- **Tests de `reverseString()`:**
  - Cadena normal
  - Cadena vacía
  - Un solo carácter
  - Cadena con espacios
  - Cadena con caracteres especiales
  - Cadena numérica
  - Cadena con mayúsculas y minúsculas

- **Tests de `findUserById()`:**
  - Usuario existente
  - Usuario no existente
  - Array vacío
  - Múltiples usuarios
  - Tipos de datos incorrectos

#### 2.3.3 Tests de Endpoints (`__test__/endpoints.test.js`)

Tests de integración para los endpoints de la API usando Supertest:

- **GET /**
  - Retorna "Hello World!"

- **GET /about/:id**
  - Usuario existente (200)
  - Usuario no existente (404)
  - ID no numérico (400)
  - ID decimal (400)
  - ID negativo (404)
  - Validación de formato JSON

- **GET /reverse/:str**
  - Cadena normal
  - Cadena vacía
  - Un solo carácter
  - Cadena con espacios
  - Cadena con caracteres especiales
  - Cadena numérica
  - Caracteres codificados en URL

### 2.4 Agregar Scripts de Test en package.json

Se actualizó `package.json` agregando scripts para ejecutar tests:

```json
"scripts": {
    "start": "node index.js",
    "test": "jest",
    "test:coverage": "jest --coverage"
}
```

**Scripts agregados:**

- **`npm test`**: Ejecuta todos los tests
- **`npm run test:coverage`**: Ejecuta tests y genera reporte de cobertura

### 2.5 Instalación de Supertest

Para los tests de endpoints, se instaló Supertest:

```bash
npm install --save-dev supertest
```

**Versión instalada:** Supertest v7.1.4

### 2.6 Ejecutar Tests por Primera Vez

```bash
npm test
```

**Resultado esperado:** Todos los tests pasan exitosamente.

---

## Paso 3: Instalación de Stryker para Mutation Testing

### 3.1 ¿Qué es Mutation Testing?

Mutation testing es una técnica avanzada de testing que evalúa la calidad de los tests introduciendo pequeños cambios (mutaciones) en el código fuente y verificando si los tests detectan estos cambios. Si un test no detecta una mutación, significa que el test no es suficientemente robusto.

### 3.2 Instalación de Paquetes de Stryker

Se instalaron los paquetes necesarios de Stryker:

```bash
npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner
```

**Paquetes instalados:**

- **`@stryker-mutator/core`** (v9.4.0): Núcleo de Stryker, contiene la lógica principal de mutation testing
- **`@stryker-mutator/jest-runner`** (v9.4.0): Plugin que permite a Stryker usar Jest como test runner

### 3.3 Inicialización de Stryker

Se ejecutó el comando de inicialización interactiva:

```bash
npx stryker init
```

Este comando:
- Hace preguntas sobre la configuración deseada
- Genera automáticamente el archivo `stryker.config.json`
- Configura los reportes y el test runner según las respuestas

---

## Paso 4: Configuración de Stryker

### 4.1 Archivo de Configuración `stryker.config.json`

El archivo generado contiene la siguiente configuración:

```json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "_comment": "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  "packageManager": "npm",
  "reporters": [
    "html",
    "clear-text",
    "progress"
  ],
  "testRunner": "jest",
  "testRunner_comment": "Take a look at https://stryker-mutator.io/docs/stryker-js/jest-runner for information about the jest plugin.",
  "coverageAnalysis": "all",
  "mutate": [
    "lib/**/*.js"
  ]
}
```

### 4.2 Explicación Detallada de la Configuración

#### Reporters (Formatos de Reporte)

```json
"reporters": [
    "html",
    "clear-text",
    "progress"
]
```

- **`html`**: Genera un reporte HTML interactivo y detallado que se puede abrir en el navegador. Incluye visualización del código mutado, comparación lado a lado, y filtros avanzados.
- **`clear-text`**: Muestra un reporte legible en la consola con estadísticas y resumen de mutaciones.
- **`progress`**: Muestra una barra de progreso durante la ejecución de los mutation tests.

#### Test Runner

```json
"testRunner": "jest"
```

Especifica que Stryker debe usar Jest para ejecutar los tests. Esto requiere que el plugin `@stryker-mutator/jest-runner` esté instalado.

#### Coverage Analysis

```json
"coverageAnalysis": "all"
```

- **`"all"`**: Analiza la cobertura de código completa. Stryker solo mutará código que esté cubierto por tests, optimizando el tiempo de ejecución.

Otras opciones:
- **`"off"`**: No realiza análisis de cobertura (más lento)
- **`"perTest"`**: Analiza cobertura por cada test individualmente (más preciso pero más lento)

#### Archivos a Mutar

```json
"mutate": [
    "lib/**/*.js"
]
```

Especifica qué archivos deben ser mutados. En este caso, solo los archivos JavaScript dentro de la carpeta `lib/` serán mutados. Esto excluye:
- `index.js` (aplicación principal)
- Archivos en `src/` (lógica de negocio más compleja)
- Archivos de test

**Razón:** Se enfoca en las funciones de utilidad que tienen tests unitarios directos.

### 4.3 Actualización de `.gitignore`

Se agregó la siguiente línea para ignorar archivos temporales de Stryker:

```
.stryker-tmp
```

**Archivos ignorados:**
- `.stryker-tmp/` - Directorio temporal donde Stryker guarda archivos mutados durante la ejecución
- `reports/mutation/` - Los reportes HTML pueden ser regenerados, pero algunos equipos prefieren versionarlos

---

## Paso 5: Agregar Script de Mutation Testing

### 5.1 Actualización de `package.json`

Se agregó un nuevo script en la sección `scripts`:

```json
"scripts": {
    "start": "node index.js",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:mutation": "stryker run"
}
```

**Nuevo script agregado:**

- **`npm run test:mutation`**: Ejecuta Stryker y genera el reporte de mutaciones

### 5.2 Primera Ejecución de Mutation Testing

```bash
npm run test:mutation
```

**Proceso que ocurre:**

1. Stryker lee la configuración
2. Identifica los archivos a mutar (`lib/**/*.js`)
3. Analiza la cobertura de código
4. Genera mutaciones para cada archivo cubierto
5. Ejecuta los tests para cada mutación
6. Clasifica las mutaciones:
   - **Killed**: El test detectó la mutación ✓
   - **Survived**: El test NO detectó la mutación ✗
   - **Timeout**: El test tardó demasiado
   - **Error**: Hubo un error al ejecutar el test
7. Genera los reportes configurados

**Tiempo estimado:** 2-5 minutos dependiendo del número de mutaciones y velocidad de ejecución de tests.

---

## Paso 6: Integración con GitHub Actions (CI/CD)

### 6.1 Creación del Workflow

Se creó el archivo `.github/workflows/test.yml` para automatizar la ejecución de tests en cada Pull Request.

### 6.2 Contenido del Workflow

```yaml
name: Testing PR

on:
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [22.x]

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
    
    - name: Install dependencies
      run: npm i
      working-directory: api
      
    - name: Run tests
      run: npm test
      working-directory: api

    - name: Run mutation tests
      run: npm test:mutation
      working-directory: api
```

### 6.3 Explicación del Workflow

#### Trigger (Cuándo se ejecuta)

```yaml
on:
  pull_request:
    branches: [ main ]
```

El workflow se ejecuta automáticamente cuando:
- Se crea un Pull Request hacia la rama `main`
- Se actualiza un Pull Request existente hacia `main`

#### Entorno de Ejecución

```yaml
runs-on: ubuntu-latest
strategy:
  matrix:
    node-version: [22.x]
```

- **Sistema operativo:** Ubuntu (última versión LTS)
- **Versión de Node.js:** 22.x (configurable mediante matriz para probar múltiples versiones)

#### Pasos del Workflow

1. **Checkout del código:**
   ```yaml
   - uses: actions/checkout@v4
   ```
   Descarga el código del repositorio.

2. **Configuración de Node.js:**
   ```yaml
   - name: Use Node.js ${{ matrix.node-version }}
     uses: actions/setup-node@v4
   ```
   Instala la versión especificada de Node.js.

3. **Instalación de dependencias:**
   ```yaml
   - name: Install dependencies
     run: npm i
     working-directory: api
   ```
   Instala todas las dependencias del proyecto (incluyendo devDependencies).

4. **Ejecución de tests unitarios:**
   ```yaml
   - name: Run tests
     run: npm test
   ```
   Ejecuta los tests con Jest. Si fallan, el workflow se detiene.

5. **Ejecución de mutation tests:**
   ```yaml
   - name: Run mutation tests
     run: npm test:mutation
   ```
   Ejecuta Stryker. El workflow continuará incluso si hay mutantes sobrevivientes (esto puede configurarse para fallar si el mutation score es bajo).

### 6.4 Beneficios de la Integración CI/CD

- **Validación automática:** Cada PR es validado automáticamente
- **Prevención de regresiones:** Los tests detectan problemas antes del merge
- **Historial:** Se mantiene un registro de la calidad del código a lo largo del tiempo
- **Colaboración:** Todos los miembros del equipo ven el estado de los tests

---

## Paso 7: Generación y Visualización del Reporte de Mutaciones

### 7.1 Ejecutar Mutation Testing

```bash
npm run test:mutation
```

### 7.2 Ubicación del Reporte HTML

Una vez completada la ejecución, el reporte HTML se genera en:

```
api/reports/mutation/mutation.html
```

### 7.3 Abrir el Reporte

1. Navegar a la carpeta `api/reports/mutation/`
2. Abrir el archivo `mutation.html` en cualquier navegador web
3. El reporte se carga completamente en el navegador (no requiere servidor)

### 7.4 Contenido del Reporte HTML

El reporte HTML de Stryker incluye las siguientes secciones:

#### 7.4.1 Dashboard Principal

**Resumen General:**
- **Mutation Score:** Porcentaje de mutantes matados (objetivo: >80%)
- **Total de Mutantes:** Número total de mutaciones generadas
- **Mutantes Matados (Killed):** Mutaciones detectadas por los tests
- **Mutantes Sobrevivientes (Survived):** Mutaciones NO detectadas (indican tests débiles)
- **Mutantes con Timeout:** Tests que tardaron demasiado
- **Mutantes con Error:** Errores durante la ejecución

**Ejemplo de métricas:**
```
Mutation Score: 85.71%
Total: 14 mutants
Killed: 12
Survived: 2
Timeout: 0
Error: 0
```

#### 7.4.2 Vista por Archivo

Cada archivo mutado muestra:
- Nombre del archivo
- Mutation score del archivo
- Número de mutantes por estado
- Enlace para ver detalles

#### 7.4.3 Vista Detallada de Mutaciones

Para cada mutación, el reporte muestra:

**Código Original vs Código Mutado:**
- Vista lado a lado comparando el código original con la mutación
- Resaltado de sintaxis para fácil lectura
- Línea específica donde ocurrió la mutación

**Tipo de Mutación:**
- **Arithmetic Operator:** Cambio de operadores aritméticos (`+` → `-`, `*` → `/`)
- **Conditional Expression:** Cambio de condiciones (`>` → `>=`, `&&` → `||`)
- **Logical Operator:** Cambio de operadores lógicos
- **String Literal:** Cambio de valores de strings
- **Return Statement:** Cambio de valores de retorno

**Estado de la Mutación:**
- **Killed (Verde):** El test detectó la mutación ✓
- **Survived (Rojo):** El test NO detectó la mutación ✗
- **Timeout (Amarillo):** El test tardó demasiado
- **Error (Gris):** Hubo un error

**Tests Ejecutados:**
- Lista de tests que se ejecutaron para esta mutación
- Indica qué test mató la mutación (si fue matada)

#### 7.4.4 Filtros y Búsqueda

El reporte incluye filtros para:
- Filtrar por estado (Killed, Survived, Timeout, Error)
- Filtrar por tipo de mutación
- Filtrar por archivo
- Buscar texto específico

### 7.5 Interpretación del Reporte

#### Mutantes Matados (Killed) ✓

**Significado:** Los tests detectaron correctamente la mutación.

**Ejemplo:**
```javascript
// Código original
if (hour >= DAYLIGHT_START && hour <= DAYLIGHT_END) {
    return "Daylight";
}

// Mutación: Cambio de >= a >
if (hour > DAYLIGHT_START && hour <= DAYLIGHT_END) {
    return "Daylight";
}

// Resultado: KILLED
// El test con hour=7 falló, detectando la mutación
```

**Interpretación:** Los tests son robustos para este caso.

#### Mutantes Sobrevivientes (Survived) ✗

**Significado:** Los tests NO detectaron la mutación. Esto indica que:
- Los tests no cubren este caso específico
- Los tests no son lo suficientemente estrictos
- Hay un bug potencial en el código

**Ejemplo:**
```javascript
// Código original
if (hour >= DAYLIGHT_START && hour <= DAYLIGHT_END) {
    return "Daylight";
}

// Mutación: Cambio de <= a <
if (hour >= DAYLIGHT_START && hour < DAYLIGHT_END) {
    return "Daylight";
}

// Resultado: SURVIVED
// Ningún test detectó que hour=17 ahora retorna "Night" en lugar de "Daylight"
```

**Acción requerida:** Agregar o mejorar tests para cubrir este caso.

### 7.6 Mejora Continua Basada en el Reporte

1. **Identificar mutantes sobrevivientes**
2. **Analizar por qué sobrevivieron**
3. **Agregar tests específicos** para esos casos
4. **Re-ejecutar mutation testing**
5. **Verificar que el mutation score mejore**

---

## Resumen de Archivos Modificados/Creados

### Archivos Creados

1. **`jest.config.js`**
   - Configuración de Jest
   - Especifica entorno, patrones de test y cobertura

2. **`__test__/dayornight.test.js`**
   - 17 tests para funciones de tiempo
   - Cubre casos válidos e inválidos

3. **`__test__/lib.strings.test.js`**
   - Tests para funciones de strings
   - Tests para `reverseString()` y `findUserById()`

4. **`__test__/endpoints.test.js`**
   - Tests de integración para endpoints
   - Usa Supertest para probar la API

5. **`stryker.config.json`**
   - Configuración de Stryker
   - Define reportes, test runner y archivos a mutar

6. **`.github/workflows/test.yml`**
   - Workflow de GitHub Actions
   - Automatiza tests en CI/CD

### Archivos Modificados

1. **`package.json`**
   - Agregadas dependencias de desarrollo:
     - `jest`
     - `@stryker-mutator/core`
     - `@stryker-mutator/jest-runner`
     - `supertest`
   - Agregados scripts:
     - `test`
     - `test:coverage`
     - `test:mutation`

2. **`.gitignore`**
   - Agregado `.stryker-tmp` para ignorar archivos temporales

### Archivos Generados (No Versionados)

1. **`reports/mutation/mutation.html`**
   - Reporte HTML interactivo de mutaciones
   - Se regenera en cada ejecución

2. **`.stryker-tmp/`**
   - Directorio temporal con archivos mutados
   - Se limpia automáticamente después de la ejecución

3. **`coverage/`**
   - Reportes de cobertura de Jest
   - Generado con `npm run test:coverage`

4. **`node_modules/`**
   - Dependencias instaladas
   - No se versiona (está en `.gitignore`)

---

## Comandos de Referencia Rápida

### Desarrollo

```bash
# Iniciar la aplicación
npm start
```

### Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Ejecutar mutation testing
npm run test:mutation
```

### Instalación

```bash
# Instalar todas las dependencias
npm install

# Instalar solo dependencias de producción
npm install --production
```

### Limpieza

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpiar reportes de Stryker
rm -rf .stryker-tmp reports
```

---

## Métricas Importantes del Reporte de Mutaciones

### Mutation Score (Puntuación de Mutación)

**Fórmula:**
```
Mutation Score = (Mutantes Matados / Total de Mutantes) × 100%
```

**Interpretación:**
- **90-100%:** Excelente. Los tests son muy robustos.
- **80-89%:** Bueno. Algunos tests pueden mejorarse.
- **70-79%:** Aceptable. Hay áreas que necesitan más tests.
- **<70%:** Necesita mejora. Muchos casos no están cubiertos adecuadamente.

**Objetivo recomendado:** >80%

### Tipos de Mutantes

#### Mutantes Matados (Killed)
- **Color:** Verde ✓
- **Significado:** El test detectó la mutación
- **Objetivo:** Maximizar este número

#### Mutantes Sobrevivientes (Survived)
- **Color:** Rojo ✗
- **Significado:** El test NO detectó la mutación
- **Acción:** Agregar o mejorar tests para estos casos

#### Mutantes con Timeout
- **Color:** Amarillo ⏱
- **Significado:** El test tardó demasiado en ejecutarse
- **Acción:** Optimizar tests lentos o aumentar timeout

#### Mutantes con Error
- **Color:** Gris ⚠
- **Significado:** Hubo un error al ejecutar el test
- **Acción:** Revisar y corregir el error

### Cobertura de Código

Stryker solo muta código que está cubierto por tests. Por lo tanto:
- **Alta cobertura:** Más mutaciones generadas, mejor evaluación de calidad
- **Baja cobertura:** Menos mutaciones, evaluación limitada

**Recomendación:** Mantener cobertura de código >80% antes de ejecutar mutation testing.

---

## Conclusión

### Resumen del Proceso

Este documento ha documentado la transformación completa de una API Node.js básica en un proyecto con mutation testing. El proceso incluyó:

1. ✅ Configuración de Jest para testing unitario
2. ✅ Creación de tests comprehensivos
3. ✅ Instalación y configuración de Stryker
4. ✅ Integración con CI/CD mediante GitHub Actions
5. ✅ Generación de reportes HTML detallados

### Beneficios Obtenidos

- **Calidad de código mejorada:** Los tests son más robustos y detectan más problemas
- **Confianza en el código:** Mutation testing valida que los tests realmente verifican el comportamiento
- **Documentación viva:** Los tests sirven como documentación del comportamiento esperado
- **Integración continua:** Validación automática en cada Pull Request
- **Métricas objetivas:** Mutation score proporciona una medida cuantificable de la calidad de los tests

### Próximos Pasos Recomendados

1. **Mejorar mutation score:** Identificar y corregir mutantes sobrevivientes
2. **Expandir cobertura:** Agregar tests para código no cubierto
3. **Configurar umbrales:** Establecer un mutation score mínimo en CI/CD
4. **Documentar estándares:** Definir qué mutation score es aceptable para el equipo
5. **Revisión periódica:** Ejecutar mutation testing regularmente para mantener calidad

### Recursos Adicionales

- **Documentación de Stryker:** https://stryker-mutator.io/docs/stryker-js/
- **Documentación de Jest:** https://jestjs.io/docs/getting-started
- **Guía de Mutation Testing:** https://stryker-mutator.io/docs/mutation-testing-elements/

---

**Fin del Documento**

*Este documento fue generado basándose en los cambios realizados en el proyecto Node.js durante la implementación de mutation testing con Stryker.*
```

Para crear el archivo:

1. Copia todo el contenido anterior.
2. Crea un archivo llamado `Guia-Mutation-Testing.md` en la raíz del proyecto o en la carpeta `api`.
3. Pega el contenido.
4. Guarda el archivo.

Si quieres que lo cree directamente, cambia a modo "Composer" o "Agent" y podré crearlo por ti.