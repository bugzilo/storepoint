---
title: "Gestión de Proveedores"
type: feature
status: active
module: "features/suppliers"
route: "/suppliers"
tags:
  - feature
  - suppliers
updated: 2026-09-27
---

# 🚚 Gestión de Proveedores (`/suppliers`)

Directorio integral de empresas proveedoras de mercadería, datos de contacto comercial, plazos de entrega y categorización por tipo de producto.

---

## 🎯 Capacidades Principales
- **Filtro por Categorías**: Segmentación rápida según el rubro del proveedor (Bebidas, Lácteos, Granos, Abarrotes, Limpieza).
- **Ficha de Proveedor**: Teléfono, persona de contacto, correo y días habituales de despacho.
- **Creación / Edición con Drawer**:
  - `SupplierDrawerComponent`: Formulario accesible desde bottom sheet con validación de campos.

---

## 🏗️ Estructura Técnica
- **Componente Principal**: `SuppliersComponent` (`src/app/features/suppliers/suppliers.component.ts`)
- **Datos Mock**: `src/app/features/suppliers/suppliers.data.ts` (`MOCK_SUPPLIERS`, `SupplierCategory`)
- **Drawer**: `src/app/shared/components/supplier-drawer/`

---

## 🔗 Referencias
- [[Features MOC]]
- [[Purchase Orders]]
