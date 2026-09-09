---

name: dependency-review
description: Analiza las dependencias del proyecto, detecta vulnerabilidades, versiones obsoletas, dependencias innecesarias y posibles riesgos de actualización. Genera un reporte y nunca actualiza dependencias automáticamente sin autorización.
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Dependency Review

## Objetivo

Realizar una revisión completa de las dependencias del proyecto para identificar:

* Vulnerabilidades conocidas.
* Dependencias desactualizadas.
* Dependencias innecesarias.
* Dependencias duplicadas.
* Dependencias incompatibles.
* Cambios mayores que puedan introducir breaking changes.
* Dependencias utilizadas directamente pero declaradas incorrectamente.
* Dependencias declaradas pero aparentemente no utilizadas.

El objetivo es proporcionar recomendaciones seguras de mantenimiento sin modificar automáticamente el proyecto.

---

# Reglas

## 1. Inspeccionar el proyecto

Antes de ejecutar comandos, identificar:

* Lenguaje.
* Framework.
* Package manager.
* Archivo de configuración de dependencias.
* Lock file.
* Scripts disponibles.

Para proyectos Node.js revisar:

* package.json
* package-lock.json
* yarn.lock
* pnpm-lock.yaml
* bun.lock
* configuración de TypeScript
* configuración de ESLint

---

## 2. Detectar package manager

Utilizar:

* package-lock.json -> npm
* yarn.lock -> yarn
* pnpm-lock.yaml -> pnpm
* bun.lock o bun.lockb -> bun

No cambiar de package manager.

---

# 3. Revisar dependencias

Para npm ejecutar, cuando corresponda:

```bash
npm outdated
```

y:

```bash
npm audit
```

También revisar:

```bash
npm ls
```

Cuando sea apropiado utilizar herramientas adicionales disponibles en el proyecto.

---

# 4. Clasificar dependencias

Clasificar los hallazgos en:

### Critical

Vulnerabilidades críticas o incompatibilidades que puedan comprometer la aplicación.

### High

Vulnerabilidades importantes o dependencias con riesgo elevado.

### Medium

Dependencias que requieren atención pero no representan un riesgo inmediato.

### Low

Actualizaciones menores o recomendaciones de mantenimiento.

---

# 5. Analizar upgrades

Para cada dependencia desactualizada determinar:

* versión actual
* versión disponible
* tipo de actualización
* breaking change potencial
* impacto esperado
* recomendación

Clasificar los upgrades como:

* PATCH
* MINOR
* MAJOR

Las versiones MAJOR requieren revisión adicional.

---

# 6. No modificar automáticamente

Este Skill NO debe ejecutar automáticamente:

```bash
npm update
npm install <package>@latest
npm audit fix
```

ni modificar:

```text
package.json
package-lock.json
yarn.lock
pnpm-lock.yaml
```

sin autorización explícita del usuario.

---

# 7. Revisar dependencias potencialmente no utilizadas

Analizar el código fuente y determinar si las dependencias declaradas parecen utilizarse.

No eliminar una dependencia únicamente porque no se encontró un import.

Considerar:

* configuración
* plugins
* CLI
* scripts
* archivos de configuración
* carga dinámica
* generación de código
* tooling

Marcar estos casos como:

```text
Potentially unused
```

y no eliminarlos automáticamente.

---

# 8. Revisar dependencias transitivas

Identificar vulnerabilidades introducidas mediante dependencias transitivas.

Mostrar:

```text
Direct dependency
    ↓
Transitive dependency
    ↓
Vulnerability
```

Cuando sea posible indicar qué dependencia directa introduce el problema.

---

# 9. Reporte

Generar:

# Dependency Review

## Summary

```text
Dependencies: X

Outdated:
Critical: X
High: X
Medium: X
Low: X
```

## Vulnerabilities

Para cada vulnerabilidad:

```text
Package:
Current:
Severity:
Issue:
Introduced by:
Recommendation:
```

## Outdated Dependencies

```text
Package | Current | Latest | Type | Risk
```

## Potentially Unused Dependencies

Listar dependencias sospechosas sin eliminarlas.

## Recommended Actions

Ordenar las recomendaciones por prioridad.

---

# Quality Gate

Finalizar con:

```text
Dependency Quality Gate

Critical vulnerabilities: PASS/FAIL
High vulnerabilities: PASS/FAIL
Outdated major versions: PASS/WARN
Potentially unused dependencies: INFO

Overall: PASS/WARN/FAIL
```

No modificar código ni dependencias como parte de este Skill.
