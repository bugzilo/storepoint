import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchDropdownComponent } from './search-dropdown.component';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
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

interface TestProduct {
  id: number;
  name: string;
  category: string;
  price: number;
}

@Component({
  imports: [SearchDropdownComponent],
  template: `
    <stp-search-dropdown
      [items]="items()"
      [maxResults]="maxResults()"
      [actionLabel]="actionLabel()"
      [showFooterAction]="showFooterAction()"
      [(value)]="searchVal"
      (selected)="onSelected($event)"
      (cleared)="onCleared()"
      (action)="onAction($event)"
      (footerClick)="onFooterClick()"
    >
      <ng-template #itemTemplate let-item let-i="index" let-active="isActive">
        <div class="custom-row" [class.highlight]="active">
          <span class="custom-name">{{ item.name }}</span>
          <span class="custom-price">\${{ item.price }}</span>
        </div>
      </ng-template>
    </stp-search-dropdown>
  `,
})
class HostComponent {
  items = signal<TestProduct[]>([
    { id: 1, name: 'Arroz Costeño', category: 'abarrotes', price: 28.5 },
    { id: 2, name: 'Aceite Primor', category: 'abarrotes', price: 8.9 },
    { id: 3, name: 'Azúcar Rubia', category: 'abarrotes', price: 4.5 },
    { id: 4, name: 'Fideos Lavaggi', category: 'abarrotes', price: 3.2 },
    { id: 5, name: 'Lentejas Costeño', category: 'abarrotes', price: 3.8 },
    { id: 6, name: 'Sal Marina', category: 'abarrotes', price: 1.5 },
    { id: 7, name: 'Coca Cola 1.5L', category: 'bebidas', price: 5.5 },
  ]);
  maxResults = signal(5);
  actionLabel = signal('Registrar "{query}"');
  showFooterAction = signal(false);
  searchVal = signal('');
  selectedItem: TestProduct | null = null;
  actionQuery: string | null = null;
  clearedCalled = false;
  footerClicked = false;

  onSelected(item: TestProduct) {
    this.selectedItem = item;
  }

  onCleared() {
    this.clearedCalled = true;
  }

  onAction(query: string) {
    this.actionQuery = query;
  }

  onFooterClick() {
    this.footerClicked = true;
  }
}

describe('SearchDropdownComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create host and search-dropdown component', () => {
    expect(element.querySelector('stp-search-dropdown')).toBeTruthy();
  });

  it('should limit displayed results to maximum 5 items by default', async () => {
    const input = element.querySelector<HTMLInputElement>('.stp-search-dropdown__input')!;
    input.value = 'a'; // matches all items
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const items = element.querySelectorAll('.stp-search-dropdown__item');
    expect(items.length).toBe(5);
  });

  it('should render custom item template with icons/layout', () => {
    const input = element.querySelector<HTMLInputElement>('.stp-search-dropdown__input')!;
    input.value = 'Costeño';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const customRows = element.querySelectorAll('.custom-row');
    expect(customRows.length).toBe(2);
    expect(element.querySelector('.custom-name')?.textContent).toContain('Arroz Costeño');
    expect(element.querySelector('.custom-price')?.textContent).toContain('$28.5');
  });

  it('should select an item when clicked and emit output', () => {
    const input = element.querySelector<HTMLInputElement>('.stp-search-dropdown__input')!;
    input.value = 'Aceite';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const itemEl = element.querySelector<HTMLElement>('.stp-search-dropdown__item');
    expect(itemEl).toBeTruthy();
    itemEl?.click();
    fixture.detectChanges();

    expect(host.selectedItem?.name).toBe('Aceite Primor');
    expect(host.searchVal()).toBe('Aceite Primor');
  });

  it('should clear value and emit cleared when clear button is clicked', () => {
    const input = element.querySelector<HTMLInputElement>('.stp-search-dropdown__input')!;
    input.value = 'Arroz';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const clearBtn = element.querySelector<HTMLButtonElement>('.stp-search-dropdown__clear')!;
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    fixture.detectChanges();

    expect(host.searchVal()).toBe('');
    expect(host.clearedCalled).toBe(true);
  });

  it('should navigate with ArrowDown and select with Enter', () => {
    const input = element.querySelector<HTMLInputElement>('.stp-search-dropdown__input')!;
    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Press ArrowDown
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    const items = element.querySelectorAll('.stp-search-dropdown__item');
    expect(items[0].classList.contains('stp-search-dropdown__item--active')).toBe(true);

    // Press Enter
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(host.selectedItem?.id).toBe(1);
  });

  it('should show hint when filtered results exceed maxResults', () => {
    const input = element.querySelector<HTMLInputElement>('.stp-search-dropdown__input')!;
    input.value = 'a'; // Matches 7 items, maxResults is 5
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const hintEl = element.querySelector('.stp-search-dropdown__hint-text');
    expect(hintEl).toBeTruthy();
    expect(hintEl?.textContent).toContain('Mostrando 5 de 7 resultados');
  });

  it('should NOT show footer when filtered results do not exceed maxResults and showFooterAction is false', () => {
    const input = element.querySelector<HTMLInputElement>('.stp-search-dropdown__input')!;
    input.value = 'Costeño'; // Matches only 2 items, maxResults is 5 (2 <= 5)
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const footerEl = element.querySelector('.stp-search-dropdown__footer');
    expect(footerEl).toBeNull();
  });

  it('should show footer action button with "Ver todo" when showFooterAction is true and emit footerClick', () => {
    host.showFooterAction.set(true);
    fixture.detectChanges();

    const input = element.querySelector<HTMLInputElement>('.stp-search-dropdown__input')!;
    input.value = 'Costeño';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const footerBtn = element.querySelector<HTMLButtonElement>('.stp-search-dropdown__footer-btn');
    expect(footerBtn).toBeTruthy();
    expect(footerBtn?.textContent).toContain('Ver todo');

    footerBtn?.click();
    fixture.detectChanges();

    expect(host.footerClicked).toBe(true);
  });

  it('should show action button when no results are found and actionLabel is set', () => {
    const input = element.querySelector<HTMLInputElement>('.stp-search-dropdown__input')!;
    input.value = 'Inexistente';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const emptyText = element.querySelector('.stp-search-dropdown__empty-text');
    expect(emptyText?.textContent).toContain('No se encontraron resultados');

    const actionBtn = element.querySelector<HTMLButtonElement>('.stp-search-dropdown__action-btn');
    expect(actionBtn).toBeTruthy();
    expect(actionBtn?.textContent).toContain('Registrar "Inexistente"');

    actionBtn?.click();
    fixture.detectChanges();

    expect(host.actionQuery).toBe('Inexistente');
  });

  it('should NOT show action button when actionLabel is empty', () => {
    host.actionLabel.set('');
    fixture.detectChanges();

    const input = element.querySelector<HTMLInputElement>('.stp-search-dropdown__input')!;
    input.value = 'Inexistente';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const actionBtn = element.querySelector<HTMLButtonElement>('.stp-search-dropdown__action-btn');
    expect(actionBtn).toBeNull();
  });
});

