
import { MenuItem, Category } from './types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    nameEN: 'Fish Amok',
    nameKH: 'អាម៉ុកត្រី',
    descEN: 'Traditional Khmer steamed curried fish in banana leaf.',
    descKH: 'ត្រីចំហុយជាមួយគ្រឿងការីខ្មែរក្នុងស្លឹកចេក។',
    price: 6.5,
    category: 'Khmer Food',
    image: 'https://picsum.photos/seed/amok/400/300'
  },
  {
    id: '2',
    nameEN: 'Lok Lak',
    nameKH: 'ឡុកឡាក់សាច់គោ',
    descEN: 'Sautéed beef with fresh lime juice and black pepper dipping sauce.',
    descKH: 'សាច់គោឆាជាមួយទឹកក្រូចឆ្មារ និងទឹកជ្រលក់ម្រេចខ្មៅ។',
    price: 7.0,
    category: 'Khmer Food',
    image: 'https://picsum.photos/seed/loklak/400/300'
  },
  {
    id: '3',
    nameEN: 'Pad Thai',
    nameKH: 'ផាត់ថៃ',
    descEN: 'Classic stir-fried rice noodles with shrimp, tofu, and sprouts.',
    descKH: 'គុយទាវឆាបែបថៃជាមួយបង្គា ពពុះសណ្តែក និងតៅហ៊ូ។',
    price: 5.5,
    category: 'Asian Food',
    image: 'https://picsum.photos/seed/padthai/400/300'
  },
  {
    id: '4',
    nameEN: 'Grilled Ribeye',
    nameKH: 'សាច់គោអាំង',
    descEN: 'Premium ribeye steak served with mashed potatoes and veggies.',
    descKH: 'សាច់គោអាំងគុណភាពខ្ពស់ ញ៉ាំជាមួយដំឡូងបារាំងកិន និងបន្លែ។',
    price: 18.0,
    category: 'Western Food',
    image: 'https://picsum.photos/seed/steak/400/300'
  },
  {
    id: '5',
    nameEN: 'Iced Latte',
    nameKH: 'ឡាតេទឹកកក',
    descEN: 'Freshly brewed espresso with chilled milk.',
    descKH: 'កាហ្វេអេសប្រេសូជាមួយទឹកដោះគោត្រជាក់។',
    price: 2.75,
    category: 'Drinks',
    image: 'https://picsum.photos/seed/latte/400/300'
  },
  {
    id: '6',
    nameEN: 'Mango Sticky Rice',
    nameKH: 'បាយដំណើបស្វាយ',
    descEN: 'Sweet coconut milk rice with fresh mango.',
    descKH: 'បាយដំណើបខ្ទិះដូងជាមួយស្វាយទុំផ្អែមឆ្ងាញ់។',
    price: 3.5,
    category: 'Desserts',
    image: 'https://picsum.photos/seed/mango/400/300'
  }
];

export const INITIAL_CATEGORIES: Category[] = ['Khmer Food', 'Asian Food', 'Western Food', 'Drinks', 'Desserts'];

export const UI_TEXT = {
  EN: {
    welcome: 'Welcome to Restaurant',
    viewMenu: 'View Menu',
    search: 'Search food...',
    addToCart: 'Add to Cart',
    myCart: 'My Cart',
    total: 'Total',
    placeOrder: 'Place Order',
    tableNumber: 'Table Number',
    customerName: 'Customer Name (Optional)',
    confirmOrder: 'Confirm Order',
    orderSuccess: 'Order placed successfully!',
    emptyCart: 'Your cart is empty',
    adminTitle: 'Admin Dashboard',
    liveOrders: 'Live Orders',
    menuMgmt: 'Menu Management',
    categoryMgmt: 'Categories',
    status: 'Status',
    action: 'Action',
    accept: 'Accept',
    complete: 'Complete',
    addFood: 'Add Item',
    addCategory: 'Add Category',
    price: 'Price',
    category: 'Category',
    desc: 'Description',
    name: 'Name',
    save: 'Save',
    cancel: 'Cancel',
    logout: 'Logout',
    delete: 'Delete',
    edit: 'Edit'
  },
  KH: {
    welcome: 'សូមស្វាគមន៍មកកាន់ ភោជនីយដ្ឋាន',
    viewMenu: 'មើលមេនុយ',
    search: 'ស្វែងរកម្ហូប...',
    addToCart: 'បញ្ចូលក្នុងកន្ត្រក',
    myCart: 'កន្ត្រករបស់ខ្ញុំ',
    total: 'សរុប',
    placeOrder: 'បញ្ជាទិញឥឡូវនេះ',
    tableNumber: 'លេខតុ',
    customerName: 'ឈ្មោះអតិថិជន (មិនបង្ខំ)',
    confirmOrder: 'បញ្ជាក់ការបញ្ជាទិញ',
    orderSuccess: 'ការបញ្ជាទិញជោគជ័យ!',
    emptyCart: 'កន្ត្រករបស់អ្នកទំនេរ',
    adminTitle: 'ផ្ទាំងគ្រប់គ្រង',
    liveOrders: 'ការបញ្ជាទិញថ្មីៗ',
    menuMgmt: 'គ្រប់គ្រងមេនុយ',
    categoryMgmt: 'ប្រភេទមុខម្ហូប',
    status: 'ស្ថានភាព',
    action: 'សកម្មភាព',
    accept: 'ទទួលយក',
    complete: 'រួចរាល់',
    addFood: 'បន្ថែមមុខម្ហូប',
    addCategory: 'បន្ថែមប្រភេទ',
    price: 'តម្លៃ',
    category: 'ប្រភេទ',
    desc: 'ការពិពណ៌នា',
    name: 'ឈ្មោះ',
    save: 'រក្សាទុក',
    cancel: 'បោះបង់',
    logout: 'ចាកចេញ',
    delete: 'លុប',
    edit: 'កែសម្រួល'
  }
};
