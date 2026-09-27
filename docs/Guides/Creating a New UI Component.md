---
title: "Guía: Creación de un Componente UI Compartido"
type: guide
status: active
category: design-system
tags:
  - guide
  - design-system
  - ui-component
updated: 2026-09-27
---

# 🎨 Creación de un Componente UI Compartido (`stp-*`)

Esta guía describe el ciclo de vida y los estándares para crear un nuevo componente en la biblioteca de interfaz de StorePoint.

---

## 📌 Requisitos Previos & Convenciones
- **Ubicación**: Todos los componentes compartidos deben residir en `src/app/shared/components/<nombre-componente>/`.
- **Prefijo Obligatorio**:
  - En el selector del elemento: `stp-<nombre>` (ej. `stp-chip`, `stp-stat-card`).
  - Si es una directiva: `stp<Nombre>` (ej. `stpRipple`).
- **Standalone**: El componente debe tener `standalone: true`.

---

## 🛠️ Paso a Paso

### 1. Generar los Archivos del Componente
Crea la carpeta y los 3 archivos básicos:
```
src/app/shared/components/chip/
├── chip.component.ts
├── chip.component.html
└── chip.component.scss
```

### 2. Implementar la Lógica TypeScript
Usa Signals (`input()`, `output()`) o decoradores `@Input()`, y tipos estrictos para variantes y tamaños:

```typescript
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

export type ChipVariant = 'default' | 'primary' | 'success';

@Component({
  selector: 'stp-chip',
  standalone: true,
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipComponent {
  readonly label = input.required<string>();
  readonly variant = input<ChipVariant>('default');
  readonly selected = input<boolean>(false);
  readonly clicked = output<void>();
}
```

### 3. Aplicar Estilos con Tokens CSS
> [!CAUTION]
> Recuerda la regla [[Design System/UI System Rules]]: Nunca uses colores o valores fijos en píxeles.

```scss
:host {
  display: inline-flex;
  align-items: center;
  border-radius: var(--stp-radius-full);
  padding: var(--stp-spacing-xs) var(--stp-spacing-sm);
  font-size: var(--stp-font-size-sm);
  background-color: var(--stp-color-surface);
  border: 1px solid var(--stp-color-border);
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &.is-selected {
    background-color: var(--stp-color-primary);
    color: var(--stp-color-white);
  }
}
```

### 4. Registrar en `/demo`
Abre `src/app/features/demo/demo.component.html` e incluye una sección mostrando el nuevo componente en sus diferentes variantes y estados (hover, active, disabled).

### 5. Documentar en Obsidian
Crea una nueva nota en `docs/Design System/` utilizando la plantilla [[Component-Template]].

---

## 🔗 Referencias
- [[Design System/UI System Rules]]
- [[Design System/Tokens & Theming]]
- [[Design System/UI Components Catalog]]
