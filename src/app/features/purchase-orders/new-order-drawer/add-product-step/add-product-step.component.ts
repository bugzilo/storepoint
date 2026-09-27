import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { InputNumericComponent } from '../../../../shared/components/input-numeric/input-numeric.component';
import { TagComponent } from '../../../../shared/components/tag/tag.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { SearchDropdownComponent } from '../../../../shared/components/search-dropdown/search-dropdown.component';
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  Product,
} from '../../../sale/sale.data';
import { OrderItemDraft } from '../new-order-drawer.component';

@Component({
  selector: 'stp-add-product-step',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    ButtonComponent,
    IconComponent,
    InputNumericComponent,
    TagComponent,
    BadgeComponent,
    SearchDropdownComponent,
  ],
  templateUrl: './add-product-step.component.html',
  styleUrl: './add-product-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductStepComponent {
  // ── Inputs ────────────────────────────────────────────────────
  readonly products = input.required<Product[]>();
  readonly existingDrafts = input<OrderItemDraft[]>([]);
  readonly initialProduct = input<Product | null>(null);

  // ── Outputs ───────────────────────────────────────────────────
  readonly productAdded = output<OrderItemDraft>();
  readonly back = output<void>();

  // ── Helpers & Labels ──────────────────────────────────────────
  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly categoryIcons = CATEGORY_ICONS;

  // ── Product State ─────────────────────────────────────────────
  protected readonly selectedProduct = linkedSignal<Product | null>(() => {
    return this.initialProduct();
  });

  protected readonly productQuery = linkedSignal<string>(() => {
    return this.initialProduct()?.name ?? '';
  });

  protected readonly quantity = linkedSignal<number>(() => {
    const prod = this.initialProduct();
    if (!prod) return 1;
    const existing = this.existingDrafts().find(d => d.product.id === prod.id);
    return existing?.quantity ?? 1;
  });

  protected readonly unitCost = linkedSignal<number>(() => {
    const prod = this.initialProduct();
    if (!prod) return 0;
    const existing = this.existingDrafts().find(d => d.product.id === prod.id);
    return existing?.unitCost ?? Number((prod.price * 0.8).toFixed(2));
  });

  // ── Computed Properties ─────────────────────────────────────
  protected readonly isProductAlreadyInOrder = computed(() => {
    const prod = this.selectedProduct();
    if (!prod) return false;
    return this.existingDrafts().some(d => d.product.id === prod.id);
  });

  protected readonly subtotal = computed(() => {
    const q = this.quantity();
    const c = this.unitCost();
    return Number((Math.max(0, q) * Math.max(0, c)).toFixed(2));
  });

  protected readonly canAdd = computed(() => {
    return !!this.selectedProduct() && this.quantity() >= 1 && this.unitCost() >= 0;
  });

  // ── Image Fallback State ─────────────────────────────────────
  protected readonly imgFailed = signal<boolean>(false);

  // ── Handlers ──────────────────────────────────────────────────
  protected onProductSelect(prod: Product): void {
    this.imgFailed.set(false);
    this.selectedProduct.set(prod);
    this.productQuery.set(prod.name);

    const existing = this.existingDrafts().find(d => d.product.id === prod.id);
    if (existing) {
      this.quantity.set(existing.quantity);
      this.unitCost.set(existing.unitCost);
    } else {
      this.quantity.set(1);
      this.unitCost.set(Number((prod.price * 0.8).toFixed(2)));
    }
  }

  protected onQuantityChange(val: number | undefined): void {
    this.quantity.set(Math.max(1, val ?? 1));
  }

  protected onCostInputChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const parsed = parseFloat(raw);
    this.unitCost.set(isNaN(parsed) ? 0 : Math.max(0, parsed));
  }

  protected onConfirm(): void {
    const prod = this.selectedProduct();
    if (!prod || !this.canAdd()) return;

    this.productAdded.emit({
      product: prod,
      quantity: Math.max(1, this.quantity()),
      unitCost: Math.max(0, this.unitCost()),
    });
  }

  protected resetProduct(): void {
    this.imgFailed.set(false);
    this.selectedProduct.set(null);
    this.productQuery.set('');
    this.quantity.set(1);
    this.unitCost.set(0);
  }

  protected getProductCategoryIcon(cat: unknown): string {
    return (this.categoryIcons as Record<string, string>)[String(cat)] ?? '📦';
  }

  protected getProductCategoryLabel(cat: unknown): string {
    return (this.categoryLabels as Record<string, string>)[String(cat)] ?? 'General';
  }
}
