---
title: "Órdenes de Compra (Purchase Orders)"
type: feature
status: active
module: "features/purchase-orders"
route: "/purchase-orders"
tags:
  - feature
  - purchase-orders
  - inventory
  - suppliers
updated: 2026-09-27
---

# 📋 Órdenes de Compra (`/purchase-orders`)

Módulo encargado de gestionar el abastecimiento de mercadería con proveedores mayoristas, control de costos y seguimiento de recepciones de producto.

---

## 🎯 Capacidades Principales
- **Listado y Filtros de Órdenes**: Filtros por estado (`Pendiente`, `Recibida`, `Cancelada`, `En Tránsito`).
- **Creación de Nueva Orden**:
  - Drawer `NewOrderDrawerComponent` accionado mediante botón de cabecera.
  - Selección de proveedor, selección de insumos/productos, cantidades y fecha prevista de entrega.
- **Detalle de Orden**:
  - Drawer `PurchaseOrderDetailDrawerComponent` para consultar el desglose de productos solicitados, total acumulado y cambiar el estado de la orden.
- **Feedback Visual**: Indicadores de carga con `stp-shimmer` y estados de error con `stp-alert`.

---

## 🏗️ Estructura Técnica

- **Componente Principal**: `PurchaseOrdersComponent` (`src/app/features/purchase-orders/purchase-orders.component.ts`)
- **Drawers Específicos**:
  - `NewOrderDrawerComponent` (`src/app/features/purchase-orders/new-order-drawer/`)
  - `PurchaseOrderDetailDrawerComponent` (`src/app/features/purchase-orders/purchase-order-detail-drawer/`)
- **Datos y Modelos**: Interfaces `PurchaseOrder`, `OrderItem`, `OrderStatus` en `purchase-orders.data.ts`.

---

## 🔗 Referencias
- [[Features MOC]]
- [[Suppliers Management]]
- [[Inventory & Products]]
- [[Design System/Modal & Drawer Pattern]]
