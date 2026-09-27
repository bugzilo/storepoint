---
title: "UI System Rules (Reglas Obligatorias de UI)"
type: design-system
status: active
tags:
  - design-system
  - rules
  - guidelines
updated: 2026-09-27
---

# 🚨 UI System Rules (Reglas Obligatorias)

Estas reglas son **estrictas y de cumplimiento obligatorio** en cualquier archivo de plantilla (`.html`) y de estilos (`.scss`) creado o modificado en este repositorio.

---

## 1. Usar Siempre Componentes Compartidos
> [!CAUTION]
> **Prohibido**: Nunca escribas elementos HTML nativos sin estilizar como `<input>`, `<button>`, `<select>`, `<textarea>` cuando exista su contraparte en `src/app/shared/components/`.

- En lugar de `<button class="btn">`, usa `<stp-button>`.
- En lugar de `<input type="text">`, usa `<stp-input>`.
- En lugar de `<select>`, usa `<stp-select>`.
- En lugar de `<input type="checkbox">`, usa `<stp-checkbox>`.
- En lugar de controles de incremento manual, usa `<stp-input-numeric>`.

---

## 2. Usar Exclusivamente Tokens CSS
> [!WARNING]
> **Prohibido**: Nunca ingreses valores hexadecimales `color: #ff0000`, tamaños de fuente fijos `font-size: 14px` o bordes arbitrarios `border-radius: 8px` directamente en los archivos SCSS de features.

- Todos los valores deben provenir de variables CSS definidas en el sistema:
  - Colores: `var(--stp-color-primary)`, `var(--stp-color-surface)`, `var(--stp-color-text-secondary)`.
  - Radios: `var(--stp-radius-md)`, `var(--stp-radius-lg)`.
  - Espaciados: `var(--stp-spacing-sm)`, `var(--stp-spacing-md)`.
  - Sombras: `var(--stp-shadow-sm)`, `var(--stp-shadow-md)`.

---

## 3. Priorizar Clases Utilitarias
Usa las clases utilitarias disponibles antes de inventar selectores o estilos CSS inline:
- Tipografía: `.text-sm`, `.text-lg`, `.font-bold`, `.text-muted`
- Espaciado: `.p-4`, `.m-2`, `.gap-3`
- Superficies: `.bg-surface`, `.bg-primary-subtle`
- Bordes: `.radius-md`, `.radius-full`

---

## 4. `MatBottomSheet` para Todos los Drawers y Modales
> [!IMPORTANT]
> **Nunca construyas overlays personalizados con `position: fixed` o contenedores flotantes manuales.**
> Toda vista modal, formulario secundario o panel de detalle debe implementarse utilizando `MatBottomSheet` del Angular CDK.

Ver la guía detallada en: [[Modal & Drawer Pattern]].

---

## 5. Respetar Breakpoints y SCSS Partials
- Importa los breakpoints desde `src/app/shared/styles/breakpoints.scss` y los niveles de z-index desde `z-index.scss`.
- No inventes media queries manuales con píxeles arbitrarios.

---

## 6. Previsualización en `/demo`
Antes de dar por finalizado un componente UI nuevo o refactorizado, agrégalo a la página de catálogo en `/demo` para validar su comportamiento visual en modo claro y oscuro.

---

## 🔗 Referencias
- [[Design System MOC]]
- [[Tokens & Theming]]
- [[UI Components Catalog]]
- [[Modal & Drawer Pattern]]
