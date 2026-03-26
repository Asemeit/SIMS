export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  min_stock_level: number;
  price: number;
  expiry_date?: string;
  location?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  created_at?: string;
}

export type InventoryAction = 
  | { type: 'ADD_ITEM'; payload: InventoryItem }
  | { type: 'UPDATE_ITEM'; payload: InventoryItem }
  | { type: 'DELETE_ITEM'; payload: string };
