import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BadgeComponent, BadgeVariant } from '../../shared/components/badge/badge.component';
import { ShimmerComponent } from '../../shared/components/shimmer/shimmer.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import {
  PurchaseOrderDetailDrawerComponent,
  PurchaseOrderDetailData,
  PurchaseOrderDetailResult,
} from './purchase-order-detail-drawer/purchase-order-detail-drawer.component';
import {
  NewOrderDrawerComponent,
  OrderFormDrawerData,
  OrderFormDrawerResult,
} from './new-order-drawer/new-order-drawer.component';
import {
  DATE_PERIOD_OPTIONS,
  DateFilterPeriod,
  MOCK_PURCHASE_ORDERS,
  PURCHASE_ORDER_STATUS_CONFIG,
  PurchaseOrder,
  PurchaseOrderStatus,
  STATUS_FILTER_OPTIONS,
  canDownloadPdf,
  getLocalDateString,
  isOrderConfirmed,
  isOrderEditable,
} from './purchase-orders.data';

@Component({
  selector: 'stp-purchase-orders',
  imports: [
    CommonModule,
    DecimalPipe,
    DatePipe,
    FormsModule,
    ButtonComponent,
    IconComponent,
    BadgeComponent,
    ShimmerComponent,
    CardComponent,
    SearchComponent,
    InputComponent,
    AvatarComponent,
    EmptyStateComponent,
  ],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss',
})
export class PurchaseOrdersComponent implements AfterViewInit, OnDestroy {
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly ordersHeader = viewChild<ElementRef>('ordersHeader');
  protected readonly isStuck = signal(false);
  private stickyObserver?: IntersectionObserver;

  // ── Main list state ──────────────────────────────────────────
  protected readonly orders = signal<PurchaseOrder[]>([...MOCK_PURCHASE_ORDERS]);

  // ── Filters state ────────────────────────────────────────────
  protected readonly orderCodeQuery = signal<string>('');
  protected readonly dateFilter = signal<string>(''); // YYYY-MM-DD
  protected readonly activePeriod = signal<DateFilterPeriod>('todos');
  protected readonly activeStatus = signal<string>('todos');

  // ── PDF Download Feedback Notification ───────────────────────
  protected readonly pdfFeedbackMessage = signal<string | null>(null);

  // Filter options for chips
  protected readonly datePeriods = DATE_PERIOD_OPTIONS;
  protected readonly statusFilters = STATUS_FILTER_OPTIONS;
  protected readonly statusConfig = PURCHASE_ORDER_STATUS_CONFIG;

  // ── Computed: filtered orders ────────────────────────────────
  protected readonly filteredOrders = computed(() => {
    const code = this.orderCodeQuery().trim().toLowerCase();
    const specificDate = this.dateFilter();
    const period = this.activePeriod();
    const status = this.activeStatus();

    const now = new Date();
    const todayStr = getLocalDateString(now);

    return this.orders().filter(order => {
      // 1. Filter by order code (or supplier name for flexibility)
      const matchesCode =
        !code ||
        order.code.toLowerCase().includes(code) ||
        order.supplierName.toLowerCase().includes(code);

      // 2. Filter by exact creation date (YYYY-MM-DD)
      const orderDateStr = order.createdAt.substring(0, 10);
      const matchesExactDate = !specificDate || orderDateStr === specificDate;

      // 3. Filter by quick date period
      let matchesPeriod = true;
      if (period !== 'todos') {
        const orderDate = new Date(order.createdAt);
        if (period === 'hoy') {
          matchesPeriod = orderDateStr === todayStr;
        } else if (period === 'semana') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesPeriod = orderDate >= sevenDaysAgo && orderDate <= now;
        } else if (period === 'mes') {
          matchesPeriod =
            orderDate.getFullYear() === now.getFullYear() &&
            orderDate.getMonth() === now.getMonth();
        }
      }

      // 4. Filter by order status
      const matchesStatus = status === 'todos' || order.status === status;

      return matchesCode && matchesExactDate && matchesPeriod && matchesStatus;
    });
  });

  // ── Active filters flag ──────────────────────────────────────
  protected readonly hasActiveFilters = computed(() => {
    return (
      this.orderCodeQuery().trim().length > 0 ||
      this.dateFilter().length > 0 ||
      this.activePeriod() !== 'todos' ||
      this.activeStatus() !== 'todos'
    );
  });

  // ── Counters & stats ─────────────────────────────────────────
  protected readonly pendingCount = computed(() => {
    return this.orders().filter(o => o.status === 'pendiente').length;
  });

  protected readonly totalSum = computed(() => {
    return this.filteredOrders().reduce((sum, o) => sum + o.totalAmount, 0);
  });

  protected readonly emptyStateDescription = computed(() => {
    const code = this.orderCodeQuery().trim();
    const date = this.dateFilter();
    if (code && date) {
      return `No se encontraron órdenes con el código "${code}" creadas en la fecha ${date}.`;
    }
    if (code) {
      return `No se encontraron órdenes con el código "${code}".`;
    }
    if (date) {
      return `No se encontraron órdenes creadas en la fecha ${date}.`;
    }
    return 'No hay órdenes de compra que coincidan con los filtros aplicados.';
  });

  // ── Code filter handlers ─────────────────────────────────────
  protected onCodeInput(value: string): void {
    this.orderCodeQuery.set(value);
  }

  protected clearCodeSearch(): void {
    this.orderCodeQuery.set('');
  }

  // ── Date filter handlers ─────────────────────────────────────
  protected onDateChange(value: string): void {
    this.dateFilter.set(value);
    if (value) {
      this.activePeriod.set('todos');
    }
  }

  protected clearDateFilter(): void {
    this.dateFilter.set('');
  }

  protected setDatePeriod(period: DateFilterPeriod): void {
    this.activePeriod.set(period);
    if (period !== 'todos') {
      this.dateFilter.set('');
    }
  }

  protected setStatusFilter(status: string): void {
    this.activeStatus.set(status);
  }

  protected clearAllFilters(): void {
    this.orderCodeQuery.set('');
    this.dateFilter.set('');
    this.activePeriod.set('todos');
    this.activeStatus.set('todos');
  }

  // ── Order status helpers ─────────────────────────────────────
  protected statusLabel(status: PurchaseOrderStatus): string {
    return this.statusConfig[status].label;
  }

  protected statusVariant(status: PurchaseOrderStatus): BadgeVariant {
    return this.statusConfig[status].variant;
  }

  protected statusIcon(status: PurchaseOrderStatus): string {
    return this.statusConfig[status].icon;
  }

  protected totalUnits(order: PurchaseOrder): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  protected isEditable(order: PurchaseOrder): boolean {
    return isOrderEditable(order);
  }

  protected isConfirmed(order: PurchaseOrder): boolean {
    return isOrderConfirmed(order);
  }

  protected canDownloadPdf(order: PurchaseOrder): boolean {
    return canDownloadPdf(order);
  }

  // ── Drawers & Actions ────────────────────────────────────────

  /**
   * Opens the informational detail drawer.
   * If the order is 'pendiente', the user can also trigger edit mode from inside.
   */
  protected openOrderDetail(order: PurchaseOrder): void {
    const data: PurchaseOrderDetailData = { order };

    this.bottomSheet
      .open<PurchaseOrderDetailDrawerComponent, PurchaseOrderDetailData, PurchaseOrderDetailResult | null>(
        PurchaseOrderDetailDrawerComponent,
        { data, panelClass: 'stp-supplier-panel' },
      )
      .afterDismissed()
      .subscribe(result => {
        if (result?.action === 'edit' && result.updatedOrder) {
          // Open edit drawer directly
          this.openEditOrderDrawer(result.updatedOrder);
        } else if (result?.updatedOrder) {
          const updated = result.updatedOrder;
          this.orders.update(prev =>
            prev.map(o => (o.id === updated.id ? updated : o)),
          );
        }
      });
  }

  /**
   * Opens the order drawer in Creation mode.
   * Order will be created in 'pendiente' (or confirmed directly).
   */
  protected openNewOrderDrawer(): void {
    this.bottomSheet
      .open<NewOrderDrawerComponent, OrderFormDrawerData, OrderFormDrawerResult | null>(
        NewOrderDrawerComponent,
        { data: {}, panelClass: 'stp-supplier-panel' },
      )
      .afterDismissed()
      .subscribe(result => {
        if (result?.savedOrder) {
          this.orders.update(prev => [result.savedOrder, ...prev]);
        }
      });
  }

  /**
   * Opens the order drawer in Edit mode (only allowed while 'pendiente').
   */
  protected openEditOrderDrawer(order: PurchaseOrder, event?: Event): void {
    event?.stopPropagation();
    if (!this.isEditable(order)) {
      this.openOrderDetail(order);
      return;
    }

    this.bottomSheet
      .open<NewOrderDrawerComponent, OrderFormDrawerData, OrderFormDrawerResult | null>(
        NewOrderDrawerComponent,
        { data: { order }, panelClass: 'stp-supplier-panel' },
      )
      .afterDismissed()
      .subscribe(result => {
        if (result?.savedOrder) {
          const saved = result.savedOrder;
          this.orders.update(prev =>
            prev.map(o => (o.id === saved.id ? saved : o)),
          );
        }
      });
  }

  /**
   * Download PDF: Enabled once confirmed. Currently a placeholder.
   */
  protected downloadPdf(order: PurchaseOrder, event?: Event): void {
    event?.stopPropagation();
    if (!this.canDownloadPdf(order)) return;
    this.pdfFeedbackMessage.set(
      `Generando PDF para la orden ${order.code}... (Próximamente disponible)`,
    );
    setTimeout(() => {
      this.pdfFeedbackMessage.set(null);
    }, 3500);
  }

  // ── Sticky observer ──────────────────────────────────────────
  ngAfterViewInit(): void {
    const el = this.ordersHeader()?.nativeElement;
    if (!el) return;

    const appHeader = document.querySelector('stp-app-header') as HTMLElement | null;
    const headerHeight = appHeader?.offsetHeight ?? 60;

    this.stickyObserver = new IntersectionObserver(
      ([entry]) => this.isStuck.set(!entry.isIntersecting),
      { threshold: 0, rootMargin: `-${headerHeight}px 0px 0px 0px` },
    );
    this.stickyObserver.observe(el);
  }

  ngOnDestroy(): void {
    this.stickyObserver?.disconnect();
  }
}
