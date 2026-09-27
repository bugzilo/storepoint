import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { OrderProductItemComponent } from './order-product-item.component';
import { OrderItemDraft } from '../../new-order-drawer.component';

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

describe('OrderProductItemComponent', () => {
  let component: OrderProductItemComponent;
  let fixture: ComponentFixture<OrderProductItemComponent>;

  const mockItem: OrderItemDraft = {
    product: {
      id: 1,
      name: 'Arroz Costeño 5kg',
      category: 'abarrotes',
      price: 24.0,
      stock: 50,
      unit: 'saco',
    },
    quantity: 2,
    unitCost: 20.0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProductItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProductItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute the correct subtotal', () => {
    expect(component['subtotal']()).toBe(40.0);
  });

  it('should emit edit when edit button is clicked', () => {
    let emittedProduct: unknown = null;
    component.edit.subscribe(prod => {
      emittedProduct = prod;
    });

    const editBtn = fixture.nativeElement.querySelector('.order-product-item__edit-btn') as HTMLButtonElement;
    editBtn.click();

    expect(emittedProduct).toEqual(mockItem.product);
  });

  it('should emit updateQuantity with minimum 1', () => {
    let emittedQty = 0;
    component.updateQuantity.subscribe(qty => {
      emittedQty = qty;
    });

    component['onQuantityChange'](5);
    expect(emittedQty).toBe(5);

    component['onQuantityChange'](0);
    expect(emittedQty).toBe(1);

    component['onQuantityChange'](undefined);
    expect(emittedQty).toBe(1);
  });

  it('should emit remove when delete button is clicked', () => {
    let removedId = 0;
    component.remove.subscribe(id => {
      removedId = id;
    });

    const removeBtn = fixture.nativeElement.querySelector('.order-product-item__remove-btn') as HTMLButtonElement;
    removeBtn.click();

    expect(removedId).toBe(1);
  });
});
