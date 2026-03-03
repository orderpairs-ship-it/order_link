// Shared types for order-link project

export interface Order {
  id: string;
  platform: string;
  platformOrderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface PlatformMapping {
  platform: string;
  apiUrl: string;
  authType: 'oauth' | 'api_key' | 'basic';
}
