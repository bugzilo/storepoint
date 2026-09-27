---
title: "Guía: Inicio Rápido & Configuración Local"
type: guide
status: active
category: setup
tags:
  - guide
  - setup
  - onboarding
updated: 2026-09-27
---

# 🚀 Inicio Rápido & Configuración Local

Esta guía te llevará paso a paso para configurar tu entorno de desarrollo y ejecutar **StorePointWeb** localmente.

---

## 📋 Prerrequisitos
- **Node.js**: Versión `20.x` o superior (LTS recomendada).
- **npm**: Versión `10.x` o superior.
- **Git**: Configurado en tu máquina.

---

## 🛠️ Instalación y Arranque

### 1. Clonar e Instalar Dependencias
```bash
git clone <url-del-repositorio> storePointWeb
cd storePointWeb
npm install
```

### 2. Iniciar el Servidor de Desarrollo
```bash
npm start
```
Abre tu navegador en `http://localhost:4200`. La aplicación se recargará automáticamente al modificar archivos de código fuente.

### 3. Ejecución con Docker (Opcional)
Para probar la compilación de producción servida con Nginx idéntica al entorno de despliegue:
```bash
docker build -t storepoint-web .
docker run -p 8080:80 storepoint-web
```
Luego visita `http://localhost:8080`.

---

## 🧪 Verificación de Calidad
Antes de realizar cualquier commit o Pull Request:
```bash
npm test          # Ejecuta los tests con Vitest
npm run lint      # Valida reglas de tipado y templates
```

---

## 🔗 Referencias
- [[Guides MOC]]
- [[Architecture/Tech Stack]]
- [[Mobile Build & Deploy (iOS-Android)]]
