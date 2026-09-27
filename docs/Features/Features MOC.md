---
title: "Features Map of Content (MOC)"
type: moc
status: active
tags:
  - moc
  - features
  - business-domain
updated: 2026-09-27
---

# 📦 Features Map of Content (MOC)

Centro de documentación de todos los módulos de negocio y funcionalidades de usuario en **StorePointWeb**.

---

## 🗺️ Índice de Módulos Funcionales

| Módulo | Ruta | Descripción | Estado |
| :--- | :--- | :--- | :--- |
| [[Reglas-De-Negocio]] | - | **Especificación formal de reglas de negocio, fórmulas y transiciones**. | `Activo` |
| [[POS & Sales]] | `/sale` | Terminal Punto de Venta, selección rápida, carrito y checkout. | `Completado (Mock)` |
| [[Purchase Orders]] | `/purchase-orders` | Gestión de órdenes de compra a proveedores con estados y drawers. | `Completado (Mock)` |
| [[Customer Credits]] | `/credits` | Control de cuentas por cobrar, cuotas de crédito y cobranzas. | `Completado (Mock)` |
| [[Suppliers Management]] | `/suppliers` | Directorio de proveedores clasificados por tipo de insumo. | `Completado (Mock)` |
| [[Cash Register (Caja)]] | `/caja` | Arqueo de caja, entradas/salidas de efectivo y balance del turno. | `Completado (Mock)` |
| [[Inventory & Products]] | `/products` | Catálogo de existencias, control de stock y alta de productos. | `Completado (Mock)` |
| [[Auth & Security]] | `/login` | Flujo de acceso, roles de usuario e integraciones pendientes. | `En Desarrollo` |

---

## 🔄 Flujo de Valor del Negocio (Retail Journey)

```mermaid
sequenceDiagram
    autonumber
    actor Cajero as Cajero / Vendedor
    participant POS as Módulo POS (/sale)
    participant Caja as Módulo Caja (/caja)
    participant Inv as Inventario (/products)
    participant Cred as Créditos (/credits)

    Cajero->>Caja: 1. Abre turno de caja chica
    Cajero->>POS: 2. Escanea productos al carrito
    alt Venta al Contado
        Cajero->>POS: 3a. Cobra en efectivo o tarjeta
        POS->>Caja: Registra ingreso en arqueo
        POS->>Inv: Descuenta existencias
    else Venta a Crédito
        Cajero->>POS: 3b. Selecciona cliente de crédito
        POS->>Cred: Crea saldo pendiente de cobro
        POS->>Inv: Descuenta existencias
    end
```

---

## 🔗 Referencias Rápidas
- 🏠 Volver al inicio: [[00 - Home (Dashboard)]]
- 🏛️ Arquitectura: [[Architecture MOC]]
- 🎨 Sistema de diseño: [[Design System MOC]]
