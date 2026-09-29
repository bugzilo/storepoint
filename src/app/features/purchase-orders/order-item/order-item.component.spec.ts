import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { OrderItemComponent } from './order-item.component';
import { PurchaseOrder } from '../purchase-orders.data';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('OrderItemComponent', () => {
  let component: OrderItemComponent;
  let fixture: ComponentFixture<OrderItemComponent>;

  const mockOrder: PurchaseOrder = {
    id: 101,
    code: 'OC-2026-001',
    createdAt: '2026-09-28T10:00:00Z',
    expectedDeliveryDate: '2026-09-30',
    supplierId: 1,
    supplierName: 'Distribuidora Lima S.A.C.',
    supplierRuc: '20123456789',
    supplierPhone: '987654321',
    status: 'pendiente',
    items: [
      {
        productId: 1,
        productName: 'Arroz Costeño 5kg',
        category: 'abarrotes',
        quantity: 10,
        unit: 'saco',
        unitCost: 20.0,
        subtotal: 200.0,
      },
      {
        productId: 2,
        productName: 'Aceite Primor 1L',
        category: 'abarrotes',
        quantity: 5,
        unit: 'botella',
        unitCost: 8.5,
        subtotal: 42.5,
      },
    ],
    totalAmount: 242.5,
    paymentTerms: 'Contado',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('order', mockOrder);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly compute items and units', () => {
    expect(component['totalItems']()).toBe(2);
    expect(component['totalUnits']()).toBe(15);
  });

  it('should identify editable state correctly for pending order', () => {
    expect(component['isEditable']()).toBe(true);
    expect(component['canDownloadPdf']()).toBe(false);
  });

  it('should emit edit when edit button is clicked', () => {
    let emittedOrder: PurchaseOrder | null = null;
    component.edit.subscribe(order => {
      emittedOrder = order;
    });

    const editBtn = fixture.nativeElement.querySelector('stp-button[variant="primary"]') as HTMLElement;
    editBtn.click();

    expect(emittedOrder).toEqual(mockOrder);
  });

  it('should emit detail when card or detail button is clicked', () => {
    let emittedOrder: PurchaseOrder | null = null;
    component.detail.subscribe(order => {
      emittedOrder = order;
    });

    component['onCardClick']();
    expect(emittedOrder).toEqual(mockOrder);
  });

  it('should emit downloadPdf when confirmed order download button is clicked', () => {
    const confirmedOrder: PurchaseOrder = {
      ...mockOrder,
      status: 'confirmado',
    };
    fixture.componentRef.setInput('order', confirmedOrder);
    fixture.detectChanges();

    expect(component['canDownloadPdf']()).toBe(true);

    let emittedOrder: PurchaseOrder | null = null;
    component.downloadPdf.subscribe(order => {
      emittedOrder = order;
    });

    const buttons = fixture.nativeElement.querySelectorAll('stp-button');
    expect(buttons.length).toBe(2);

    const downloadBtn = buttons[0] as HTMLElement;
    downloadBtn.click();

    expect(emittedOrder).toEqual(confirmedOrder);
  });
});
