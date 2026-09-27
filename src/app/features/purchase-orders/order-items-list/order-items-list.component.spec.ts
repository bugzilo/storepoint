import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { OrderItemsListComponent } from './order-items-list.component';
import { PurchaseOrderItem } from '../purchase-orders.data';

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

describe('OrderItemsListComponent', () => {
  let component: OrderItemsListComponent;
  let fixture: ComponentFixture<OrderItemsListComponent>;

  const mockItems: PurchaseOrderItem[] = [
    {
      productId: 1,
      productName: 'Arroz Costeño 5kg',
      category: 'abarrotes',
      imageUrl: 'https://example.com/arroz.png',
      quantity: 50,
      unit: 'saco',
      unitCost: 24.0,
      subtotal: 1200.0,
    },
    {
      productId: 2,
      productName: 'Aceite Primor 1L',
      category: 'abarrotes',
      quantity: 40,
      unit: 'botella',
      unitCost: 7.2,
      subtotal: 288.0,
    },
    {
      productId: 3,
      productName: 'Azúcar rubia 1kg',
      category: 'abarrotes',
      quantity: 60,
      unit: 'bolsa',
      unitCost: 3.6,
      subtotal: 216.0,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemsListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should compute total items and units correctly', () => {
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();

    expect(component.totalItems()).toBe(3);
    expect(component.totalUnits()).toBe(150);
  });

  it('should render items metric and tags', () => {
    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('paymentTerms', 'Crédito 15 días');
    fixture.componentRef.setInput('expectedDeliveryDate', '2026-09-29');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('3 productos');
    expect(compiled.textContent).toContain('150 unidades');
    expect(compiled.textContent).toContain('Crédito 15 días');
    expect(compiled.textContent).toContain('29/09');
  });

  it('should handle empty items array gracefully', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    expect(component.totalItems()).toBe(0);
    expect(component.totalUnits()).toBe(0);
  });
});
