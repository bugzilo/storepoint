---
title: "Guía: Estándares de Calidad y Pruebas Unitarias"
type: guide
status: active
category: testing
tags:
  - guide
  - testing
  - vitest
  - eslint
updated: 2026-09-27
---

# 🧪 Estándares de Calidad y Pruebas Unitarias

Guía para escribir y mantener pruebas unitarias rápidas y limpias en **StorePointWeb** utilizando **Vitest** y **ESLint**.

---

## ⚡ Vitest vs Karma/Jasmine
Este proyecto utiliza **Vitest** en lugar del ejecutor tradicional de Angular (Karma), lo cual ofrece:
- Tiempos de ejecución instantáneos (segundos vs minutos).
- Soporte nativo para ESM y TypeScript sin empaquetadores lentos.
- Ejecución en terminal sin requerir lanzar una instancia completa de Chrome headless.

```bash
# Ejecutar todas las pruebas unitarias
npm test

# Ejecutar pruebas en modo observador (watch) durante desarrollo
npx vitest watch
```

---

## 📐 Estructura Típica de un Test de Componente

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();
  });

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('debe reflejar el estado disabled', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const buttonEl = fixture.nativeElement.querySelector('button');
    expect(buttonEl.disabled).toBe(true);
  });
});
```

---

## 🔍 Reglas de Linter (ESLint)
Ejecuta la revisión estática de código con:
```bash
npm run lint
```
- Valida consistencia en TypeScript, imports no utilizados y variables muertas.
- Asegura que las plantillas HTML respeten directivas estándar y nombres de selectores (`stp-*`).

---

## 🔗 Referencias
- [[Guides MOC]]
- [[Architecture/Tech Stack]]
