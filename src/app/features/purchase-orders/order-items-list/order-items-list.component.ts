import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { PurchaseOrderItem } from '../purchase-orders.data';

@Component({
  selector: 'stp-order-items-list',
  standalone: true,
  imports: [CommonModule, DatePipe, IconComponent],
  templateUrl: './order-items-list.component.html',
  styleUrl: './order-items-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderItemsListComponent {
  /** Array of items/products in the purchase order */
  readonly items = input.required<PurchaseOrderItem[]>();

  /** Commercial payment terms */
  readonly paymentTerms = input<string | undefined>(undefined);

  /** Estimated delivery date (ISO string or YYYY-MM-DD) */
  readonly expectedDeliveryDate = input<string | undefined>(undefined);

  /** Total distinct products count */
  readonly totalItems = computed(() => this.items().length);

  /** Sum of total units */
  readonly totalUnits = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0),
  );
}
