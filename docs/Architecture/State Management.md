---
title: "Manejo de Estado & Reactividad"
type: architecture
status: active
tags:
  - architecture
  - state-management
  - signals
updated: 2026-09-27
---

# ⚡ Manejo de Estado & Reactividad

En **StorePointWeb**, el estado de la aplicación se gestiona de manera moderna y eficiente utilizando **Angular Signals**, evitando la sobrecarga y complejidad de bibliotecas pesadas de gestión de estado (como NgRx Store o Akita).

---

## 🎯 Principio Fundamental: Signals First

Toda reactividad de interfaz de usuario y estado local se construye utilizando primitivas de Signals:
- `signal<T>(initialValue)`: Estado mutable directo.
- `computed(() => expression)`: Estado derivado memorizado automáticamente.
- `effect(() => ...)`: Efectos secundarios controlados (ej. sincronizar con `localStorage` o manipular el DOM).

```typescript
// Ejemplo típico en componentes de StorePoint
export class SaleComponent {
  private cartItems = signal<CartItem[]>([]);
  
  // Estado derivado calculado automáticamente
  readonly totalAmount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

  readonly itemCount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
}
```

---

## 🔄 Servicios Core de Estado

### 1. `LoadingService` & `loadingInterceptor`
Ubicación: `src/app/core/services/loading.service.ts` y `src/app/core/interceptors/loading.interceptor.ts`.

- **Mecanismo**: Utiliza un patrón de **contador numérico** (`counter = signal(0)`).
- **Problema que resuelve**: Si dos llamadas HTTP (`GET /products` y `GET /cart`) ocurren concurrentemente, un simple booleano apagaría el spinner cuando la primera termine.
- **Comportamiento**:
  - Cada petición HTTP interceptada incrementa el contador: `loadingService.show()` (`counter++`).
  - Al finalizar (en `finalize()`), decrementa el contador: `loadingService.hide()` (`counter--`).
  - El estado observable `isLoading = computed(() => counter() > 0)` solo se vuelve `false` cuando **todas** las peticiones concurrentes han concluido.

### 2. `ThemeService`
Ubicación: `src/app/core/services/theme.service.ts`.

- **Mecanismo**: Lee la preferencia de tema (`'light' | 'dark'`) desde [[Mobile & Capacitor#StorageService|StorageService]].
- Aplica el atributo `data-theme="dark"` o `data-theme="light"` en la etiqueta raíz `<html>` del documento.
- Persiste la preferencia del usuario inmediatamente mediante un `effect()`.

### 3. `BreakpointService`
Ubicación: `src/app/core/services/breakpoint.service.ts`.

- Detecta de forma reactiva si el dispositivo es móvil, tablet o desktop según las constantes definidas en `src/app/core/constants/breakpoints.ts`.
- Permite que la vista alterne automáticamente entre `SidebarComponent` (escritorio) y `BottomBarComponent` (móvil).

---

## 🚫 Antipatrones Prohibidos

1. ❌ **No usar `Subject` o `BehaviorSubject` para estado local de UI**: Reemplazar siempre por `signal()`.
2. ❌ **No suscribirse manualmente (`.subscribe()`) dentro de componentes**: Cuando se consuman Signals en plantillas, usar la invocación de función directa `mySignal()`.
3. ❌ **No manipular el DOM directamente**: Utilizar `effect()` o directivas de Angular con clases basadas en estado.

---

## 🔗 Referencias
- [[Architecture MOC]]
- [[ADR-001 - Angular Signals State Management]]
- [[Tech Stack]]
