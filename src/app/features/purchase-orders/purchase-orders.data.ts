import { BadgeVariant } from '../../shared/components/badge/badge.component';
import { MOCK_PRODUCTS } from '../sale/sale.data';

export type PurchaseOrderStatus = 'pendiente' | 'confirmado' | 'completado' | 'cancelado';

export interface PurchaseOrderItem {
  productId: number;
  productName: string;
  category: string;
  imageUrl?: string;
  quantity: number;
  unit: string;
  unitCost: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: number;
  code: string;
  createdAt: string; // ISO 8601 string
  expectedDeliveryDate?: string;
  supplierId: number;
  supplierName: string;
  supplierRuc: string;
  supplierPhone: string;
  supplierEmail?: string;
  supplierAddress?: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  paymentTerms: string;
  notes?: string;
}

export type DateFilterPeriod = 'todos' | 'hoy' | 'semana' | 'mes';

export interface DatePeriodOption {
  id: DateFilterPeriod;
  label: string;
  icon: string;
}

export interface StatusFilterOption {
  id: string;
  label: string;
  icon: string;
}

export const PURCHASE_ORDER_STATUS_CONFIG: Record<
  PurchaseOrderStatus,
  { label: string; variant: BadgeVariant; icon: string }
> = {
  pendiente:  { label: 'Pendiente',  variant: 'warning', icon: 'clock' },
  confirmado: { label: 'Confirmado', variant: 'info',    icon: 'file-text' },
  completado: { label: 'Completado', variant: 'success', icon: 'check-circle' },
  cancelado:  { label: 'Cancelado',  variant: 'error',   icon: 'x-circle' },
};

export const DATE_PERIOD_OPTIONS: DatePeriodOption[] = [
  { id: 'todos',  label: 'Todas las fechas', icon: '📅' },
  { id: 'hoy',    label: 'Hoy',             icon: '⚡' },
  { id: 'semana', label: 'Esta semana',     icon: '📆' },
  { id: 'mes',    label: 'Este mes',        icon: '🗓️' },
];

export const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { id: 'todos',      label: 'Todos',        icon: '🏷️' },
  { id: 'pendiente',  label: 'Pendientes',   icon: '⏳' },
  { id: 'confirmado', label: 'Confirmadas',  icon: '📋' },
  { id: 'completado', label: 'Completadas',  icon: '✅' },
  { id: 'cancelado',  label: 'Canceladas',   icon: '❌' },
];

export function isOrderEditable(order: { status: PurchaseOrderStatus }): boolean {
  return order.status === 'pendiente';
}

export function isOrderConfirmed(order: { status: PurchaseOrderStatus }): boolean {
  return order.status === 'confirmado';
}

export function canDownloadPdf(order: { status: PurchaseOrderStatus }): boolean {
  return order.status === 'confirmado' || order.status === 'completado';
}

export function getProductImage(productId: number): string | undefined {
  return MOCK_PRODUCTS.find(p => p.id === productId)?.imageUrl;
}

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createOffsetIso(daysAgo: number, hours = 10, minutes = 30): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

function createOffsetDateString(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return getLocalDateString(d);
}

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 1,
    code: 'OC-2026-008',
    createdAt: createOffsetIso(0, 14, 30), // Today
    expectedDeliveryDate: createOffsetDateString(2),
    supplierId: 1,
    supplierName: 'Distribuidora Norte SAC',
    supplierRuc: '20512345678',
    supplierPhone: '987654321',
    supplierEmail: 'ventas@distnorte.com',
    supplierAddress: 'Av. Industrial 234, Lima',
    status: 'pendiente',
    paymentTerms: 'Crédito 15 días',
    notes: 'Prioridad alta: abastecimiento de abarrotes de alta rotación para fin de mes.',
    totalAmount: 1704.0,
    items: [
      {
        productId: 1,
        productName: 'Arroz Costeño 5kg',
        category: 'abarrotes',
        imageUrl: getProductImage(1),
        quantity: 50,
        unit: 'saco',
        unitCost: 24.0,
        subtotal: 1200.0,
      },
      {
        productId: 2,
        productName: 'Aceite Primor 1L',
        category: 'abarrotes',
        imageUrl: getProductImage(2),
        quantity: 40,
        unit: 'botella',
        unitCost: 7.2,
        subtotal: 288.0,
      },
      {
        productId: 3,
        productName: 'Azúcar rubia 1kg',
        category: 'abarrotes',
        imageUrl: getProductImage(3),
        quantity: 60,
        unit: 'bolsa',
        unitCost: 3.6,
        subtotal: 216.0,
      },
    ],
  },
  {
    id: 2,
    code: 'OC-2026-007',
    createdAt: createOffsetIso(0, 9, 15), // Today
    expectedDeliveryDate: createOffsetDateString(1),
    supplierId: 2,
    supplierName: 'Industrias Lácteas del Sur',
    supplierRuc: '20487654321',
    supplierPhone: '976543210',
    supplierEmail: 'pedidos@lacteosdelsur.pe',
    supplierAddress: 'Jr. Los Pinos 567, Arequipa',
    status: 'confirmado',
    paymentTerms: 'Contado contra entrega',
    notes: 'Verificar cadena de frío al recibir los lácteos.',
    totalAmount: 917.0,
    items: [
      {
        productId: 11,
        productName: 'Leche Gloria Tarro',
        category: 'lacteos',
        imageUrl: getProductImage(11),
        quantity: 80,
        unit: 'tarro',
        unitCost: 6.2,
        subtotal: 496.0,
      },
      {
        productId: 12,
        productName: 'Yogurt Gloria 1kg',
        category: 'lacteos',
        imageUrl: getProductImage(12),
        quantity: 30,
        unit: 'vaso',
        unitCost: 7.5,
        subtotal: 225.0,
      },
      {
        productId: 14,
        productName: 'Queso Edam 250g',
        category: 'lacteos',
        imageUrl: getProductImage(14),
        quantity: 20,
        unit: 'paquete',
        unitCost: 9.8,
        subtotal: 196.0,
      },
    ],
  },
  {
    id: 3,
    code: 'OC-2026-006',
    createdAt: createOffsetIso(1, 16, 45), // Yesterday (This week)
    expectedDeliveryDate: createOffsetDateString(0),
    supplierId: 3,
    supplierName: 'Embotelladora Primavera EIRL',
    supplierRuc: '20398765432',
    supplierPhone: '965432109',
    supplierAddress: 'Calle Libertad 890, Trujillo',
    status: 'pendiente',
    paymentTerms: 'Contado',
    notes: 'Solicitud sujeta a confirmación de stock.',
    totalAmount: 636.0,
    items: [
      {
        productId: 7,
        productName: 'Coca-Cola 1.5L',
        category: 'bebidas',
        imageUrl: getProductImage(7),
        quantity: 60,
        unit: 'botella',
        unitCost: 4.3,
        subtotal: 258.0,
      },
      {
        productId: 8,
        productName: 'Inca Kola 1.5L',
        category: 'bebidas',
        imageUrl: getProductImage(8),
        quantity: 60,
        unit: 'botella',
        unitCost: 4.3,
        subtotal: 258.0,
      },
      {
        productId: 9,
        productName: 'Agua San Luis 600ml',
        category: 'bebidas',
        imageUrl: getProductImage(9),
        quantity: 100,
        unit: 'botella',
        unitCost: 1.2,
        subtotal: 120.0,
      },
    ],
  },
  {
    id: 4,
    code: 'OC-2026-005',
    createdAt: createOffsetIso(2, 11, 20), // 2 days ago (This week)
    expectedDeliveryDate: createOffsetDateString(-1),
    supplierId: 4,
    supplierName: 'Snacks & Más SRL',
    supplierRuc: '20312345678',
    supplierPhone: '954321098',
    supplierEmail: 'info@snacksmas.com',
    status: 'confirmado',
    paymentTerms: 'Crédito 30 días',
    totalAmount: 457.0,
    items: [
      {
        productId: 15,
        productName: 'Cheetos 100g',
        category: 'snacks',
        imageUrl: getProductImage(15),
        quantity: 40,
        unit: 'bolsa',
        unitCost: 3.0,
        subtotal: 120.0,
      },
      {
        productId: 16,
        productName: 'Doritos Mega 180g',
        category: 'snacks',
        imageUrl: getProductImage(16),
        quantity: 35,
        unit: 'bolsa',
        unitCost: 5.2,
        subtotal: 182.0,
      },
      {
        productId: 17,
        productName: 'Papas Lays Clásicas',
        category: 'snacks',
        imageUrl: getProductImage(17),
        quantity: 50,
        unit: 'bolsa',
        unitCost: 3.1,
        subtotal: 155.0,
      },
    ],
  },
  {
    id: 5,
    code: 'OC-2026-004',
    createdAt: createOffsetIso(5, 8, 10), // 5 days ago (This week)
    expectedDeliveryDate: createOffsetDateString(-4),
    supplierId: 5,
    supplierName: 'Limpieza Total Perú',
    supplierRuc: '20287654321',
    supplierPhone: '943210987',
    supplierAddress: 'Av. Las Begonias 321, Piura',
    status: 'completado',
    paymentTerms: 'Crédito 15 días',
    totalAmount: 554.5,
    items: [
      {
        productId: 20,
        productName: 'Detergente Ace 1kg',
        category: 'limpieza',
        imageUrl: getProductImage(20),
        quantity: 35,
        unit: 'bolsa',
        unitCost: 11.5,
        subtotal: 402.5,
      },
      {
        productId: 21,
        productName: 'Lejía Clorox 1L',
        category: 'limpieza',
        imageUrl: getProductImage(21),
        quantity: 40,
        unit: 'botella',
        unitCost: 3.8,
        subtotal: 152.0,
      },
    ],
  },
  {
    id: 6,
    code: 'OC-2026-003',
    createdAt: createOffsetIso(12, 15, 20), // 12 days ago (This month)
    expectedDeliveryDate: createOffsetDateString(-11),
    supplierId: 6,
    supplierName: 'Panadería Central SAC',
    supplierRuc: '20234567890',
    supplierPhone: '932109876',
    supplierAddress: 'Jr. Comercio 456, Cusco',
    status: 'completado',
    paymentTerms: 'Contado',
    totalAmount: 270.0,
    items: [
      {
        productId: 26,
        productName: 'Pan de Molde Bimbo',
        category: 'panaderia',
        imageUrl: getProductImage(26),
        quantity: 30,
        unit: 'bolsa',
        unitCost: 6.0,
        subtotal: 180.0,
      },
      {
        productId: 27,
        productName: 'Galleta Soda San Jorge',
        category: 'panaderia',
        imageUrl: getProductImage(27),
        quantity: 50,
        unit: 'paquete',
        unitCost: 1.8,
        subtotal: 90.0,
      },
    ],
  },
  {
    id: 7,
    code: 'OC-2026-002',
    createdAt: createOffsetIso(18, 10, 0), // 18 days ago (This month)
    expectedDeliveryDate: createOffsetDateString(-17),
    supplierId: 7,
    supplierName: 'Frigorífico Los Andes EIRL',
    supplierRuc: '20198765432',
    supplierPhone: '921098765',
    supplierEmail: 'pedidos@friglosandes.com',
    supplierAddress: 'Parque Industrial Lot. 12, Huancayo',
    status: 'cancelado',
    paymentTerms: 'Contado',
    notes: 'Cancelada por falta de stock del proveedor en la fecha pactada.',
    totalAmount: 583.0,
    items: [
      {
        productId: 28,
        productName: 'Pollo entero kg',
        category: 'carnes',
        imageUrl: getProductImage(28),
        quantity: 40,
        unit: 'kg',
        unitCost: 8.2,
        subtotal: 328.0,
      },
      {
        productId: 29,
        productName: 'Huevos blancos x12',
        category: 'carnes',
        imageUrl: getProductImage(29),
        quantity: 30,
        unit: 'cartón',
        unitCost: 8.5,
        subtotal: 255.0,
      },
    ],
  },
  {
    id: 8,
    code: 'OC-2026-001',
    createdAt: createOffsetIso(32, 12, 0), // 32 days ago (Previous month)
    expectedDeliveryDate: createOffsetDateString(-30),
    supplierId: 8,
    supplierName: 'Higiene Express SRL',
    supplierRuc: '20187654321',
    supplierPhone: '910987654',
    status: 'completado',
    paymentTerms: 'Crédito 30 días',
    totalAmount: 897.0,
    items: [
      {
        productId: 23,
        productName: 'Shampoo Head&Shoulders',
        category: 'higiene',
        imageUrl: getProductImage(23),
        quantity: 25,
        unit: 'botella',
        unitCost: 14.2,
        subtotal: 355.0,
      },
      {
        productId: 24,
        productName: 'Jabón Dove 90g',
        category: 'higiene',
        imageUrl: getProductImage(24),
        quantity: 60,
        unit: 'barra',
        unitCost: 2.7,
        subtotal: 162.0,
      },
      {
        productId: 25,
        productName: 'Papel Higiénico Elite',
        category: 'higiene',
        imageUrl: getProductImage(25),
        quantity: 40,
        unit: 'paquete',
        unitCost: 9.5,
        subtotal: 380.0,
      },
    ],
  },
];
