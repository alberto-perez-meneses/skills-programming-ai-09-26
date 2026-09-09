---

name: living-documentation
description: Mantiene sincronizada la documentación del proyecto con el código fuente. Analiza cambios realizados en Git y detecta documentación obsoleta, endpoints no documentados, configuraciones faltantes y cambios arquitectónicos.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Living Documentation

## Objetivo

Mantener la documentación del proyecto sincronizada con su implementación real.

La documentación debe reflejar el estado actual del código y no una implementación histórica.

---

# Documentación objetivo

Buscar y analizar:

```text
README.md
docs/
CHANGELOG.md
OpenAPI / Swagger
API documentation
Architecture documentation
Configuration documentation
Environment variables
Examples
```

También identificar documentación específica del proyecto.

---

# Etapa 1 - Analizar estructura

Identificar:

* arquitectura
* módulos
* servicios
* APIs
* configuración
* scripts
* comandos
* variables de entorno
* dependencias principales

No asumir una estructura específica.

---

# Etapa 2 - Analizar cambios

Si existe un repositorio Git utilizar:

```bash
git status
```

y:

```bash
git diff
```

Cuando sea necesario analizar también:

```bash
git diff HEAD~1
```

Determinar qué cambios tienen impacto documental.

---

# Cambios que requieren revisión

## API

Detectar:

* endpoints nuevos
* endpoints eliminados
* cambios de HTTP method
* cambios de parámetros
* cambios de request
* cambios de response
* cambios de códigos HTTP
* cambios de autenticación

---

## Configuración

Detectar:

* nuevas variables de entorno
* variables eliminadas
* cambios de valores por defecto
* nuevos archivos de configuración
* cambios en configuración de infraestructura

---

## Comportamiento

Detectar:

* reglas de negocio modificadas
* cambios importantes de comportamiento
* nuevos flujos
* cambios de errores
* cambios de validación

---

## Arquitectura

Detectar:

* nuevos módulos
* nuevos servicios
* nuevas integraciones
* cambios entre componentes
* nuevas dependencias externas

---

## Instalación

Detectar cambios en:

* requisitos
* versiones
* comandos
* Docker
* Docker Compose
* variables de entorno
* bases de datos
* migraciones

---

# Etapa 3 - Detectar documentación obsoleta

Buscar inconsistencias como:

```text
README dice:
POST /api/orders

Código contiene:
POST /api/v2/orders
```

Reportar:

```text
Documentation mismatch

README.md
POST /api/orders

Implementation
POST /api/v2/orders

Action:
Update README.md
```

---

# Etapa 4 - Documentación de APIs

Cuando exista OpenAPI/Swagger:

Verificar:

* endpoints
* parámetros
* schemas
* responses
* authentication
* error responses

No modificar automáticamente una especificación API si existe riesgo de alterar un contrato público.

---

# Etapa 5 - Environment variables

Detectar variables utilizadas en el código.

Compararlas con documentación.

Ejemplo:

Código:

```text
PAYMENT_API_URL
PAYMENT_API_KEY
PAYMENT_TIMEOUT
```

Documentación:

```text
PAYMENT_API_URL
PAYMENT_API_KEY
```

Reportar:

```text
Missing documentation:

PAYMENT_TIMEOUT
```

No exponer valores reales de secretos.

---

# Etapa 6 - README

Verificar que README contenga cuando corresponda:

* descripción
* requisitos
* instalación
* configuración
* ejecución
* testing
* build
* deployment
* variables de entorno
* ejemplos
* troubleshooting

No agregar secciones irrelevantes.

---

# Etapa 7 - CHANGELOG

Si el proyecto utiliza CHANGELOG:

Clasificar cambios:

```text
Added
Changed
Fixed
Removed
Security
```

No registrar automáticamente cambios internos irrelevantes.

---

# Reglas

## No inventar información

Toda documentación debe derivarse de:

* código
* configuración
* tests
* scripts
* infraestructura
* Git
* documentación existente

No inventar endpoints, variables o comportamientos.

---

## No sobrescribir documentación sin revisar

Antes de modificar documentación:

1. identificar inconsistencia
2. explicar el cambio
3. actualizar solamente las secciones afectadas
4. revisar el resultado

---

# Reporte

Generar:

# Living Documentation Report

## Documentation Status

```text
README: UP TO DATE / OUTDATED
API Docs: UP TO DATE / OUTDATED
Configuration: UP TO DATE / OUTDATED
Architecture: UP TO DATE / OUTDATED
Changelog: UP TO DATE / OUTDATED
```

## Detected inconsistencies

Listar cada inconsistencia:

```text
File:
Section:
Current documentation:
Actual implementation:
Recommended change:
```

## Documentation changes

Mostrar los archivos que deberían actualizarse.

## Quality Gate

```text
Documentation status: PASS / WARN / FAIL
```
