---
title: "ADR-001: Angular Signals como única estrategia de estado"
type: adr
status: accepted
date: 2026-09-26
author: "StorePoint Core Team"
tags:
  - adr
  - signals
  - architecture
---

# ADR-001: Angular Signals como única estrategia de estado

## Estado
- **Estado**: `accepted`
- **Fecha**: 2026-09-26
- **Contexto**: Arquitectura de componentes Standalone en Angular 21

## Contexto y Planteamiento del Problema
Las aplicaciones frontend basadas en Angular históricamente han requerido arquitecturas complejas de gestión de estado basadas en NgRx, Akita o servicios con múltiples `BehaviorSubject` de RxJS. Esto introducía una curva de aprendizaje empinada, boilerplate masivo (actions, reducers, selectors, effects) y problemas de memory leaks derivados de suscripciones no canceladas en el ciclo de vida del componente.

## Opciones Consideradas
1. **NgRx Store / ComponentStore**: Muy robusto pero con excesivo código repetitivo para una aplicación POS ágil.
2. **RxJS BehaviorSubjects en servicios**: Requiere gestión de suscripciones manuales o uso intensivo del pipe `async`, propenso a desincronizaciones.
3. **Angular Signals (Nativo)**: Reactividad síncrona de grano fino, sin necesidad de desuscribirse y con cálculo automático de dependencias (`computed`).

## Decisión
Se decide adoptar **Angular Signals** como la **única y exclusiva herramienta de reactividad y estado** tanto en componentes como en servicios de la aplicación.

## Consecuencias
### Positivas
- Código significativamente más limpio, legible y sin fugas de memoria.
- Detección de cambios de grano fino extremadamente rápida en dispositivos móviles de gama baja/media.
- Integración perfecta con el ciclo de vida de los componentes standalone de Angular 21.

### Negativas / Riesgos
- RxJS todavía es necesario para manejar streams de peticiones HTTP en interceptores o servicios de red complejos. Se establece la regla de convertir flujos asíncronos a Signals usando `toSignal()` cuando deban exponerse a las vistas.

## Enlaces
- [[Architecture/State Management]]
- [[Decisions MOC]]
