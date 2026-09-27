import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BadgeComponent, BadgeVariant } from '../../../shared/components/badge/badge.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import {
  PURCHASE_ORDER_STATUS_CONFIG,
  PurchaseOrder,
  PurchaseOrderStatus,
  canDownloadPdf,
  isOrderEditable,
} from '../purchase-orders.data';

export interface PurchaseOrderDetailData {
  order: PurchaseOrder;
}

export type PurchaseOrderDetailAction = 'edit' | 'confirmed' | 'cancelled' | 'completed' | 'close';

export interface PurchaseOrderDetailResult {
  updatedOrder?: PurchaseOrder;
  action?: PurchaseOrderDetailAction;
}

@Component({
  selector: 'stp-purchase-order-detail-drawer',
  imports: [
    CommonModule,
    DecimalPipe,
    DatePipe,
    ButtonComponent,
    IconComponent,
    BadgeComponent,
    CardComponent,
    AvatarComponent,
  ],
  templateUrl: './purchase-order-detail-drawer.component.html',
  styleUrl: './purchase-order-detail-drawer.component.scss',
})
export class PurchaseOrderDetailDrawerComponent {
  private readonly sheetRef =
    inject<MatBottomSheetRef<PurchaseOrderDetailDrawerComponent, PurchaseOrderDetailResult | null>>(MatBottomSheetRef);

  private readonly data = inject<PurchaseOrderDetailData>(MAT_BOTTOM_SHEET_DATA);

  protected readonly order = signal<PurchaseOrder>({ ...this.data.order });
  protected readonly isProcessing = signal(false);
  protected readonly pdfNotification = signal<string | null>(null);

  protected readonly statusConfig = PURCHASE_ORDER_STATUS_CONFIG;

  protected readonly isEditable = computed(() => isOrderEditable(this.order()));
  protected readonly isConfirmed = computed(() => this.order().status === 'confirmado');
  protected readonly isCompleted = computed(() => this.order().status === 'completado');
  protected readonly isCancelled = computed(() => this.order().status === 'cancelado');
  protected readonly canDownloadPdf = computed(() => canDownloadPdf(this.order()));

  protected readonly subtotal = computed(() => {
    return this.order().totalAmount / 1.18;
  });

  protected readonly igv = computed(() => {
    return this.order().totalAmount - this.subtotal();
  });

  protected readonly totalUnits = computed(() => {
    return this.order().items.reduce((sum, item) => sum + item.quantity, 0);
  });

  protected statusLabel(status: PurchaseOrderStatus): string {
    return this.statusConfig[status].label;
  }

  protected statusVariant(status: PurchaseOrderStatus): BadgeVariant {
    return this.statusConfig[status].variant;
  }

  protected statusIcon(status: PurchaseOrderStatus): string {
    return this.statusConfig[status].icon;
  }

  protected close(): void {
    this.sheetRef.dismiss(null);
  }

  // ── Actions ──────────────────────────────────────────────────

  /**
   * Request edit: while pending, can be edited using the order form.
   */
  protected onEditClick(): void {
    if (!this.isEditable()) return;
    this.sheetRef.dismiss({ updatedOrder: this.order(), action: 'edit' });
  }

  /**
   * Confirm order: transition to 'confirmado'. Becomes locked/non-editable.
   */
  protected onConfirmClick(): void {
    if (!this.isEditable()) return;
    this.isProcessing.set(true);
    const updated: PurchaseOrder = {
      ...this.order(),
      status: 'confirmado',
    };
    setTimeout(() => {
      this.isProcessing.set(false);
      this.sheetRef.dismiss({ updatedOrder: updated, action: 'confirmed' });
    }, 250);
  }

  /**
   * Cancel order: only allowed while 'pendiente'.
   */
  protected onCancelClick(): void {
    if (!this.isEditable()) return;
    this.isProcessing.set(true);
    const updated: PurchaseOrder = {
      ...this.order(),
      status: 'cancelado',
    };
    setTimeout(() => {
      this.isProcessing.set(false);
      this.sheetRef.dismiss({ updatedOrder: updated, action: 'cancelled' });
    }, 250);
  }

  /**
   * Complete order: marks confirmed order as received / completed.
   */
  protected onCompleteClick(): void {
    this.isProcessing.set(true);
    const updated: PurchaseOrder = {
      ...this.order(),
      status: 'completado',
    };
    setTimeout(() => {
      this.isProcessing.set(false);
      this.sheetRef.dismiss({ updatedOrder: updated, action: 'completed' });
    }, 250);
  }

  /**
   * Download PDF: Enabled once confirmed. Currently a placeholder.
   */
  protected onDownloadPdfClick(): void {
    if (!this.canDownloadPdf()) return;
    this.pdfNotification.set(`Descargando PDF de la orden ${this.order().code}... (Próximamente disponible)`);
    setTimeout(() => {
      this.pdfNotification.set(null);
    }, 3500);
  }
}
