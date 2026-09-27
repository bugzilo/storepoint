---
title: "Tokens & Theming (CSS Variables)"
type: design-system
status: active
tags:
  - design-system
  - theming
  - dark-mode
  - tokens
updated: 2026-09-27
---

# 🎨 Tokens & Theming (CSS Variables)

El sistema visual de **StorePointWeb** se fundamenta en un modelo de diseño basado en variables CSS declaradas en `src/styles.scss` y adaptadas dinámicamente según el atributo `data-theme` en la etiqueta `<html>`.

---

## 🌓 Sistema de Temas: Claro y Oscuro

El cambio de tema lo gestiona [[Architecture/State Management#ThemeService|ThemeService]], el cual inyecta el atributo en tiempo de ejecución:

```html
<!-- Modo Claro (por defecto) -->
<html data-theme="light"> ... </html>

<!-- Modo Oscuro -->
<html data-theme="dark"> ... </html>
```

---

## 🎨 Paleta de Colores y Tokens Principales

| Token CSS | Propósito | Ejemplo Modo Claro | Ejemplo Modo Oscuro |
| :--- | :--- | :--- | :--- |
| `--stp-color-primary` | Color de marca y acciones principales | Azul Índigo / Azul Marino | Azul Eléctrico |
| `--stp-color-surface` | Fondo de tarjetas y paneles | `#ffffff` | `#1e293b` |
| `--stp-color-background` | Fondo global de la aplicación | `#f8fafc` | `#0f172a` |
| `--stp-color-text-primary` | Texto de lectura principal | `#0f172a` | `#f8fafc` |
| `--stp-color-text-secondary`| Texto secundario, subtítulos y badges | `#64748b` | `#94a3b8` |
| `--stp-color-border` | Bordes y líneas divisorias | `#e2e8f0` | `#334155` |
| `--stp-color-success` | Confirmaciones y transacciones exitosas | `#10b981` | `#34d399` |
| `--stp-color-warning` | Avisos de inventario y alertas | `#f59e0b` | `#fbbf24` |
| `--stp-color-danger` | Eliminaciones y errores de validación | `#ef4444` | `#f87171` |

---

## 📐 Espaciados y Radios de Borde

```scss
/* Radios de borde estandarizados */
--stp-radius-xs: 4px;
--stp-radius-sm: 6px;
--stp-radius-md: 10px;
--stp-radius-lg: 16px;
--stp-radius-full: 9999px;

/* Escala de espaciado */
--stp-spacing-xs: 4px;
--stp-spacing-sm: 8px;
--stp-spacing-md: 16px;
--stp-spacing-lg: 24px;
--stp-spacing-xl: 32px;
```

---

## 📱 Breakpoints Responsivos

Ubicación: `src/app/core/constants/breakpoints.ts` y `src/app/shared/styles/breakpoints.scss`.

| Breakpoint | Valor | Dispositivo Típico |
| :--- | :--- | :--- |
| `$mobile` | `< 768px` | Teléfonos iPhone / Android (activa `BottomBarComponent`) |
| `$tablet` | `768px - 1024px` | iPads y tablets Android |
| `$desktop` | `> 1024px` | Pantallas de PC y Portátiles (activa `SidebarComponent`) |

---

## 🔗 Referencias
- [[Design System MOC]]
- [[UI System Rules]]
- [[UI Components Catalog]]
