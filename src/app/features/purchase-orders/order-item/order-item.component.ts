import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent, BadgeVariant } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import {
  PURCHASE_ORDER_STATUS_CONFIG,
  PurchaseOrder,
  canDownloadPdf,
  isOrderConfirmed,
  isOrderEditable,
} from '../purchase-orders.data';

@Component({
  selector: 'stp-order-item',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe,
    CardComponent,
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderItemComponent {
  /** The purchase order data to display */
  readonly order = input.required<PurchaseOrder>();

  /** Emitted when the user requests to edit the order */
  readonly edit = output<PurchaseOrder>();

  /** Emitted when the user requests to view the order details */
  readonly detail = output<PurchaseOrder>();

  /** Emitted when the user requests to download the order PDF */
  readonly downloadPdf = output<PurchaseOrder>();

  protected readonly statusConfig = PURCHASE_ORDER_STATUS_CONFIG;

  protected readonly totalItems = computed(() => this.order().items.length);

  protected readonly totalUnits = computed(() =>
    this.order().items.reduce((sum, item) => sum + item.quantity, 0),
  );

  protected readonly isEditable = computed(() => isOrderEditable(this.order()));
  protected readonly isConfirmed = computed(() => isOrderConfirmed(this.order()));
  protected readonly canDownloadPdf = computed(() => canDownloadPdf(this.order()));

  protected readonly statusLabel = computed(
    () => this.statusConfig[this.order().status]?.label ?? this.order().status,
  );
  protected readonly statusVariant = computed<BadgeVariant>(
    () => this.statusConfig[this.order().status]?.variant ?? 'neutral',
  );
  protected readonly statusIcon = computed(
    () => this.statusConfig[this.order().status]?.icon ?? 'circle',
  );

  protected onCardClick(): void {
    this.detail.emit(this.order());
  }

  protected onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.order());
  }

  protected onDetail(event: Event): void {
    event.stopPropagation();
    this.detail.emit(this.order());
  }

  protected onDownloadPdf(event: Event): void {
    event.stopPropagation();
    this.downloadPdf.emit(this.order());
  }
}
