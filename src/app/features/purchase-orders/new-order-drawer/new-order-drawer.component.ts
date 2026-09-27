import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { InputNumericComponent } from '../../../shared/components/input-numeric/input-numeric.component';
import { SelectComponent, SelectOption } from '../../../shared/components/select/select.component';
import { TagComponent } from '../../../shared/components/tag/tag.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { MOCK_SUPPLIERS } from '../../suppliers/suppliers.data';
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

@Component({
  selector: 'stp-new-order-drawer',
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    ButtonComponent,
    IconComponent,
    CardComponent,
    InputComponent,
    InputNumericComponent,
    SelectComponent,
    TagComponent,
    BadgeComponent,
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

  protected readonly suppliers = MOCK_SUPPLIERS.filter(s => s.active);
  protected readonly availableProducts = MOCK_PRODUCTS;
  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly categoryIcons = CATEGORY_ICONS;

  // Form signals initialized from existing order or defaults
  protected readonly selectedSupplierId = signal<string | number>(
    this.existingOrder?.supplierId ?? this.suppliers[0]?.id ?? 1,
  );
  protected readonly paymentTerms = signal<string | number>(
    this.existingOrder?.paymentTerms ?? 'Contado',
  );
  protected readonly expectedDeliveryDate = signal<string>(
    this.existingOrder?.expectedDeliveryDate ??
      getLocalDateString(new Date(Date.now() + 86400000 * 2)),
  );
  protected readonly notes = signal<string>(this.existingOrder?.notes ?? '');
  protected readonly selectedProductId = signal<string | number>('');

  // ── Product Live Preview state ──────────────────────────────────
  protected readonly previewProduct = signal<Product | null>(null);
  protected readonly previewQuantity = signal<number>(10);
  protected readonly previewUnitCost = signal<number>(0);

  // Computed preview subtotal
  protected readonly previewSubtotal = computed(() => {
    return Number((this.previewQuantity() * this.previewUnitCost()).toFixed(2));
  });

  // Select options for stp-select
  protected readonly supplierOptions = computed<SelectOption[]>(() =>
    this.suppliers.map(s => ({
      value: s.id,
      label: `${s.name} (RUC: ${s.ruc})`,
    })),
  );

  protected readonly paymentTermOptions: SelectOption[] = [
    { value: 'Contado', label: 'Contado' },
    { value: 'Crédito 15 días', label: 'Crédito 15 días' },
    { value: 'Crédito 30 días', label: 'Crédito 30 días' },
    { value: 'Crédito 60 días', label: 'Crédito 60 días' },
  ];

  protected readonly productOptions = computed<SelectOption[]>(() => [
    { value: '', label: 'Seleccionar producto...' },
    ...this.availableProducts.map(p => ({
      value: p.id,
      label: `${p.name} (${p.unit})`,
    })),
  ]);

  // Selected items draft
  protected readonly itemsDraft = signal<OrderItemDraft[]>(this.initializeItemsDraft());

  protected readonly isSubmitting = signal(false);

  protected readonly selectedSupplier = computed(() => {
    const id = Number(this.selectedSupplierId());
    return this.suppliers.find(s => s.id === id) ?? this.suppliers[0];
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

    // Default sample for new order
    return [
      {
        product: this.availableProducts[0],
        quantity: 20,
        unitCost: 24.0,
      },
      {
        product: this.availableProducts[1],
        quantity: 15,
        unitCost: 7.2,
      },
    ];
  }

  // ── Product Selection & Preview Handlers ───────────────────────
  protected onAddProductSelect(value: string | number): void {
    const id = Number(value);
    if (!id) {
      this.previewProduct.set(null);
      return;
    }
    const prod = this.availableProducts.find(p => p.id === id);
    if (!prod) return;

    // Show in preview card with suggested cost and quantity
    this.previewProduct.set(prod);
    this.previewQuantity.set(10);
    this.previewUnitCost.set(Number((prod.price * 0.8).toFixed(2)));
  }

  protected inspectProduct(product: Product): void {
    const existing = this.itemsDraft().find(i => i.product.id === product.id);
    this.previewProduct.set(product);
    this.previewQuantity.set(existing?.quantity ?? 10);
    this.previewUnitCost.set(
      existing?.unitCost ?? Number((product.price * 0.8).toFixed(2)),
    );
  }

  protected closePreview(): void {
    this.previewProduct.set(null);
    this.selectedProductId.set('');
  }

  protected confirmAddPreviewedProduct(): void {
    const prod = this.previewProduct();
    if (!prod) return;

    const qty = Math.max(1, this.previewQuantity());
    const cost = Math.max(0, this.previewUnitCost());

    this.itemsDraft.update(items => {
      const existingIndex = items.findIndex(i => i.product.id === prod.id);
      if (existingIndex >= 0) {
        return items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + qty, unitCost: cost }
            : item,
        );
      }
      return [...items, { product: prod, quantity: qty, unitCost: cost }];
    });

    this.closePreview();
  }

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
    if (this.previewProduct()?.id === productId) {
      this.closePreview();
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
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierRuc: supplier.ruc,
      supplierPhone: supplier.phone,
      supplierEmail: supplier.email,
      supplierAddress: supplier.address,
      status,
      items,
      totalAmount: this.totalAmount(),
      paymentTerms: String(this.paymentTerms()),
      notes: this.notes().trim() || undefined,
    };

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.pendingActionStatus.set(null);
      this.sheetRef.dismiss({ savedOrder, action });
    }, 300);
  }
}
