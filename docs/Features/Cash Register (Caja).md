---
title: "Control de Caja & Movimientos de Efectivo"
type: feature
status: active
module: "features/caja"
route: "/caja"
tags:
  - feature
  - caja
  - cash-flow
updated: 2026-09-27
---

# 💵 Control de Caja & Efectivo (`/caja`)

Módulo responsable del control operativo del dinero físico: apertura de turno, registro de entradas y salidas de efectivo y corte de caja diario.

---

## 🎯 Capacidades Principales
- **Apertura de Turno**: Monto base inicial asignado al cajero.
- **Movimientos de Efectivo**: Registro de gastos menores (ej. compra de suministros rápidos, pago a repartidor) y entradas manuales.
- **Balance del Turno**: Cálculo en tiempo real de ingresos por venta al contado menos salidas registradas.
- **Cierre / Arqueo de Caja**: Comparación entre el saldo teórico del sistema y el conteo físico declarado por el cajero, registrando sobrantes o faltantes.

---

## 🏗️ Estructura Técnica
- **Componente Principal**: `CajaComponent` (`src/app/features/caja/caja.component.ts`)

---

## 🔗 Referencias
- [[Features MOC]]
- [[POS & Sales]]
- [[Customer Credits]]
