---
title: "Tech Stack & Herramientas"
type: architecture
status: active
tags:
  - architecture
  - stack
  - angular
  - capacitor
updated: 2026-09-27
---

# 🛠️ Tech Stack & Herramientas

Documentación detallada de las tecnologías y herramientas utilizadas en **StorePointWeb**.

---

## 💻 Frontend Web & Core

| Tecnología | Versión | Rol en el Proyecto |
| :--- | :--- | :--- |
| **Angular** | `^21.x` | Framework principal SPA. Arquitectura 100% basada en componentes Standalone. |
| **TypeScript** | `~5.9.x` | Tipado estático con `strict: true`. Garantiza solidez en modelos y contratos. |
| **Angular Signals** | Nativo de Angular | Gestión de estado reactivo sincrónico y derivado. |
| **Angular CDK** | `^21.x` | Componentes primitivos, accesibilidad y `@angular/cdk/bottom-sheet` para drawers. |
| **SCSS** | Dart Sass | Preprocesador de estilos con variables CSS nativas para theming dinámico. |

---

## 📱 Móvil & Multiplataforma

| Tecnología | Versión | Rol en el Proyecto |
| :--- | :--- | :--- |
| **Capacitor** | `^8.3.x` | Runtime de contenedor nativo que compila la SPA a iOS y Android. |
| **@capacitor/preferences** | `^8.x` | Almacenamiento nativo seguro para iOS (UserDefaults) y Android (SharedPreferences). |
| **Xcode / Swift** | 15+ | Entorno nativo de iOS ubicado en `/ios`. |
| **Android Studio / Gradle** | 8+ | Entorno nativo de Android ubicado en `/android`. |

---

## 🧪 Pruebas, Linting y Calidad de Código

| Herramienta | Rol en el Proyecto |
| :--- | :--- |
| **Vitest** | Framework de pruebas unitarias ultrarrápido compatible con ESM y TypeScript. |
| **ESLint** | Análisis estático de código TypeScript y reglas de templates Angular. |
| **Angular ESLint** | Fuerza prefijos obligatorios de componentes (`stp-` para elementos y `stp` para directivas). |
| **Prettier** | Formateador consistente de código. |

---

## 🐳 Infraestructura & Despliegue Web

- **Docker**: Configuración basada en `Dockerfile` multi-stage con build de Angular en Node.js y servidor ligero Nginx en producción.
- **Nginx**: Archivo `nginx.conf` optimizado con compresión gzip, enrutamiento HTML5 History API (`try_files $uri /index.html`) y encabezados de caché seguros.
- **Entornos (`src/environments/`)**:
  - `environment.ts`: Desarrollo local.
  - `environment.dev.ts`: Staging / testing.
  - `environment.prod.ts`: Producción.
  Gestionados a través de `AppConfigService` y `angular.json` fileReplacements.

---

## 🔗 Referencias
- [[Architecture MOC]]
- [[State Management]]
- [[Mobile & Capacitor]]
