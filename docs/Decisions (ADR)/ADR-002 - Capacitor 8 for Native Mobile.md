---
title: "ADR-002: Capacitor 8.3 para aplicaciones móviles nativas"
type: adr
status: accepted
date: 2026-09-26
author: "StorePoint Core Team"
tags:
  - adr
  - mobile
  - capacitor
---

# ADR-002: Capacitor 8.3 para aplicaciones móviles nativas

## Estado
- **Estado**: `accepted`
- **Fecha**: 2026-09-26

## Contexto y Planteamiento del Problema
StorePoint debe operar tanto en computadoras de escritorio de caja/mostrador como en dispositivos móviles y tabletas táctiles para vendedores de piso o inventario. Desarrollar y mantener dos codebases independientes (Web + React Native / Flutter / Swift / Kotlin) duplicaría los costos de desarrollo y causaría divergencia de reglas de negocio.

## Opciones Consideradas
1. **PWA pura**: No permite acceso confiable a hardware nativo (impresoras térmicas bluetooth, escáneres de código de barras específicos) ni publicación en App Store y Google Play.
2. **Flutter / React Native**: Requeriría reescribir toda la UI y mantener lógica duplicada.
3. **Capacitor 8**: Permite empaquetar exactamente la misma SPA Angular de alto rendimiento dentro de un WebView nativo de última generación, con acceso a plugins nativos y proyectos Xcode/Android Studio versionables.

## Decisión
Se adopta **Capacitor 8.3** para la distribución en iOS y Android a partir de un único repositorio y build web.

## Consecuencias
- Un solo lenguaje y framework (TypeScript + Angular) para todo el equipo.
- Integración limpia de almacenamiento mediante [[Mobile & Capacitor#StorageService|StorageService]].
- Es necesario cuidar el rendimiento de los estilos y animaciones CSS en dispositivos de recursos limitados.

## Enlaces
- [[Mobile & Capacitor]]
- [[Decisions MOC]]
