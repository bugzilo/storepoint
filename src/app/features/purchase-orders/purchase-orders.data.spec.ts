import { describe, it, expect } from 'vitest';
import {
  MOCK_PURCHASE_ORDERS,
  PURCHASE_ORDER_STATUS_CONFIG,
  DATE_PERIOD_OPTIONS,
  STATUS_FILTER_OPTIONS,
  getLocalDateString,
  PurchaseOrder,
  isOrderEditable,
  isOrderConfirmed,
  canDownloadPdf,
} from './purchase-orders.data';

describe('Purchase Orders Data & Lifecycle Logic', () => {
  it('should have mock purchase orders loaded with new statuses', () => {
    expect(MOCK_PURCHASE_ORDERS.length).toBeGreaterThan(0);
    expect(MOCK_PURCHASE_ORDERS.some(o => o.code === 'OC-2026-008')).toBe(true);
    expect(MOCK_PURCHASE_ORDERS.some(o => o.status === 'pendiente')).toBe(true);
    expect(MOCK_PURCHASE_ORDERS.some(o => o.status === 'confirmado')).toBe(true);
    expect(MOCK_PURCHASE_ORDERS.some(o => o.status === 'completado')).toBe(true);
    expect(MOCK_PURCHASE_ORDERS.some(o => o.status === 'cancelado')).toBe(true);
  });

  it('should format local date string properly as YYYY-MM-DD', () => {
    const testDate = new Date(2026, 8, 26); // Month 8 is September (0-indexed)
    expect(getLocalDateString(testDate)).toBe('2026-09-26');
  });

  it('should have status configuration with valid variants and icons for all 4 statuses', () => {
    expect(PURCHASE_ORDER_STATUS_CONFIG.pendiente.label).toBe('Pendiente');
    expect(PURCHASE_ORDER_STATUS_CONFIG.pendiente.variant).toBe('warning');

    expect(PURCHASE_ORDER_STATUS_CONFIG.confirmado.label).toBe('Confirmado');
    expect(PURCHASE_ORDER_STATUS_CONFIG.confirmado.variant).toBe('info');

    expect(PURCHASE_ORDER_STATUS_CONFIG.completado.label).toBe('Completado');
    expect(PURCHASE_ORDER_STATUS_CONFIG.completado.variant).toBe('success');

    expect(PURCHASE_ORDER_STATUS_CONFIG.cancelado.label).toBe('Cancelado');
    expect(PURCHASE_ORDER_STATUS_CONFIG.cancelado.variant).toBe('error');
  });

  it('should provide quick date period and status filter options', () => {
    expect(DATE_PERIOD_OPTIONS.length).toBe(4);
    expect(DATE_PERIOD_OPTIONS.map(d => d.id)).toContain('todos');
    expect(DATE_PERIOD_OPTIONS.map(d => d.id)).toContain('hoy');
    expect(DATE_PERIOD_OPTIONS.map(d => d.id)).toContain('semana');
    expect(DATE_PERIOD_OPTIONS.map(d => d.id)).toContain('mes');

    const statusIds = STATUS_FILTER_OPTIONS.map(s => s.id);
    expect(statusIds).toContain('todos');
    expect(statusIds).toContain('pendiente');
    expect(statusIds).toContain('confirmado');
    expect(statusIds).toContain('completado');
    expect(statusIds).toContain('cancelado');
  });

  it('should enforce editing rules: only editable while pendiente', () => {
    expect(isOrderEditable({ status: 'pendiente' })).toBe(true);
    expect(isOrderEditable({ status: 'confirmado' })).toBe(false);
    expect(isOrderEditable({ status: 'completado' })).toBe(false);
    expect(isOrderEditable({ status: 'cancelado' })).toBe(false);
  });

  it('should correctly identify confirmed orders', () => {
    expect(isOrderConfirmed({ status: 'confirmado' })).toBe(true);
    expect(isOrderConfirmed({ status: 'pendiente' })).toBe(false);
    expect(isOrderConfirmed({ status: 'completado' })).toBe(false);
    expect(isOrderConfirmed({ status: 'cancelado' })).toBe(false);
  });

  it('should enable PDF download only once confirmed or completed', () => {
    expect(canDownloadPdf({ status: 'confirmado' })).toBe(true);
    expect(canDownloadPdf({ status: 'completado' })).toBe(true);
    expect(canDownloadPdf({ status: 'pendiente' })).toBe(false);
    expect(canDownloadPdf({ status: 'cancelado' })).toBe(false);
  });

  it('should correctly filter orders by order code (case-insensitive substring)', () => {
    const filterByCode = (orders: PurchaseOrder[], query: string) => {
      const q = query.trim().toLowerCase();
      if (!q) return orders;
      return orders.filter(
        o => o.code.toLowerCase().includes(q) || o.supplierName.toLowerCase().includes(q),
      );
    };

    const exactMatch = filterByCode(MOCK_PURCHASE_ORDERS, 'OC-2026-008');
    expect(exactMatch.length).toBe(1);
    expect(exactMatch[0].code).toBe('OC-2026-008');

    const partialMatch = filterByCode(MOCK_PURCHASE_ORDERS, '007');
    expect(partialMatch.length).toBe(1);
    expect(partialMatch[0].code).toBe('OC-2026-007');

    const noMatch = filterByCode(MOCK_PURCHASE_ORDERS, 'NON-EXISTING-999');
    expect(noMatch.length).toBe(0);
  });

  it('should correctly filter orders by exact creation date', () => {
    const todayStr = getLocalDateString(new Date());

    const filterByDate = (orders: PurchaseOrder[], dateStr: string) => {
      if (!dateStr) return orders;
      return orders.filter(o => o.createdAt.substring(0, 10) === dateStr);
    };

    const todayOrders = filterByDate(MOCK_PURCHASE_ORDERS, todayStr);
    expect(todayOrders.length).toBeGreaterThan(0);
    todayOrders.forEach(o => {
      expect(o.createdAt.substring(0, 10)).toBe(todayStr);
    });
  });

  it('should correctly calculate total units and total amount per order', () => {
    const order = MOCK_PURCHASE_ORDERS[0];
    const computedTotal = order.items.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0,
    );
    expect(order.totalAmount).toBeCloseTo(computedTotal, 2);

    const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
    expect(totalUnits).toBeGreaterThan(0);
  });
});
