---
title: "Architecture Decisions (ADR) Map of Content"
type: moc
status: active
tags:
  - moc
  - adr
  - decisions
updated: 2026-09-27
---

# ⚖️ Architecture Decisions (ADR) Map of Content

Un **Architecture Decision Record (ADR)** es un documento conciso que captura una decisión arquitectónica importante junto con su contexto, consecuencias y alternativas descartadas.

> [!TIP]
> Para proponer o registrar una nueva decisión técnica, crea un archivo en esta carpeta utilizando la plantilla [[ADR-Template]].

---

## 📑 Registro Histórico de Decisiones

| ID | Título | Estado | Fecha | Decisión Principal |
| :--- | :--- | :--- | :--- | :--- |
| [[ADR-001 - Angular Signals State Management\|ADR-001]] | Angular Signals como única estrategia de estado | `Aceptada` | 2026-09-26 | Eliminar RxJS para estado local; usar `signal()`, `computed()` y `effect()`. |
| [[ADR-002 - Capacitor 8 for Native Mobile\|ADR-002]] | Capacitor 8.3 para apps nativas iOS y Android | `Aceptada` | 2026-09-26 | Mantener un único codebase web y compilar a móvil nativo vía Capacitor. |
| [[ADR-003 - MatBottomSheet for Drawer Overlays\|ADR-003]] | MatBottomSheet para todos los modales y drawers | `Aceptada` | 2026-09-26 | Prohibir modales flotantes manuales; estandarizar en bottom sheets táctiles. |

---

## 🔗 Referencias
- 🏠 Volver al inicio: [[00 - Home (Dashboard)]]
- 🏛️ Arquitectura: [[Architecture MOC]]
- 📝 Plantilla de nuevo ADR: [[ADR-Template]]
