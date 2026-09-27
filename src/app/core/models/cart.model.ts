import type { Product } from '../../features/sale/sale.data';

export interface CartItem {
  product: Product;
  quantity: number;
}
