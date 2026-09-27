---
title: "Inventario & Catálogo de Productos"
type: feature
status: active
module: "features/products"
route: "/products"
tags:
  - feature
  - inventory
  - products
updated: 2026-09-27
---

# 📦 Inventario & Catálogo de Productos (`/products`)

Módulo de administración del inventario, control de existencias mínimas, precios de venta y catálogo general de artículos.

---

## 🎯 Capacidades Principales
- **Listado y Búsqueda**: Filtrado por categoría, código de barras, SKU y nombre comercial.
- **Alertas de Stock**: Indicadores visuales para productos con bajo stock o agotados.
- **Alta y Edición de Productos**:
  - `InventoryDrawerComponent`: Formulario tipo bottom sheet para ingresar nuevos productos con precio de costo, precio de venta, categoría y stock inicial.

---

## 🏗️ Estructura Técnica
- **Componente Principal**: `ProductsComponent` (o `SaleComponent` para vista rápida)
- **Drawer**: `src/app/shared/components/inventory-drawer/`
- **Modelos**: Interfaces de Producto en `src/app/features/sale/sale.data.ts`.

---

## 🔗 Referencias
- [[Features MOC]]
- [[POS & Sales]]
- [[Purchase Orders]]
