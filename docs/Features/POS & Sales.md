---
title: "Módulo POS & Ventas"
type: feature
status: active
module: "features/sale"
route: "/sale"
tags:
  - feature
  - pos
  - sales
  - cart
updated: 2026-09-27
---

# 🛒 Módulo POS & Ventas (`/sale`)

El módulo de Punto de Venta (POS) es la interfaz central donde los operadores registran transacciones de venta de forma ágil y táctil.

---

## 🎯 Capacidades Principales
- **Búsqueda y Filtrado**: Filtros por categoría de producto mediante chips/tags interactivos y barra de búsqueda con autocompletado rápido.
- **Catálogo Visual**: Renderizado de productos con `SaleProductCardComponent` optimizado para toque móvil.
- **Carrito de Compras Reactivo**:
  - En Desktop: Panel lateral desplegado con resumen de subtotales, impuestos y total.
  - En Móvil: Botón flotante de resumen que abre `CartDrawerComponent` (`MatBottomSheet`).
- **Modificación de Cantidades**: Integración con `stp-input-numeric` para ajuste rápido.
- **Proceso de Cobro**: Selección de métodos de pago (Efectivo, Tarjeta, Transferencia, Crédito a Cliente).

---

## 🏗️ Estructura Técnica

- **Componente Principal**: `SaleComponent` (`src/app/features/sale/sale.component.ts`)
- **Datos Mock**: `src/app/features/sale/sale.data.ts` (`MOCK_PRODUCTS`, `PRODUCT_CATEGORIES`)
- **Modelos de Carrito**: `src/app/core/models/cart.model.ts` (`CartItem`, `CartSummary`)
- **Drawers Asociados**: `CartDrawerComponent`

---

## ⚠️ Tareas Pendientes (TODOs de Integración)
- Conexión del endpoint HTTP para confirmación de la venta contra el backend.
- Impresión de ticket térmico o envío digital por WhatsApp (`environment.whatsappUrl`).
- Integración de escaneo de código de barras mediante cámara nativa con plugin de Capacitor.

---

## 🔗 Referencias
- [[Features MOC]]
- [[Architecture/State Management]]
- [[Design System/Modal & Drawer Pattern]]
