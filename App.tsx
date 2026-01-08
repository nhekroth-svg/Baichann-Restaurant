
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

  const [logo, setLogo] = useState<string | null>(() => {
    return localStorage.getItem('baichann_logo');
  });

  const [siteTitle, setSiteTitle] = useState<string>(() => {
    return localStorage.getItem('baichann_site_title') || 'E-Menu';
  });

  const [companyNameEN, setCompanyNameEN] = useState<string>(() => {
    return localStorage.getItem('baichann_name_en') || 'Restaurant';
  });

  const [companyNameKH, setCompanyNameKH] = useState<string>(() => {
    return localStorage.getItem('baichann_name_kh') || 'ភោជនីយដ្ឋាន';
  });

  const [welcomeMessageEN, setWelcomeMessageEN] = useState<string>(() => {
    return localStorage.getItem('baichann_welcome_en') || UI_TEXT.EN.welcome;
  });

  const [welcomeMessageKH, setWelcomeMessageKH] = useState<string>(() => {
    return localStorage.getItem('baichann_welcome_kh') || UI_TEXT.KH.welcome;
  });

  const [brandColor, setBrandColor] = useState<string>(() => {
    return localStorage.getItem('baichann_brand_color') || '#701804';
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

  useEffect(() => {
    if (logo) {
      localStorage.setItem('baichann_logo', logo);
    } else {
      localStorage.removeItem('baichann_logo');
    }
  }, [logo]);

  useEffect(() => {
    localStorage.setItem('baichann_site_title', siteTitle);
    document.title = siteTitle;
  }, [siteTitle]);

  useEffect(() => {
    localStorage.setItem('baichann_name_en', companyNameEN);
  }, [companyNameEN]);

  useEffect(() => {
    localStorage.setItem('baichann_name_kh', companyNameKH);
  }, [companyNameKH]);

  useEffect(() => {
    localStorage.setItem('baichann_welcome_en', welcomeMessageEN);
  }, [welcomeMessageEN]);

  useEffect(() => {
    localStorage.setItem('baichann_welcome_kh', welcomeMessageKH);
  }, [welcomeMessageKH]);

  useEffect(() => {
    localStorage.setItem('baichann_brand_color', brandColor);
    document.documentElement.style.setProperty('--brand-brown', brandColor);
  }, [brandColor]);

  const toggleLanguage = () => setLanguage(prev => prev === 'EN' ? 'KH' : 'EN');

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, note: '' }];
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

  const updateCartItemNote = (itemId: string, note: string) => {
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, note } : i));
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
          logo={logo}
          companyNameEN={companyNameEN}
          companyNameKH={companyNameKH}
          welcomeMessageEN={welcomeMessageEN}
          welcomeMessageKH={welcomeMessageKH}
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
          onUpdateNote={updateCartItemNote}
          onRemoveFromCart={removeFromCart}
          onPlaceOrder={placeOrder}
          logo={logo}
          companyNameEN={companyNameEN}
          companyNameKH={companyNameKH}
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
          logo={logo}
          onUpdateLogo={setLogo}
          brandColor={brandColor}
          onUpdateBrandColor={setBrandColor}
          siteTitle={siteTitle}
          setSiteTitle={setSiteTitle}
          companyNameEN={companyNameEN}
          setCompanyNameEN={setCompanyNameEN}
          companyNameKH={companyNameKH}
          setCompanyNameKH={setCompanyNameKH}
          welcomeMessageEN={welcomeMessageEN}
          setWelcomeMessageEN={setWelcomeMessageEN}
          welcomeMessageKH={welcomeMessageKH}
          setWelcomeMessageKH={setWelcomeMessageKH}
        />
      )}
    </div>
  );
};

export default App;
