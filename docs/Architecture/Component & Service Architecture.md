---
title: "Arquitectura de Relaciones: Componentes, Servicios, Modelos e Interfaces"
type: architecture
status: active
tags:
  - architecture
  - components
  - services
  - models
  - data-flow
updated: 2026-09-27
---

# 🏗️ Arquitectura de Relaciones: Componentes, Servicios, Modelos e Interfaces

Este documento detalla cómo interactúan y se comunican entre sí los **Componentes**, **Servicios**, **Modelos** e **Interfaces** en **StorePointWeb**, siguiendo las mejores prácticas de Angular 21 Standalone y Signals.

---

## 🗺️ Visión General: Las 3 Capas de la Aplicación

```mermaid
flowchart TD
    subgraph Capa_Modelos [1. Capa de Modelos & Contratos TypeScript]
        Entities[Entidades de Dominio: Product, Customer, Credit, PurchaseOrder]
        DrawerContracts[Contratos Drawer: DrawerData, DrawerResult]
        UITypes[Tipos de Presentación: ButtonVariant, BadgeVariant, ProductCategory]
    end

    subgraph Capa_Servicios [2. Capa de Servicios & Estado]
        DomainServices[Servicios de Dominio: CustomerService, SaleService]
        InfraServices[Servicios de Infraestructura: StorageService, BreakpointService, AppConfigService]
        GlobalUIServices[Servicios UI Globales: LoadingService, ThemeService]
    end

    subgraph Capa_Componentes [3. Capa de Componentes Angular]
        Layouts[Layouts: MainLayoutComponent, AppHeader, Sidebar / BottomBar]
        SmartPages[Smart Pages: SaleComponent, PurchaseOrdersComponent, CreditsComponent]
        Drawers[Drawers MatBottomSheet: CartDrawer, NewOrderDrawer, CreditDetailDrawer]
        DumbUI[Dumb / Shared UI: stp-button, stp-input, stp-badge, stp-card]
    end

    Capa_Modelos -. Tipan .-> Capa_Servicios
    Capa_Modelos -. Tipan .-> Capa_Componentes
    SmartPages -->|inject| DomainServices
    SmartPages -->|inject| GlobalUIServices
    Layouts -->|inject| InfraServices
    SmartPages -->|Abre via MatBottomSheet| Drawers
    SmartPages -->|Componen en Template| DumbUI
    Drawers -->|Componen en Template| DumbUI
```

---

## 🧩 1. Relación Entre Componentes (Component-to-Component)

En StorePointWeb existen tres niveles principales de componentes y dos mecanismos de comunicación entre ellos:

### A. Jerarquía de Composición: Smart vs Dumb
1. **Smart Components (Páginas / Contenedores)**:
   - *Ejemplos*: `SaleComponent`, `PurchaseOrdersComponent`, `CreditsComponent`.
   - *Rol*: Conocen el contexto de negocio, inyectan servicios (`inject()`), administran Signals de página y orquestan la apertura de drawers.
2. **Dumb / Presentational Components (UI Compartida `stp-*`)**:
   - *Ejemplos*: `<stp-button>`, `<stp-input>`, `<stp-badge>`, `<stp-card>`.
   - *Rol*: Son 100% agnósticos de la lógica de negocio. Reciben datos mediante `input()` y emiten eventos de usuario mediante `output()`.
   - *Formularios*: Implementan `ControlValueAccessor` (CVA) para enlazarse limpiamente con `[(value)]` o `ReactiveFormsModule`.

```mermaid
sequenceDiagram
    autonumber
    participant Smart as Smart Page (SaleComponent)
    participant Dumb as Dumb Component (SaleProductCardComponent)
    participant UI as Control UI (stp-button / stp-input-numeric)

    Smart->>Dumb: input: product = Product
    Smart->>Dumb: input: quantity = number
    Dumb->>UI: Renderiza precio, foto y botón
    UI->>Dumb: Evento click / cambio de cantidad
    Dumb->>Smart: output: addToCart.emit(product)
    Smart->>Smart: Actualiza cartItems.update(...)
```

---

### B. Comunicación Desacoplada de Drawers (`MatBottomSheet`)
En lugar de incrustar diálogos pesados o modales condicionales (`*ngIf="showModal"`) en el template del padre, los drawers se invocan dinámicamente mediante **`MatBottomSheet`**.

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant Padre as PurchaseOrdersComponent
    participant CDK as MatBottomSheet Service
    participant Drawer as NewOrderDrawerComponent
    participant Servicio as Insumos / SupplierService

    Usuario->>Padre: Click en "Nueva Orden"
    Padre->>CDK: open(NewOrderDrawerComponent, { data: OrderFormDrawerData })
    CDK->>Drawer: Inyecta MAT_BOTTOM_SHEET_DATA
    Drawer->>Servicio: Consulta lista de proveedores
    Usuario->>Drawer: Llena formulario y click "Crear Orden"
    Drawer->>CDK: sheetRef.dismiss({ order: newOrder, created: true })
    CDK->>Padre: afterDismissed().subscribe(result)
    Padre->>Padre: Si result.created == true, actualiza orders.update(...)
```

**Beneficios arquitectónicos:**
- Desacoplamiento total: El componente padre no renderiza el DOM del modal hasta que se abre.
- Aislamiento de estado: El drawer tiene su propio ciclo de vida e inputs limpios tipados mediante contratos de TypeScript.

---

## ⚡ 2. Relación Componente ↔ Servicios (Component-to-Service)

La comunicación entre componentes y servicios sigue un **Flujo de Datos Unidireccional Reactivo** basado en Signals:

```mermaid
flowchart LR
    subgraph Servicio [Servicio de Dominio / Estado]
        StatePrivate["_customers = signal<Customer[]>([]) (Privado)"]
        StatePublic["customers = _customers.asReadonly() (Público)"]
        MethodMutate["add(data) / update(id, data) (Acciones)"]
    end

    subgraph Componente [Smart Component]
        Inject["customerService = inject(CustomerService)"]
        Compute["activeCustomers = computed(...)"]
        Template["Plantilla HTML (Consumo OnPush)"]
        UserAction["Handler: onSaveCustomer()"]
    end

    StatePrivate --> StatePublic
    StatePublic --> Compute --> Template
    Inject --> UserAction
    UserAction -->|Invoca| MethodMutate
    MethodMutate -->|Mutación Pura| StatePrivate
```

### Tipos de Servicios y su Integración con Componentes

| Categoría | Servicio | Cómo se Relaciona con los Componentes |
| :--- | :--- | :--- |
| **Dominio** | `CustomerService` | Expone signals de solo lectura (`customers`) y métodos atómicos (`add`, `update`, `search`). Los componentes consumen los datos con `computed()`. |
| **Infraestructura** | `StorageService` | Desacopla la persistencia. Detecta si la app corre en iOS/Android nativo (`@capacitor/preferences`) o Web (`localStorage`). Los componentes nunca tocan `window.localStorage`. |
| **UI Global** | `LoadingService` | Posee un contador numérico concurrente (`counter = signal(0)`). El interceptor HTTP `loadingInterceptor` lo incrementa en cada petición; `LoaderComponent` escucha reactivamente si `isLoading = counter > 0`. |
| **UI Global** | `ThemeService` | Administra el signal `theme` (`'light' \| 'dark'`). Modifica el atributo `data-theme` en `<html>` y persiste el estado automáticamente con un `effect()`. |
| **Layout** | `BreakpointService` | Escucha media queries de pantalla. `MainLayoutComponent` lo usa para alternar dinámicamente entre `SidebarComponent` (Desktop) y `BottomBarComponent` (Móvil). |

---

## 📐 3. Relación de Modelos, Interfaces y Tipos de Datos

Para evitar el acoplamiento rígido, los tipos de TypeScript se dividen en 4 responsabilidades bien definidas:

```mermaid
classDiagram
    class Product {
        +number id
        +string name
        +ProductCategory category
        +number price
        +number stock
        +string unit
        +string supplier
    }

    class CartItem {
        +Product product
        +number quantity
    }

    class CartBottomSheetData {
        +CartItem[] items
    }

    class CartDismissResult {
        +CartItem[] items
        +boolean confirmed
        +PaymentData payment
        +Customer customer
    }

    class Customer {
        +number id
        +string names
        +string phone
        +string dni
    }

    CartItem *-- Product : contiene
    CartBottomSheetData *-- CartItem : transfiere a Drawer
    CartDismissResult *-- CartItem : retorna
    CartDismissResult *-- Customer : asocia cliente
```

### Clasificación de Interfaces en el Proyecto:

1. **Entidades de Dominio (Domain Entities)**:
   - Representan los conceptos fundamentales del negocio.
   - *Ejemplos*: `Product` (en `sale.data.ts`), `Customer` (en `customer.service.ts`), `PurchaseOrder` (en `purchase-orders.data.ts`), `Credit` (en `credits.data.ts`).
2. **Contratos de Comunicación de Drawers (I/O Contracts)**:
   - Tipos explícitos para lo que entra (`*Data`) y lo que sale (`*Result`) de un modal.
   - *Ejemplos*: `CartBottomSheetData` / `CartDismissResult`, `OrderFormDrawerData` / `OrderFormDrawerResult`.
3. **Modelos de Mutación y Formularios (DTOs)**:
   - Usan utilidades de TypeScript (`Omit`, `Partial`, `Pick`) para garantizar que la creación no exija IDs autonuméricos del backend.
   - *Ejemplo*: `Omit<Customer, 'id'>` en `CustomerService.add()`.
4. **Tipos de Presentación de UI**:
   - Enums o Union Types que restringen variantes de diseño.
   - *Ejemplos*: `BadgeVariant` (`'success' | 'warning' | 'danger'`), `ButtonVariant`, `ProductCategory`.

---

## 🚀 Resumen del Ciclo de Vida de una Petición / Interacción

```text
[1. Usuario hace clic en UI]
         │
         ▼
[2. stp-button / stp-input emite output]
         │
         ▼
[3. Smart Component maneja el evento]
         ├── Si requiere vista compleja ──> Abre MatBottomSheet con DrawerData
         └── Si es una acción directa    ──> Invoca método en el Servicio
                                                      │
                                                      ▼
                                       [4. Servicio ejecuta lógica]
                                                      ├── Lanza HTTP (loadingInterceptor activa LoadingService)
                                                      └── Muta Signal interno (_state.update)
                                                                      │
                                                                      ▼
                                                       [5. Signals de solo lectura emiten]
                                                                      │
                                                                      ▼
                                                       [6. computed() en componentes se recalculan]
                                                                      │
                                                                      ▼
                                                       [7. Template OnPush se actualiza en el DOM]
```

---

## 🔗 Referencias
- [[Architecture MOC]]
- [[State Management]]
- [[Design System/Modal & Drawer Pattern]]
- [[UI Components Catalog]]
