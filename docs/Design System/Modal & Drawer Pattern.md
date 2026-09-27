---
title: "Patrón de Modales & Drawers (MatBottomSheet)"
type: design-system
status: active
tags:
  - design-system
  - ui-pattern
  - drawers
  - mat-bottom-sheet
updated: 2026-09-27
---

# 📱 Patrón de Modales & Drawers (MatBottomSheet)

En **StorePointWeb**, todas las ventanas emergentes, formularios secundarios y vistas de detalle se implementan exclusivamente como **Bottom Sheets** (paneles deslizables desde la parte inferior) a través de `MatBottomSheet` del Angular Material CDK.

---

## 🎯 ¿Por qué MatBottomSheet en lugar de Dialogs o Modales Flotantes?

1. **Mobile-First por Naturaleza**: En pantallas móviles, los modales centrados flotantes son incómodos para la mano y suelen cubrir elementos esenciales. Un bottom sheet se adapta naturalmente al pulgar.
2. **Consistencia de Experiencia**: Tanto en iOS como en Android, los paneles inferiores con gesto de arrastre para cerrar son el estándar de experiencia nativa.
3. **Escalabilidad en Pantallas Grandes**: En escritorio, el bottom sheet puede configurarse con ancho máximo centrado, comportándose elegantemente sin romper la metáfora.

---

## 🏗️ Drawers Implementados en el Proyecto

| Drawer | Ubicación | Disparado Desde |
| :--- | :--- | :--- |
| **CartDrawer** | `shared/components/cart-drawer/` | Botón del carrito en `/sale` |
| **InventoryDrawer** | `shared/components/inventory-drawer/` | Acción "Nuevo Producto" en `/products` |
| **SupplierDrawer** | `shared/components/supplier-drawer/` | Acción "Nuevo Proveedor" en `/suppliers` |
| **CreditDrawer** | `shared/components/credit-drawer/` | Crear crédito en `/credits` |
| **CreditDetailDrawer** | `shared/components/credit-detail-drawer/` | Click en tarjeta de crédito en `/credits` |
| **NewOrderDrawer** | `features/purchase-orders/new-order-drawer/` | "Nueva Orden" en `/purchase-orders` |
| **PurchaseOrderDetailDrawer** | `features/purchase-orders/purchase-order-detail-drawer/` | Ver detalle de orden |

---

## 💻 Patrón de Código Estándar para Abrir un Drawer

```typescript
import { inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NewOrderDrawerComponent } from './new-order-drawer/new-order-drawer.component';

export class PurchaseOrdersComponent {
  private bottomSheet = inject(MatBottomSheet);

  openNewOrderDrawer(): void {
    const sheetRef = this.bottomSheet.open(NewOrderDrawerComponent, {
      data: { initialSupplierId: '123' },
      panelClass: 'stp-drawer-container'
    });

    sheetRef.afterDismissed().subscribe((result) => {
      if (result?.created) {
        this.reloadOrders();
      }
    });
  }
}
```

---

## 🔗 Referencias
- [[Design System MOC]]
- [[UI System Rules]]
- [[ADR-003 - MatBottomSheet for Drawer Overlays]]
