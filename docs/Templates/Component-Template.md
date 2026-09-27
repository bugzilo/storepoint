---
title: "Component: stp-{{component_name}}"
type: component
status: stable # experimental | stable | deprecated
category: form-control # form-control | action | layout | feedback | display
tags:
  - design-system
  - ui-component
  - angular
updated: {{date}}
---

# Component: `<stp-{{component_name}}>`

## 🏷️ Identificación
- **Selector**: `stp-{{component_name}}`
- **Ubicación**: `src/app/shared/components/{{component_name}}/`
- **Standalone**: `true`
- **Demo / Showcase**: Visible en `/demo` (ver [[Design System MOC]])

## 💡 Propósito & Cuándo Usar
Explicar para qué sirve el componente y en qué escenarios debe utilizarse en lugar de elementos HTML estándar.
> [!IMPORTANT]
> Recuerda la regla del sistema UI: **Nunca escribas elementos HTML nativos sin estilizar** cuando exista un componente compartido.

## ⚙️ API del Componente

### Inputs
| Nombre | Tipo | Valor por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dimensión del componente |
| `disabled` | `boolean` | `false` | Deshabilita la interacción |

### Outputs / Eventos
| Nombre | Payload | Descripción |
| :--- | :--- | :--- |
| `click` | `MouseEvent` | Emitido al hacer click |
| `change` | `T` | Emitido al cambiar el valor |

### Soporte ControlValueAccessor (CVA)
- ¿Implementa `ControlValueAccessor`? `Sí / No`
- Compatible con `[(ngModel)]` o `formControlName`.

## 🎨 Tokens y Estilos SCSS
- Variables CSS utilizadas:
  - `--stp-color-...`
  - `--stp-radius-...`
  - `--stp-spacing-...`
- Archivo SCSS asociado: `stp-{{component_name}}.component.scss`

## 💻 Ejemplo de Uso
```html
<stp-{{component_name}}
  [variant]="'primary'"
  [size]="'md'"
  (click)="handleClick()">
  Acción
</stp-{{component_name}}>
```

## ♿ Accesibilidad (A11y)
- [ ] Atributos `aria-*` adecuados
- [ ] Soporte para navegación con teclado (`Tab`, `Enter`, `Space`)
- [ ] Contraste de color verificado en temas claro y oscuro
