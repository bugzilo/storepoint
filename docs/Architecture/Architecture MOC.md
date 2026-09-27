---
title: "Architecture Map of Content (MOC)"
type: moc
status: active
tags:
  - moc
  - architecture
updated: 2026-09-27
---

# 🏛️ Architecture Map of Content (MOC)

Este mapa de contenido agrupa la visión técnica global de **StorePointWeb**, sus principios de diseño, el stack tecnológico y la integración híbrida web-móvil.

---

## 📑 Documentos de Arquitectura

| Documento | Enfoque Principal | Estado |
| :--- | :--- | :--- |
| [[Tech Stack]] | Stack técnico detallado: Angular 21, TypeScript 5.9, SCSS, Capacitor. | `Activo` |
| [[Mapa-Completo-De-Componentes]] | **Mapa exhaustivo de los 48 componentes** de la aplicación y sus dependencias. | `Activo` |
| [[Component & Service Architecture]] | Relaciones Componente ↔ Componente, Componente ↔ Servicio y Modelos/Interfaces. | `Activo` |
| [[State Management]] | Reactividad basada en Signals, `LoadingService`, `ThemeService`. | `Activo` |
| [[Mobile & Capacitor]] | Estrategia híbrida iOS/Android, `StorageService` y Safe Areas. | `Activo` |
| [[Routing & Navigation]] | Estructura de rutas, Layouts responsivos y navegación adaptativa. | `Activo` |

---

## 📐 Diagrama de Alto Nivel del Sistema

```mermaid
flowchart TD
    subgraph UI_Layer [Capa de Presentación / UI]
        MainLayout[MainLayoutComponent]
        Header[AppHeaderComponent]
        Sidebar[SidebarComponent Desktop]
        BottomBar[BottomBarComponent Mobile]
        FeaturePages[Feature Pages: Sale, Orders, Credits, Caja]
        SharedUI[Shared Design System: stp-*]
    end

    subgraph Core_Services [Capa Core / Servicios Centrales]
        LoadingSvc[LoadingService - Contador Concurrente]
        ThemeSvc[ThemeService - Light / Dark Data-Theme]
        StorageSvc[StorageService - Abstracción Web / Nativo]
        BreakSvc[BreakpointService - Detección Mobile / Desktop]
        ConfigSvc[AppConfigService - Environment dev/prod]
    end

    subgraph Native_Platform [Plataforma Híbrida]
        CapacitorCore[Capacitor 8.3 Runtime]
        CapStorage[@capacitor/preferences]
        LocalStorage[Window localStorage]
    end

    MainLayout --> Header
    MainLayout --> Sidebar
    MainLayout --> BottomBar
    MainLayout --> FeaturePages
    FeaturePages --> SharedUI

    FeaturePages --> Core_Services
    StorageSvc --> CapacitorCore
    CapacitorCore -->|Es Nativo| CapStorage
    CapacitorCore -->|Es Web| LocalStorage
```

---

## 🎯 Principios de Arquitectura

1. **Angular 21 Standalone First**: No se utilizan módulos de Angular (`NgModule`). Todos los componentes, directivas y pipes son `standalone: true`.
2. **Signals Sobre RxJS en Estado Local**: El estado de los componentes y servicios se gestiona con `signal()`, `computed()` y `effect()`. RxJS se reserva únicamente para operadores HTTP avanzados o eventos del router.
3. **Desacoplamiento Plataforma-Agnóstico**: La UI nunca llama directamente a APIs nativas o a `localStorage`. Toda persistencia se canaliza a través de [[Mobile & Capacitor#StorageService|StorageService]].
4. **Carga Segura Concurrente**: `LoadingService` utiliza un patrón de contador numérico incremental/decremental que evita que peticiones asíncronas concurrentes oculten prematuramente el indicador de carga.
5. **Separación de Responsabilidades**: Las páginas de features delegan la interacción a componentes de drawer (`MatBottomSheet`) y los controles de formulario a la librería compartida `stp-*`.

---

## 🔗 Navegación Rápida
- 🏠 Volver al inicio: [[00 - Home (Dashboard)]]
- 🎨 Explorar el sistema de diseño: [[Design System MOC]]
- 📦 Ver las funcionalidades: [[Features MOC]]
- ⚖️ Ver decisiones técnicas: [[Decisions MOC]]
