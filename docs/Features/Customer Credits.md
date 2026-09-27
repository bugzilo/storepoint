---
title: "Créditos a Clientes (Cuentas por Cobrar)"
type: feature
status: active
module: "features/credits"
route: "/credits"
tags:
  - feature
  - credits
  - finance
  - customers
updated: 2026-09-27
---

# 💳 Créditos a Clientes (`/credits`)

Módulo para el control de créditos otorgados (ventas "al fiado"), historial de abonos parciales, alertas de mora y saldos pendientes por cliente.

---

## 🎯 Capacidades Principales
- **Agrupación de Clientes**: Segmentación por tipo de cuenta (Frecuentes, Minoristas, Con Saldo Vencido).
- **Control de Cuotas y Pagos**:
  - Registro de abonos parciales o liquidación total del crédito.
  - Actualización reactiva del balance remanente.
- **Drawers Especializados**:
  - `CreditDrawerComponent`: Creación de una nueva línea de crédito asociada a un cliente.
  - `CreditDetailDrawerComponent`: Vista a profundidad con historial de pagos y desglose de cuotas.
- **Alertas y Estado de Crédito**:
  - Estados: `Al Día`, `Próximo a Vencer`, `En Mora`, `Liquidado`.

---

## 🏗️ Estructura Técnica

- **Componente Principal**: `CreditsComponent` (`src/app/features/credits/credits.component.ts`)
- **Datos y Modelos**: `src/app/features/credits/credits.data.ts` (`MOCK_CREDITS`, `Credit`, `CustomerGroup`, `CreditStatus`)
- **Drawers Compartidos**:
  - `src/app/shared/components/credit-drawer/`
  - `src/app/shared/components/credit-detail-drawer/`

---

## 🔗 Referencias
- [[Features MOC]]
- [[POS & Sales]]
- [[Cash Register (Caja)]]
