---
title: "Catálogo de Componentes Compartidos (stp-*)"
type: design-system
status: active
tags:
  - design-system
  - components
  - catalog
updated: 2026-09-27
---

# 📦 Catálogo de Componentes Compartidos (`stp-*`)

Todos los componentes se ubican en `src/app/shared/components/`. Son componentes independientes (`standalone: true`) listos para ser importados directamente.

---

## 🎛️ Controles de Formulario

### `<stp-input>`
Campo de texto con etiquetas flotantes (float label), soporte para contraseña con revelado visual y validaciones reactivas.
- **Implementa**: `ControlValueAccessor` (compatible con `[(value)]` y Reactive Forms).
- **Inputs Clave**: `label`, `type`, `placeholder`, `hasError`, `errorMessage`.

### `<stp-input-numeric>`
Control de cantidad y números con botones integrados de suma y resta (`± stepper`).
- **Implementa**: `ControlValueAccessor`.
- **Inputs Clave**: `min`, `max`, `step`, `size`, `radius`.
- **Uso ideal**: Modificar cantidades en el carrito de compras y órdenes.

### `<stp-select>`
Selector de opciones estilizado con diseño nativo y soporte para etiquetas flotantes.
- **Inputs Clave**: `label`, `options` (`{ value, label }[]`), `size`, `hasError`.

### `<stp-checkbox>`
Casilla de verificación accesible con estados normal, marcado e indeterminado.
- **Inputs Clave**: `label`, `variant`, `size`, `indeterminate`, `[(checked)]`.

### `<stp-search>`
Barra de búsqueda con debounce, icono y botón de limpieza automática `(cleared)`.
- **Inputs Clave**: `placeholder`, `size`, `[(value)]`.

---

## ⚡ Acciones & Botones

### `<stp-button>`
Botón universal del sistema con soporte para 8 variantes cromáticas y 3 estilos de renderizado.
- **Variantes**: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `ghost`, `link`.
- **Estilos (`btnStyle`)**: `solid`, `outline`, `soft`.
- **Inputs de Estado**: `loading` (muestra spinner interno), `disabled`, `radius`, `size`.

```html
<stp-button
  variant="primary"
  btnStyle="solid"
  size="md"
  [loading]="isSubmitting()"
  (click)="submitForm()">
  Guardar Registro
</stp-button>
```

> [!TIP]
> **Patrón en Cabeceras de Página**: En botones de acción dentro de cabeceras de página principales (azules), usa siempre `variant="primary" btnStyle="solid" size="md" radius="md"` con un `<i stp-icon name="plus">` para integrarse armoniosamente con el fondo sin generar bloques blancos desproporcionados (como en `Proveedores` y `Órdenes de Compra`).

---

## 🏷️ Visualización & Feedback

| Componente | Selector | Propósito |
| :--- | :--- | :--- |
| **Badge** | `<stp-badge>` | Etiquetas de estado (ej: Pagado, Pendiente, Cancelado). |
| **Tag** | `<stp-tag>` | Categorías y filtros seleccionables. |
| **Alert** | `<stp-alert>` | Banners informativos o mensajes de error con iconos. |
| **Avatar** | `<stp-avatar>` | Imágenes o iniciales de clientes y proveedores. |
| **Loader** | `<stp-loader>` | Spinner circular centralizado. |
| **Shimmer** | `<stp-shimmer>` | Efecto de carga esqueleto para tablas y tarjetas. |
| **Empty State** | `<stp-empty-state>` | Pantalla vacía cuando no hay resultados o transacciones. |

---

## 📱 Drawers y Paneles Deslizables
Ver la especificación completa en: [[Modal & Drawer Pattern]].

---

## 🔗 Referencias
- [[Design System MOC]]
- [[UI System Rules]]
- [[Modal & Drawer Pattern]]
