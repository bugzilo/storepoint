---
title: "Guía: Compilación y Despliegue Móvil (iOS & Android)"
type: guide
status: active
category: mobile
tags:
  - guide
  - mobile
  - capacitor
  - ios
  - android
updated: 2026-09-27
---

# 📱 Compilación y Despliegue Móvil (iOS & Android)

Procedimiento para compilar, sincronizar y probar **StorePointWeb** en simuladores y dispositivos físicos móviles utilizando Capacitor 8.3.

---

## 📋 Prerrequisitos de Plataforma

### Para iOS (macOS requerido)
- **macOS** actualizado con las herramientas de línea de comandos de Xcode.
- **Xcode 15+** instalado desde la Mac App Store.
- **CocoaPods** instalado: `sudo gem install cocoapods` o `brew install cocoapods`.

### Para Android
- **Android Studio** (versión Iguana o superior recomendada).
- **Android SDK** con plataformas API 33+ instaladas.
- Variable de entorno `ANDROID_HOME` o `ANDROID_SDK_ROOT` configurada.

---

## 🔄 Flujo de Trabajo y Sincronización

Cada vez que realices cambios en el código de Angular (`src/`), debes compilar la aplicación y sincronizar los archivos web con los contenedores nativos:

```bash
# 1. Compilar para producción y sincronizar ambos proyectos (iOS y Android)
npm run cap:sync
```

---

## 🍏 Abrir y Ejecutar en iOS

```bash
# Abre el workspace de Xcode automáticamente
npm run cap:ios
```
1. En Xcode, selecciona el simulador deseado (ej. *iPhone 15 Pro*) o tu dispositivo físico conectado.
2. Asegúrate de configurar tu equipo en **Signing & Capabilities**.
3. Presiona el botón **Play (Run)** o presiona `Cmd + R`.

---

## 🤖 Abrir y Ejecutar en Android

```bash
# Abre el proyecto en Android Studio
npm run cap:android
```
1. Espera a que Gradle termine de indexar y descargar dependencias.
2. Selecciona un Emulador de Android o dispositivo físico con depuración USB habilitada.
3. Presiona el botón verde de **Run**.

---

## ⚠️ Consejos y Troubleshooting Móvil
> [!TIP]
> Si experimentas fallos tras actualizar plugins de Capacitor, ejecuta:
> ```bash
> npx cap sync --inline
> cd ios/App && pod update && cd ../..
> ```

---

## 🔗 Referencias
- [[Architecture/Mobile & Capacitor]]
- [[ADR-002 - Capacitor 8 for Native Mobile]]
- [[Guides MOC]]
