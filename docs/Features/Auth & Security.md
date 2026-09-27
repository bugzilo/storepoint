---
title: "Autenticación & Seguridad"
type: feature
status: in-development
module: "features/auth"
route: "/login"
tags:
  - feature
  - auth
  - security
updated: 2026-09-27
---

# 🔐 Autenticación & Seguridad (`/login`)

Control de acceso, sesión de usuarios y credenciales en **StorePointWeb**.

---

## 🎯 Estado Actual & Componentes
- **Componente**: `LoginComponent` (`src/app/features/auth/login/login.component.ts`)
- **Diseño**: Pantalla independiente sin layout general (`MainLayout`), con selector de tema claro/oscuro flotante e integración con `AppConfigService`.
- **Controles**: Usa `stp-input` con contraseña oculta/visible y `stp-button` con estado de carga `[loading]`.

---

## ⚠️ Integración Pendiente (TODO)
- Conectar con servicio real `AuthService`:
  - `POST /api/v1/auth/login` (envío de email/usuario y contraseña).
  - Almacenamiento seguro del token JWT mediante `StorageService`.
  - Configuración de un interceptor HTTP (`authInterceptor`) para adjuntar el encabezado `Authorization: Bearer <token>`.
  - Creación de guardia de rutas `AuthGuard` para proteger rutas privadas contra accesos anónimos.

---

## 🔗 Referencias
- [[Features MOC]]
- [[Architecture/State Management]]
- [[Architecture/Routing & Navigation]]
