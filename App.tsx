
import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem, CartItem, Order, Language, Category, OrderStatus } from './types';
import { INITIAL_MENU, INITIAL_CATEGORIES, UI_TEXT } from './constants';
import HomeView from './views/HomeView';
import MenuView from './views/MenuView';
import AdminView from './views/AdminView';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'menu' | 'admin'>('home');
  const [language, setLanguage] = useState<Language>('EN');
  
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('baichann_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('baichann_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('baichann_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('baichann_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('baichann_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('baichann_orders', JSON.stringify(orders));
  }, [orders]);

  const toggleLanguage = () => setLanguage(prev => prev === 'EN' ? 'KH' : 'EN');

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const placeOrder = (tableNumber: string, customerName?: string) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      tableNumber,
      customerName,
      items: [...cart],
      total,
      status: 'pending',
      timestamp: Date.now()
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    alert(UI_TEXT[language].orderSuccess);
    setView('home');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const deleteMenuItem = (id: string) => {
    setMenu(prev => prev.filter(m => m.id !== id));
  };

  const addOrUpdateMenuItem = (item: MenuItem) => {
    setMenu(prev => {
      const existing = prev.findIndex(m => m.id === item.id);
      if (existing > -1) {
        const updated = [...prev];
        updated[existing] = item;
        return updated;
      }
      return [item, ...prev];
    });
  };

  const addCategory = (name: string) => {
    if (!categories.includes(name)) {
      setCategories(prev => [...prev, name]);
    }
  };

  const deleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c !== name));
    // Optionally handle items with this category (e.g., set to uncategorized)
  };

  const updateCategory = (oldName: string, newName: string) => {
    setCategories(prev => prev.map(c => c === oldName ? newName : c));
    setMenu(prev => prev.map(m => m.category === oldName ? { ...m, category: newName } : m));
  };

  return (
    <div className="min-h-screen">
      {view === 'home' && (
        <HomeView 
          onViewMenu={() => setView('menu')} 
          language={language} 
          toggleLanguage={toggleLanguage} 
          onAdminClick={() => setView('admin')}
        />
      )}
      {view === 'menu' && (
        <MenuView 
          menu={menu}
          categories={categories}
          cart={cart}
          language={language}
          toggleLanguage={toggleLanguage}
          onBack={() => setView('home')}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onPlaceOrder={placeOrder}
        />
      )}
      {view === 'admin' && (
        <AdminView 
          orders={orders}
          menu={menu}
          categories={categories}
          language={language}
          isLoggedIn={isAdminLoggedIn}
          onLogin={() => setIsAdminLoggedIn(true)}
          onLogout={() => { setIsAdminLoggedIn(false); setView('home'); }}
          onBack={() => setView('home')}
          updateOrderStatus={updateOrderStatus}
          deleteMenuItem={deleteMenuItem}
          addOrUpdateMenuItem={addOrUpdateMenuItem}
          addCategory={addCategory}
          deleteCategory={deleteCategory}
          updateCategory={updateCategory}
        />
      )}
    </div>
  );
};

export default App;
