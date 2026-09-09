---
name: unit-and-mutation-testing
description: Ejecuta pruebas unitarias con Jest y, únicamente si pasan correctamente, ejecuta pruebas de mutación con Stryker JS. Analiza los resultados y reporta el mutation score y los mutantes sobrevivientes.
---

# Unit and Mutation Testing

Este skill ejecuta un pipeline de validación de calidad para proyectos
JavaScript/TypeScript utilizando Jest y Stryker JS.

## Objetivo

Ejecutar las siguientes etapas en orden:

1. Verificar la configuración del proyecto.
2. Ejecutar pruebas unitarias con Jest.
3. Si Jest pasa, ejecutar pruebas de mutación con Stryker.
4. Analizar el mutation score.
5. Reportar resultados.
6. Identificar mutantes sobrevivientes.
7. Proponer pruebas unitarias adicionales cuando sea posible.

---

# Reglas

## Regla 1 - Nunca ejecutar Stryker si Jest falla

Primero ejecutar:

```bash
npm test