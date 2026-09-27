import {
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { SearchSize } from '../search/search.component';

export type SearchDropdownSize = SearchSize;

/**
 * Contexto expuesto a la plantilla `#itemTemplate` o `[itemTemplate]`.
 * Permite acceder a los datos del elemento actual, el índice y su estado de foco/activo.
 *
 * ### Variables disponibles con `let-...`:
 * - `$implicit` / `let-item`: El objeto del ítem actual de tipo `T` (ej: `let-prod`).
 * - `item`: Alias explícito del objeto (`let-item="item"`).
 * - `index`: Posición numérica (0-indexed) del ítem en la lista visible (`let-i="index"`).
 * - `isActive`: Booleano que indica si el ítem está resaltado por teclado (flechas) o cursor (`let-active="isActive"`).
 *
 * @example
 * ```html
 * <stp-search-dropdown [items]="products">
 *   <ng-template #itemTemplate let-product let-active="isActive" let-i="index">
 *     <div class="custom-row" [class.is-active]="active">
 *       <img [src]="product.imageUrl" />
 *       <span>{{ i + 1 }}. {{ product.name }}</span>
 *     </div>
 *   </ng-template>
 * </stp-search-dropdown>
 * ```
 */
export interface SearchDropdownItemContext<T> {
  /** El elemento de datos actual (disponible con `let-item` o implícito `let-prod`). */
  $implicit: T;
  /** Alias explícito del elemento actual (`let-item="item"`). */
  item: T;
  /** Índice numérico (0 a maxResults - 1) del elemento en la lista filtrada (`let-i="index"`). */
  index: number;
  /** Indica si el elemento está actualmente resaltado por teclado o cursor (`let-active="isActive"`). */
  isActive: boolean;
}

@Component({
  selector: 'stp-search-dropdown',
  imports: [FormsModule, NgClass, NgTemplateOutlet, IconComponent],
  templateUrl: './search-dropdown.component.html',
  styleUrl: './search-dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchDropdownComponent),
      multi: true,
    },
  ],
})
export class SearchDropdownComponent<T = unknown> implements ControlValueAccessor {
  private readonly el = inject(ElementRef);

  // ── Search Input Inputs ──────────────────────────────────────
  readonly placeholder = input<string>('Buscar…');
  readonly size = input<SearchDropdownSize>('md');
  readonly id = input<string>('stp-sd-' + Math.random().toString(36).slice(2, 7));

  // ── Two-way Model ───────────────────────────────────────────
  readonly value = model<string>('');

  // ── Items & Filtering ────────────────────────────────────────
  readonly items = input<T[]>([]);
  readonly maxResults = input<number>(5);
  readonly autoFilter = input<boolean>(true);
  readonly searchKey = input<string>('');
  readonly filterFn = input<((item: T, query: string) => boolean) | null>(null);

  // ── Display Helpers for Default Template ────────────────────
  readonly displayWith = input<((item: T) => string) | null>(null);
  readonly labelKey = input<string>('name');
  readonly descriptionKey = input<string>('');
  readonly iconKey = input<string>('');
  readonly imageKey = input<string>('');

  // ── Dropdown Behavior ───────────────────────────────────────
  readonly minChars = input<number>(1);
  readonly openOnFocus = input<boolean>(false);
  readonly closeOnSelect = input<boolean>(true);
  readonly resetOnSelect = input<boolean>(false);
  readonly selectTextOnSelect = input<boolean>(true);
  readonly showEmpty = input<boolean>(true);
  readonly loading = input<boolean>(false);
  readonly loadingText = input<string>('Buscando…');
  readonly emptyText = input<string>('No se encontraron resultados');

  // ── Empty State Action (Habilitado solo si se provee actionLabel) ─
  readonly actionLabel = input<string>('');
  readonly actionIcon = input<string>('plus');

  // ── Pinned Footer (Acción "Ver todo" habilitada por boolean y/o conteo) ─
  /**
   * Habilita el botón de acción en el pie de página fijo (dice "Ver todo" por defecto).
   * Al hacer clic, emite el evento `(footerClick)` / `(footerAction)` / `(viewAllClick)`.
   */
  readonly showFooterAction = input<boolean>(false);
  readonly viewAll = input<boolean>(false);
  readonly showViewAll = input<boolean>(false);

  /**
   * Texto para el botón de acción en el pie de página fijo.
   * Valor predeterminado: "Ver todo".
   */
  readonly footerLabel = input<string>('Ver todo');
  readonly footerActionLabel = input<string>('');

  // ── Item Template (Único template opcional del componente) ───
  /**
   * Plantilla para cada resultado en la lista pasada mediante `@Input()`.
   * @see SearchDropdownItemContext
   */
  readonly itemTemplate = input<TemplateRef<SearchDropdownItemContext<T>> | null>(null);

  /**
   * Plantilla para cada resultado proyectada como `<ng-template #itemTemplate let-item let-active="isActive">`.
   * @see SearchDropdownItemContext
   */
  readonly projectedItemTemplate = contentChild<TemplateRef<SearchDropdownItemContext<T>>>('itemTemplate');

  // ── Outputs ─────────────────────────────────────────────────
  readonly cleared = output<void>();
  readonly selected = output<T>();
  readonly action = output<string>();
  readonly searchChange = output<string>();
  readonly openChange = output<boolean>();
  readonly footerClick = output<void>();
  readonly footerAction = output<void>();
  readonly viewAllClick = output<void>();

  // ── Internal State ──────────────────────────────────────────
  protected readonly focused = signal(false);
  protected readonly disabled = signal(false);
  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);

  // ── Computed Properties ─────────────────────────────────────
  protected readonly effectiveItemTemplate = computed(
    () => this.itemTemplate() ?? this.projectedItemTemplate()
  );

  protected readonly effectiveShowFooterAction = computed(
    () => this.showFooterAction() || this.viewAll() || this.showViewAll() || !!this.footerActionLabel()
  );

  protected readonly effectiveFooterLabel = computed(
    () => this.footerActionLabel() || this.footerLabel()
  );

  protected readonly formattedFooterLabel = computed(() => {
    let label = this.effectiveFooterLabel();
    label = label.replace('{total}', String(this.totalCount()));
    label = label.replace('{displayed}', String(this.displayedCount()));
    label = label.replace('{query}', this.value());
    return label;
  });

  protected readonly hasHint = computed(() => this.totalCount() > this.displayedCount());
  protected readonly shouldShowFooter = computed(
    () => this.hasHint() || this.effectiveShowFooterAction()
  );

  protected readonly formattedEmptyText = computed(() => {
    const text = this.emptyText();
    const q = this.value();
    return text.includes('{query}') ? text.replace('{query}', q) : text;
  });

  protected readonly formattedActionLabel = computed(() => {
    const label = this.actionLabel();
    const q = this.value();
    return label.includes('{query}') ? label.replace('{query}', q) : label;
  });

  protected readonly hasValue = computed(() => (this.value()?.length ?? 0) > 0);

  protected onFooterClick(event?: MouseEvent): void {
    event?.stopPropagation();
    this.footerClick.emit();
    this.footerAction.emit();
    this.viewAllClick.emit();
  }

  protected readonly hostClasses = computed(() => ({
    'stp-search-dropdown': true,
    [`stp-search-dropdown--${this.size()}`]: true,
    'stp-search-dropdown--focused': this.focused(),
    'stp-search-dropdown--open': this.shouldShowDropdown(),
    'stp-search-dropdown--disabled': this.disabled(),
  }));

  protected readonly fieldClasses = computed(() => ({
    'stp-search-dropdown__field': true,
    [`stp-search-dropdown__field--${this.size()}`]: true,
    'stp-search-dropdown__field--focused': this.focused(),
    'stp-search-dropdown__field--disabled': this.disabled(),
  }));

  // Filtering logic
  protected readonly allFilteredItems = computed<T[]>(() => {
    const list = this.items() ?? [];
    if (!this.autoFilter()) {
      return list;
    }

    const q = this.value()?.trim() ?? '';
    if (!q) {
      return list;
    }

    const customFilter = this.filterFn();
    if (customFilter) {
      return list.filter((item) => customFilter(item, q));
    }

    const normalize = (str: string) =>
      str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cleanQuery = normalize(q);

    const key = this.searchKey();

    return list.filter((item) => {
      if (item === null || item === undefined) return false;
      if (typeof item === 'string' || typeof item === 'number') {
        return normalize(String(item)).includes(cleanQuery);
      }
      if (typeof item !== 'object') {
        return false;
      }

      const record = item as Record<string, unknown>;
      if (key && record[key] !== undefined) {
        return normalize(String(record[key])).includes(cleanQuery);
      }

      // Default checks across common fields
      const candidates = [
        record['name'],
        record['label'],
        record['title'],
        record['description'],
        record['category'],
        record['supplier'],
        record['sku'],
        record['code'],
      ].filter((v) => v !== undefined && v !== null);

      if (candidates.length > 0) {
        return candidates.some((c) => normalize(String(c)).includes(cleanQuery));
      }

      return normalize(JSON.stringify(item)).includes(cleanQuery);
    });
  });

  // Maximum 5 items displayed (or user configured maxResults)
  protected readonly displayedItems = computed<T[]>(() => {
    const max = Math.max(1, this.maxResults());
    return this.allFilteredItems().slice(0, max);
  });

  protected readonly totalCount = computed(() => this.allFilteredItems().length);
  protected readonly displayedCount = computed(() => this.displayedItems().length);

  protected readonly shouldShowDropdown = computed(() => {
    if (this.disabled()) return false;
    if (!this.isOpen()) return false;

    const query = this.value() ?? '';
    const min = this.minChars();

    if (query.length < min && !this.openOnFocus()) {
      return false;
    }

    if (this.loading()) return true;
    if (this.displayedItems().length > 0) return true;
    return this.showEmpty();
  });

  private onChange: (v: string) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  // ── Focus & Blur Handlers ───────────────────────────────────
  protected onFocus(): void {
    this.focused.set(true);
    const query = this.value() ?? '';
    if (this.openOnFocus() || query.length >= this.minChars()) {
      this.setOpen(true);
    }
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  // ── Input & Typing Handlers ─────────────────────────────────
  protected onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
    this.searchChange.emit(v);

    this.activeIndex.set(-1);
    if (v.length >= this.minChars()) {
      this.setOpen(true);
    } else if (!this.openOnFocus()) {
      this.setOpen(false);
    }
  }

  // ── Keyboard Navigation ─────────────────────────────────────
  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    const items = this.displayedItems();
    const count = items.length;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.setOpen(true);
          this.activeIndex.set(0);
        } else if (count > 0) {
          const next = (this.activeIndex() + 1) % count;
          this.activeIndex.set(next);
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (this.isOpen() && count > 0) {
          const prev = this.activeIndex() <= 0 ? count - 1 : this.activeIndex() - 1;
          this.activeIndex.set(prev);
        }
        break;
      }
      case 'Enter': {
        if (this.isOpen() && count > 0) {
          event.preventDefault();
          const idx = this.activeIndex();
          if (idx >= 0 && idx < count) {
            this.selectItem(items[idx]);
          } else {
            this.selectItem(items[0]);
          }
        }
        break;
      }
      case 'Escape': {
        if (this.isOpen()) {
          event.preventDefault();
          event.stopPropagation();
          this.setOpen(false);
          this.activeIndex.set(-1);
        }
        break;
      }
      case 'Tab': {
        this.setOpen(false);
        this.activeIndex.set(-1);
        break;
      }
    }
  }

  // ── Selection Logic ─────────────────────────────────────────
  protected onItemClick(item: T, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectItem(item);
  }

  protected onItemMouseEnter(index: number): void {
    this.activeIndex.set(index);
  }

  protected selectItem(item: T): void {
    if (this.resetOnSelect()) {
      this.value.set('');
      this.onChange('');
    } else if (this.selectTextOnSelect()) {
      const text = this.getItemLabel(item);
      this.value.set(text);
      this.onChange(text);
    }

    if (this.closeOnSelect()) {
      this.setOpen(false);
      this.activeIndex.set(-1);
    }

    this.selected.emit(item);
  }

  // ── Clear Input ─────────────────────────────────────────────
  protected clear(): void {
    this.value.set('');
    this.onChange('');
    this.cleared.emit();
    this.searchChange.emit('');
    this.setOpen(false);
    this.activeIndex.set(-1);
  }

  // ── Generic Empty State Action ─────────────────────────────
  protected triggerAction(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.action.emit(this.value());
    if (this.closeOnSelect()) {
      this.setOpen(false);
      this.activeIndex.set(-1);
    }
  }

  // ── Outside Click Detection ─────────────────────────────────
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.setOpen(false);
      this.activeIndex.set(-1);
    }
  }

  private setOpen(open: boolean): void {
    if (this.isOpen() !== open) {
      this.isOpen.set(open);
      this.openChange.emit(open);
    }
  }

  // ── Item Helpers for Default Template ───────────────────────
  protected getItemLabel(item: T): string {
    if (item === null || item === undefined) return '';
    if (this.displayWith()) return this.displayWith()!(item);
    if (typeof item === 'string' || typeof item === 'number') return String(item);
    if (typeof item !== 'object') return '';

    const obj = item as Record<string, unknown>;
    const key = this.labelKey();
    if (key && obj[key] !== undefined) return String(obj[key]);

    return String(obj['name'] ?? obj['label'] ?? obj['title'] ?? item);
  }

  protected getItemDescription(item: T): string | null {
    if (item === null || item === undefined || typeof item !== 'object') return null;
    const obj = item as Record<string, unknown>;
    const key = this.descriptionKey();
    if (key && obj[key] !== undefined) return String(obj[key]);

    const fallback = obj['description'] ?? obj['subtitle'] ?? obj['category'] ?? obj['supplier'];
    return fallback !== undefined && fallback !== null ? String(fallback) : null;
  }

  protected getItemIcon(item: T): string | null {
    if (item === null || item === undefined || typeof item !== 'object') return null;
    const obj = item as Record<string, unknown>;
    const key = this.iconKey();
    if (key && obj[key] !== undefined) return String(obj[key]);

    const fallback = obj['icon'];
    return fallback !== undefined && fallback !== null ? String(fallback) : null;
  }

  protected getItemImage(item: T): string | null {
    if (item === null || item === undefined || typeof item !== 'object') return null;
    const obj = item as Record<string, unknown>;
    const key = this.imageKey();
    if (key && obj[key] !== undefined) return String(obj[key]);

    const fallback = obj['imageUrl'] ?? obj['image'] ?? obj['avatar'];
    return fallback !== undefined && fallback !== null ? String(fallback) : null;
  }

  protected trackItem(index: number, item: T): unknown {
    if (item && typeof item === 'object' && 'id' in item) {
      return (item as Record<string, unknown>)['id'];
    }
    return index;
  }

  // ── ControlValueAccessor Implementation ─────────────────────
  writeValue(v: string): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }
}
