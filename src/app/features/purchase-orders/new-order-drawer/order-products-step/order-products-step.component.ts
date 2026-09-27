import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { InputNumericComponent } from '../../../../shared/components/input-numeric/input-numeric.component';
import { SelectComponent, SelectOption } from '../../../../shared/components/select/select.component';
import { TagComponent } from '../../../../shared/components/tag/tag.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { SearchDropdownComponent } from '../../../../shared/components/search-dropdown/search-dropdown.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { Supplier, SUPPLIER_CATEGORY_ICONS, SUPPLIER_CATEGORY_LABELS } from '../../../suppliers/suppliers.data';
import { CATEGORY_ICONS, CATEGORY_LABELS, Product } from '../../../sale/sale.data';
import { OrderItemDraft } from '../new-order-drawer.component';
import { PurchaseOrderStatus } from '../../purchase-orders.data';

@Component({
  selector: 'stp-order-products-step',
  standalone: true,
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
    SearchDropdownComponent,
    AlertComponent,
  ],
  templateUrl: './order-products-step.component.html',
  styleUrl: './order-products-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProductsStepComponent {
  // ── Inputs ────────────────────────────────────────────────────
  readonly items = input.required<OrderItemDraft[]>();
  readonly suppliers = input.required<Supplier[]>();
  readonly selectedSupplierId = input.required<string | number>();
  readonly paymentTerms = input<string | number>('Contado');
  readonly expectedDeliveryDate = input<string>('');
  readonly notes = input<string>('');
  readonly totalAmount = input.required<number>();
  readonly isEditMode = input<boolean>(false);
  readonly canSubmit = input<boolean>(false);
  readonly isSubmitting = input<boolean>(false);
  readonly pendingActionStatus = input<PurchaseOrderStatus | null>(null);

  // ── Outputs ───────────────────────────────────────────────────
  readonly addProduct = output<void>();
  readonly editProduct = output<Product>();
  readonly updateQuantity = output<{ productId: number; quantity: number | undefined }>();
  readonly updateUnitCost = output<{ productId: number; unitCost: string }>();
  readonly removeItem = output<number>();
  readonly supplierChange = output<number>();
  readonly paymentTermsChange = output<string>();
  readonly expectedDeliveryDateChange = output<string>();
  readonly notesChange = output<string>();
  readonly saveChanges = output<void>();
  readonly createOrder = output<void>();
  readonly close = output<void>();

  // ── Constants & Helpers ───────────────────────────────────────
  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly categoryIcons = CATEGORY_ICONS;
  protected readonly supplierCategoryLabels = SUPPLIER_CATEGORY_LABELS;
  protected readonly supplierCategoryIcons = SUPPLIER_CATEGORY_ICONS;

  protected readonly paymentTermOptions: SelectOption[] = [
    { value: 'Contado', label: 'Contado' },
    { value: 'Crédito 15 días', label: 'Crédito 15 días' },
    { value: 'Crédito 30 días', label: 'Crédito 30 días' },
    { value: 'Crédito 60 días', label: 'Crédito 60 días' },
  ];

  protected readonly selectedSupplier = computed(() => {
    const id = Number(this.selectedSupplierId());
    return this.suppliers().find(s => s.id === id) ?? this.suppliers()[0];
  });

  protected readonly supplierQuery = linkedSignal<string>(() => {
    return this.selectedSupplier()?.name ?? '';
  });

  protected readonly totalUnitsCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0),
  );

  // ── Handlers ──────────────────────────────────────────────────
  protected onSupplierSelect(sup: Supplier): void {
    this.supplierQuery.set(sup.name);
    this.supplierChange.emit(sup.id);
  }

  protected onSupplierCleared(): void {
    this.supplierQuery.set('');
  }

  protected onPaymentTermsSelect(value: string | number): void {
    this.paymentTermsChange.emit(String(value));
  }

  protected onDateChange(value: string): void {
    this.expectedDeliveryDateChange.emit(value);
  }

  protected onNotesChange(value: string): void {
    this.notesChange.emit(value);
  }

  protected onUpdateQty(productId: number, qty: number | undefined): void {
    this.updateQuantity.emit({ productId, quantity: qty });
  }

  protected onCostChange(productId: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.updateUnitCost.emit({ productId, unitCost: val });
  }

  protected onRemove(productId: number): void {
    this.removeItem.emit(productId);
  }

  protected onEdit(product: Product): void {
    this.editProduct.emit(product);
  }

  protected getSupplierCategoryIcon(cat: unknown): string {
    return (this.supplierCategoryIcons as Record<string, string>)[String(cat)] ?? '📦';
  }

  protected getSupplierCategoryLabel(cat: unknown): string {
    return (this.supplierCategoryLabels as Record<string, string>)[String(cat)] ?? 'General';
  }

  protected getProductCategoryIcon(cat: unknown): string {
    return (this.categoryIcons as Record<string, string>)[String(cat)] ?? '📦';
  }

  protected getProductCategoryLabel(cat: unknown): string {
    return (this.categoryLabels as Record<string, string>)[String(cat)] ?? 'General';
  }
}
