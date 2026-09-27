---
title: "ADR-003: MatBottomSheet para todos los modales y drawers"
type: adr
status: accepted
date: 2026-09-26
author: "StorePoint Core Team"
tags:
  - adr
  - ui
  - design-system
  - bottom-sheet
---

# ADR-003: MatBottomSheet para todos los modales y drawers

## Estado
- **Estado**: `accepted`
- **Fecha**: 2026-09-26

## Contexto y Planteamiento del Problema
En el desarrollo de interfaces web con frecuencia los desarrolladores construyen modales personalizados utilizando `position: fixed; z-index: 9999` y lógica de overlay manual. Esto ocasiona inconsistencias visuales, scroll leaks en el fondo de la pantalla, problemas con el teclado virtual en móviles (iOS Safari / Android Chrome) y fallos de accesibilidad con el foco del teclado.

## Opciones Consideradas
1. **Modales flotantes manuales con CSS**: Difíciles de mantener, sin control de foco ni bloqueo de scroll adecuado en iOS.
2. **MatDialog estándar**: Bueno para alertas pequeñas, pero deficiente en pantallas móviles pequeñas para formularios complejos con teclados virtuales.
3. **MatBottomSheet (Angular CDK)**: Experiencia táctil deslizable, anclada en la parte inferior, con manejo automático de backdrop, animación y accesibilidad.

## Decisión
Se prohíbe crear modales y drawers flotantes manuales. **Toda ventana secundaria, formulario flotante o vista de detalle debe implementarse con `MatBottomSheet`**.

## Consecuencias
- Uniformidad absoluta en la experiencia de usuario.
- Cero bugs de scroll leak en iOS Safari / WebView.
- Compatible de forma natural con pantallas táctiles.

## Enlaces
- [[Design System/Modal & Drawer Pattern]]
- [[Design System/UI System Rules]]
- [[Decisions MOC]]
