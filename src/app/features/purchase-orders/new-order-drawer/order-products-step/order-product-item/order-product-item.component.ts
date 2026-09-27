import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { TagComponent } from '../../../../../shared/components/tag/tag.component';
import { InputNumericComponent } from '../../../../../shared/components/input-numeric/input-numeric.component';
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  Product,
} from '../../../../sale/sale.data';
import { OrderItemDraft } from '../../new-order-drawer.component';

@Component({
  selector: 'stp-order-product-item',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    CardComponent,
    IconComponent,
    TagComponent,
    InputNumericComponent,
  ],
  templateUrl: './order-product-item.component.html',
  styleUrl: './order-product-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProductItemComponent {
  readonly item = input.required<OrderItemDraft>();

  readonly edit = output<Product>();
  readonly updateQuantity = output<number>();
  readonly remove = output<number>();

  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly categoryIcons = CATEGORY_ICONS;

  protected readonly subtotal = computed(() => {
    const it = this.item();
    return Number((it.quantity * it.unitCost).toFixed(2));
  });

  protected onQuantityChange(val: number | undefined): void {
    this.updateQuantity.emit(Math.max(1, val ?? 1));
  }

  protected getProductCategoryIcon(cat: unknown): string {
    return (this.categoryIcons as Record<string, string>)[String(cat)] ?? '📦';
  }

  protected getProductCategoryLabel(cat: unknown): string {
    return (this.categoryLabels as Record<string, string>)[String(cat)] ?? 'General';
  }
}
