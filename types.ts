
export type Category = string;

export interface MenuItem {
  id: string;
  nameEN: string;
  nameKH: string;
  descEN: string;
  descKH: string;
  price: number;
  category: Category;
  subCategory?: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  note?: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  tableNumber: string;
  customerName?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
}

export type Language = 'EN' | 'KH';

export interface AppState {
  menu: MenuItem[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  language: Language;
  isAdmin: boolean;
}
