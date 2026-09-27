import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { NewOrderDrawerComponent } from './new-order-drawer.component';
import { AddProductStepComponent } from './add-product-step/add-product-step.component';
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

describe('NewOrderDrawerComponent', () => {
  let component: NewOrderDrawerComponent;
  let fixture: ComponentFixture<NewOrderDrawerComponent>;
  let mockSheetRef: { dismiss: ReturnType<typeof vi.fn> };

  const mockOrder: PurchaseOrder = {
    id: 101,
    code: 'OC-2026-101',
    createdAt: '2026-02-15T09:00:00Z',
    supplierId: 1,
    supplierName: 'Distribuidora Central S.A.C.',
    supplierRuc: '20100123456',
    supplierPhone: '987654321',
    status: 'pendiente',
    items: [
      {
        productId: 1,
        productName: 'Arroz Extra Costeño 5kg',
        category: 'abarrotes',
        quantity: 20,
        unit: 'bolsa',
        unitCost: 24.0,
        subtotal: 480.0,
      },
    ],
    totalAmount: 480.0,
    paymentTerms: 'Contado',
  };

  beforeEach(async () => {
    mockSheetRef = {
      dismiss: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NewOrderDrawerComponent],
      providers: [
        { provide: MatBottomSheetRef, useValue: mockSheetRef },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: { order: mockOrder } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewOrderDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component in edit mode', () => {
    expect(component).toBeTruthy();
    expect(component['isEditMode']()).toBe(true);
    expect(component['currentStatus']()).toBe('pendiente');
  });

  it('should render the upper status bar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const statusBar = compiled.querySelector('.new-order-drawer__status-bar');
    expect(statusBar).toBeTruthy();

    const statusLabel = compiled.querySelector('.new-order-drawer__status-label');
    expect(statusLabel?.textContent).toContain('Cambiar estado');
  });

  it('should include status buttons for confirmado and cancelado in edit mode', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const actionButtons = compiled.querySelectorAll('.new-order-drawer__status-actions stp-button');
    expect(actionButtons.length).toBe(2); // Only confirmado and cancelado in edit mode
  });

  it('should submit with status "confirmado" when confirmOrder is called', () => {
    vi.useFakeTimers();
    component['confirmOrder']();
    expect(component['isSubmitting']()).toBe(true);
    expect(component['currentStatus']()).toBe('confirmado');

    vi.advanceTimersByTime(350);
    expect(mockSheetRef.dismiss).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'confirmed',
        savedOrder: expect.objectContaining({ status: 'confirmado' }),
      }),
    );
    vi.useRealTimers();
  });

  it('should submit with status "cancelado" when cancelOrder is called in edit mode', () => {
    vi.useFakeTimers();
    component['cancelOrder']();
    expect(component['isSubmitting']()).toBe(true);
    expect(component['currentStatus']()).toBe('cancelado');

    vi.advanceTimersByTime(350);
    expect(mockSheetRef.dismiss).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'cancelled',
        savedOrder: expect.objectContaining({ status: 'cancelado' }),
      }),
    );
    vi.useRealTimers();
  });

  it('should submit with status "pendiente" and action "updated" when saveChanges is called in edit mode', () => {
    vi.useFakeTimers();
    component['saveChanges']();
    expect(component['isSubmitting']()).toBe(true);
    expect(component['currentStatus']()).toBe('pendiente');

    vi.advanceTimersByTime(350);
    expect(mockSheetRef.dismiss).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'updated',
        savedOrder: expect.objectContaining({ status: 'pendiente' }),
      }),
    );
    vi.useRealTimers();
  });

  describe('Creation mode (new order)', () => {
    let createFixture: ComponentFixture<NewOrderDrawerComponent>;
    let createComponent: NewOrderDrawerComponent;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [NewOrderDrawerComponent],
        providers: [
          { provide: MatBottomSheetRef, useValue: mockSheetRef },
          { provide: MAT_BOTTOM_SHEET_DATA, useValue: null },
        ],
      }).compileComponents();

      createFixture = TestBed.createComponent(NewOrderDrawerComponent);
      createComponent = createFixture.componentInstance;
      createFixture.detectChanges();
    });

    it('should initialize empty in creation mode (no selected supplier, empty payment terms, empty date, empty items)', () => {
      expect(createComponent['isEditMode']()).toBe(false);
      expect(createComponent['currentStatus']()).toBe('pendiente');
      expect(createComponent['selectedSupplierId']()).toBeUndefined();
      expect(createComponent['selectedSupplier']()).toBeNull();
      expect(createComponent['paymentTerms']()).toBe('');
      expect(createComponent['expectedDeliveryDate']()).toBe('');
      expect(createComponent['itemsDraft']().length).toBe(0);
      expect(createComponent['canSubmit']()).toBe(false);
    });

    it('should transition to "success" step when createOrder is called and dismiss with savedOrder when done is called', () => {
      // In creation mode, user selects a supplier and adds products
      createComponent['selectedSupplierId'].set(1);
      createComponent['itemsDraft'].set([
        {
          product: createComponent['availableProducts'][0],
          quantity: 2,
          unitCost: 24.0,
        },
      ]);
      createFixture.detectChanges();
      expect(createComponent['canSubmit']()).toBe(true);

      vi.useFakeTimers();
      createComponent['createOrder']();
      expect(createComponent['isSubmitting']()).toBe(true);
      expect(createComponent['currentStatus']()).toBe('pendiente');

      vi.advanceTimersByTime(350);
      expect(createComponent['isSubmitting']()).toBe(false);
      expect(createComponent['currentStep']()).toBe('success');
      expect(mockSheetRef.dismiss).not.toHaveBeenCalled();

      createFixture.detectChanges();
      const compiled = createFixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.new-order-drawer__success')).toBeTruthy();
      expect(compiled.querySelector('.new-order-drawer__success-title')?.textContent).toContain('¡Operación registrada!');
      expect(compiled.querySelector('.new-order-drawer__success-sub')?.textContent).toContain('La orden de compra fue registrada con éxito.');

      createComponent['done']();
      expect(mockSheetRef.dismiss).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'created',
          savedOrder: expect.objectContaining({ status: 'pendiente' }),
        }),
      );
      vi.useRealTimers();
    });

    it('should default to "list" step and render order products step', () => {
      expect(createComponent['currentStep']()).toBe('list');
      const compiled = createFixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('stp-order-products-step')).toBeTruthy();
      expect(compiled.querySelector('stp-add-product-step')).toBeNull();
    });

    it('should switch to "add-product" step when openAddProduct is called', () => {
      createComponent['openAddProduct']();
      createFixture.detectChanges();

      expect(createComponent['currentStep']()).toBe('add-product');
      const compiled = createFixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('stp-add-product-step')).toBeTruthy();
      expect(compiled.querySelector('stp-order-products-step')).toBeNull();
    });

    it('should add product to itemsDraft and return to "list" step on onProductAdded', () => {
      createComponent['openAddProduct']();
      createFixture.detectChanges();
      expect(createComponent['currentStep']()).toBe('add-product');

      const initialCount = createComponent['itemsDraft']().length;
      const testProduct = createComponent['availableProducts'][5];

      createComponent['onProductAdded']({
        product: testProduct,
        quantity: 5,
        unitCost: 15.0,
      });
      createFixture.detectChanges();

      expect(createComponent['currentStep']()).toBe('list');
      expect(createComponent['itemsDraft']().length).toBe(initialCount + 1);
      const added = createComponent['itemsDraft']().find(i => i.product.id === testProduct.id);
      expect(added).toBeTruthy();
      expect(added?.quantity).toBe(5);
      expect(added?.unitCost).toBe(15.0);
    });

    it('should focus cleanly on product selection without repeating supplier info card', () => {
      createComponent['openAddProduct']();
      createFixture.detectChanges();

      const compiled = createFixture.nativeElement as HTMLElement;
      const addStep = compiled.querySelector('stp-add-product-step');
      expect(addStep).toBeTruthy();

      // Redundant supplier card is removed
      const supplierCard = addStep?.querySelector('.supplier-info-card');
      expect(supplierCard).toBeNull();

      // Only 1 search-dropdown exists in add-step (for products)
      const searchDropdowns = addStep?.querySelectorAll('stp-search-dropdown');
      expect(searchDropdowns?.length).toBe(1);

      // Back button in footer has "Volver" text
      const footerBtn = addStep?.querySelector('.add-step__footer-left stp-button');
      expect(footerBtn?.textContent).toContain('Volver');
    });

    it('should default quantity to 1 (not 10) when selecting a product in add-product step', () => {
      createComponent['openAddProduct']();
      createFixture.detectChanges();

      const addStepDebug = createFixture.debugElement.query(By.directive(AddProductStepComponent));
      expect(addStepDebug).toBeTruthy();
      const addStepComp = addStepDebug.componentInstance as AddProductStepComponent;

      const testProduct = createComponent['availableProducts'][3];
      addStepComp['onProductSelect'](testProduct);
      expect(addStepComp['quantity']()).toBe(1);
    });
  });
});
