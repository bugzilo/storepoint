import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { MOCK_SUPPLIERS, Supplier } from '../../suppliers/suppliers.data';
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  MOCK_PRODUCTS,
  Product,
  ProductCategory,
} from '../../sale/sale.data';
import {
  PURCHASE_ORDER_STATUS_CONFIG,
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderStatus,
  getLocalDateString,
  getProductImage,
} from '../purchase-orders.data';
import { OrderProductsStepComponent } from './order-products-step/order-products-step.component';
import { AddProductStepComponent } from './add-product-step/add-product-step.component';

export interface OrderFormDrawerData {
  order?: PurchaseOrder;
}

export type OrderFormAction = 'created' | 'updated' | 'confirmed' | 'cancelled';

export interface OrderFormDrawerResult {
  savedOrder: PurchaseOrder;
  action: OrderFormAction;
}

// Backward-compatibility alias
export type NewOrderDrawerResult = OrderFormDrawerResult;

export interface OrderItemDraft {
  product: Product;
  quantity: number;
  unitCost: number;
}

export type NewOrderDrawerStep = 'list' | 'add-product' | 'success';

@Component({
  selector: 'stp-new-order-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    IconComponent,
    BadgeComponent,
    OrderProductsStepComponent,
    AddProductStepComponent,
  ],
  templateUrl: './new-order-drawer.component.html',
  styleUrl: './new-order-drawer.component.scss',
})
export class NewOrderDrawerComponent {
  private readonly sheetRef =
    inject<MatBottomSheetRef<NewOrderDrawerComponent, OrderFormDrawerResult | null>>(MatBottomSheetRef);

  private readonly data = inject<OrderFormDrawerData | null>(MAT_BOTTOM_SHEET_DATA, { optional: true });

  // Mode: creation vs edit
  protected readonly existingOrder = this.data?.order ?? null;
  protected readonly isEditMode = computed(() => !!this.existingOrder);

  // Status configuration and state
  protected readonly statusConfig = PURCHASE_ORDER_STATUS_CONFIG;
  protected readonly currentStatus = signal<PurchaseOrderStatus>(
    this.existingOrder?.status ?? 'pendiente',
  );
  protected readonly pendingActionStatus = signal<PurchaseOrderStatus | null>(null);

  // Step state: default is 'list'
  protected readonly currentStep = signal<NewOrderDrawerStep>('list');
  protected readonly productToEdit = signal<Product | null>(null);
  protected readonly savedResult = signal<OrderFormDrawerResult | null>(null);

  protected readonly suppliers = MOCK_SUPPLIERS.filter(s => s.active);
  protected readonly availableProducts = MOCK_PRODUCTS;
  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly categoryIcons = CATEGORY_ICONS;

  // Form signals initialized from existing order or defaults (empty when creating)
  protected readonly selectedSupplierId = signal<string | number | undefined>(
    this.existingOrder?.supplierId ?? undefined,
  );
  protected readonly paymentTerms = signal<string | number>(
    this.existingOrder?.paymentTerms ?? '',
  );
  protected readonly expectedDeliveryDate = signal<string>(
    this.existingOrder?.expectedDeliveryDate ?? '',
  );
  protected readonly notes = signal<string>(this.existingOrder?.notes ?? '');

  // Selected items draft
  protected readonly itemsDraft = signal<OrderItemDraft[]>(this.initializeItemsDraft());

  protected readonly isSubmitting = signal(false);

  protected readonly selectedSupplier = computed(() => {
    const id = Number(this.selectedSupplierId());
    if (!id) return null;
    return this.suppliers.find(s => s.id === id) ?? null;
  });

  protected readonly totalAmount = computed(() => {
    return this.itemsDraft().reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0,
    );
  });

  protected readonly canSubmit = computed(() => {
    return (
      this.itemsDraft().length > 0 &&
      this.totalAmount() > 0 &&
      !!this.selectedSupplier()
    );
  });

  private initializeItemsDraft(): OrderItemDraft[] {
    if (this.existingOrder && this.existingOrder.items.length > 0) {
      return this.existingOrder.items.map(item => {
        const found = this.availableProducts.find(p => p.id === item.productId);
        const product: Product = found ?? {
          id: item.productId,
          name: item.productName,
          category: (item.category as Exclude<ProductCategory, 'todos'>) || 'abarrotes',
          price: Number((item.unitCost * 1.25).toFixed(2)),
          stock: 30,
          unit: item.unit,
          imageUrl: item.imageUrl ?? getProductImage(item.productId),
        };
        return {
          product,
          quantity: item.quantity,
          unitCost: item.unitCost,
        };
      });
    }

    return [];
  }

  // ── Step Navigation Handlers ──────────────────────────────────
  protected openAddProduct(): void {
    this.productToEdit.set(null);
    this.currentStep.set('add-product');
  }

  protected openEditProduct(product: Product): void {
    this.productToEdit.set(product);
    this.currentStep.set('add-product');
  }

  protected closeAddProduct(): void {
    this.productToEdit.set(null);
    this.currentStep.set('list');
  }

  protected onProductAdded(draft: OrderItemDraft): void {
    this.itemsDraft.update(items => {
      const existingIndex = items.findIndex(i => i.product.id === draft.product.id);
      if (existingIndex >= 0) {
        return items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: draft.quantity, unitCost: draft.unitCost }
            : item,
        );
      }
      return [...items, draft];
    });

    this.closeAddProduct();
  }

  protected onSupplierChange(supplierId: number | string | undefined): void {
    const id = Number(supplierId);
    this.selectedSupplierId.set(id > 0 ? id : undefined);
  }

  // ── Items Management Handlers ─────────────────────────────────
  protected updateQty(productId: number, qty: number | undefined): void {
    const safeQty = Math.max(1, qty ?? 1);
    this.itemsDraft.update(items =>
      items.map(i => (i.product.id === productId ? { ...i, quantity: safeQty } : i)),
    );
  }

  protected updateUnitCost(productId: number, costStr: string): void {
    const cost = parseFloat(costStr);
    const clampedCost = Math.max(0, isNaN(cost) ? 0 : cost);
    this.itemsDraft.update(items =>
      items.map(i =>
        i.product.id === productId ? { ...i, unitCost: clampedCost } : i,
      ),
    );
  }

  protected removeItem(productId: number): void {
    this.itemsDraft.update(items => items.filter(i => i.product.id !== productId));
    if (this.productToEdit()?.id === productId) {
      this.closeAddProduct();
    }
  }

  protected close(): void {
    this.sheetRef.dismiss(null);
  }

  // ── Submission Handlers ────────────────────────────────────────

  /**
   * Create a new purchase order. The default initial status is always 'pendiente'.
   */
  protected createOrder(): void {
    this.pendingActionStatus.set('pendiente');
    this.submitWithStatus('pendiente', 'created');
  }

  /**
   * Save changes to an existing pending purchase order.
   */
  protected saveChanges(): void {
    this.pendingActionStatus.set('pendiente');
    this.submitWithStatus('pendiente', 'updated');
  }

  /**
   * Backward-compatibility alias for createOrder / saveChanges.
   */
  protected saveAsPending(): void {
    if (this.isEditMode()) {
      this.saveChanges();
    } else {
      this.createOrder();
    }
  }

  /**
   * Confirm order ('confirmado'). Once confirmed, cannot be edited.
   */
  protected confirmOrder(): void {
    this.pendingActionStatus.set('confirmado');
    this.submitWithStatus('confirmado', 'confirmed');
  }

  /**
   * Cancel order ('cancelado'). Can only be cancelled while in 'pendiente'.
   */
  protected cancelOrder(): void {
    this.pendingActionStatus.set('cancelado');
    this.submitWithStatus('cancelado', 'cancelled');
  }

  private submitWithStatus(
    status: PurchaseOrderStatus,
    action: OrderFormAction,
  ): void {
    if (!this.canSubmit() && action !== 'cancelled') {
      this.pendingActionStatus.set(null);
      return;
    }

    this.isSubmitting.set(true);
    this.currentStatus.set(status);
    const supplier = this.selectedSupplier();

    const items: PurchaseOrderItem[] = this.itemsDraft().map(draft => ({
      productId: draft.product.id,
      productName: draft.product.name,
      category: draft.product.category,
      imageUrl: draft.product.imageUrl ?? getProductImage(draft.product.id),
      quantity: draft.quantity,
      unit: draft.product.unit,
      unitCost: draft.unitCost,
      subtotal: Number((draft.quantity * draft.unitCost).toFixed(2)),
    }));

    const isEdit = this.isEditMode();
    const existing = this.existingOrder;

    const orderNumber = Math.floor(100 + Math.random() * 900);
    const savedOrder: PurchaseOrder = {
      id: isEdit && existing ? existing.id : Date.now(),
      code: isEdit && existing ? existing.code : `OC-2026-${orderNumber}`,
      createdAt: isEdit && existing ? existing.createdAt : new Date().toISOString(),
      expectedDeliveryDate: this.expectedDeliveryDate() || undefined,
      supplierId: supplier ? supplier.id : 0,
      supplierName: supplier ? supplier.name : '',
      supplierRuc: supplier ? supplier.ruc : '',
      supplierPhone: supplier ? supplier.phone : '',
      supplierEmail: supplier?.email,
      supplierAddress: supplier?.address,
      status,
      items,
      totalAmount: this.totalAmount(),
      paymentTerms: String(this.paymentTerms()),
      notes: this.notes().trim() || undefined,
    };

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.pendingActionStatus.set(null);
      if (action === 'created') {
        this.savedResult.set({ savedOrder, action });
        this.currentStep.set('success');
      } else {
        this.sheetRef.dismiss({ savedOrder, action });
      }
    }, 300);
  }

  protected done(): void {
    this.sheetRef.dismiss(this.savedResult());
  }
}
