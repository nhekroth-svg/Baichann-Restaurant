
import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, Language, Category } from '../types';
import { UI_TEXT } from '../constants';

interface MenuViewProps {
  menu: MenuItem[];
  categories: Category[];
  cart: CartItem[];
  language: Language;
  toggleLanguage: () => void;
  onBack: () => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
  onPlaceOrder: (table: string, name?: string) => void;
}

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 400 400" className={className} fill="currentColor">
    {/* Simplified but recognizable version of the logo for small sizes */}
    <path d="M180,60 C110,60 54,116 54,186 C54,230 76,270 110,295 C90,270 78,240 78,206 C78,136 134,80 204,80 C234,80 262,92 284,110 C260,80 222,60 180,60 Z" />
    <path d="M60,200 L300,200 L270,250 L90,250 Z" />
    <rect x="58" y="194" width="244" height="4" rx="1" />
  </svg>
);

const MenuView: React.FC<MenuViewProps> = ({ 
  menu, categories, cart, language, toggleLanguage, onBack, onAddToCart, onUpdateQuantity, onRemoveFromCart, onPlaceOrder 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');

  const texts = UI_TEXT[language];

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.nameKH.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [menu, selectedCategory, searchQuery]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-[#faf7f2] min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="text-brand-brown p-1 hover:bg-gray-100 rounded-full transition-colors w-10 h-10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
            <LogoIcon className="w-10 h-10 text-brand-brown" />
            <div className="text-left">
                <h1 className="khmer-moul text-brand-brown text-sm leading-tight">បាយច័ន្ទ</h1>
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Baichann</p>
            </div>
        </div>
        <button 
          onClick={toggleLanguage} 
          className="bg-brand-brown/5 px-3 py-1.5 rounded-full text-xs font-bold border border-brand-brown/10 w-12 text-center text-brand-brown"
        >
          {language === 'EN' ? '🇰🇭' : '🇬🇧'}
        </button>
      </header>

      {/* Search and Category */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder={texts.search}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-brown/20 focus:bg-white transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-5 py-2.5 rounded-2xl whitespace-nowrap font-bold transition-all text-sm ${selectedCategory === 'All' ? 'bg-brand-brown text-white shadow-lg shadow-brand-brown/20 scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {language === 'EN' ? 'All' : 'ទាំងអស់'}
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl whitespace-nowrap font-bold transition-all text-sm ${selectedCategory === cat ? 'bg-brand-brown text-white shadow-lg shadow-brand-brown/20 scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {language === 'EN' ? cat : cat === 'Khmer Food' ? 'ម្ហូបខ្មែរ' : cat === 'Asian Food' ? 'ម្ហូបអាស៊ី' : cat === 'Western Food' ? 'ម្ហូបបស្ចិមប្រទេស' : cat === 'Drinks' ? 'ភេសជ្ជៈ' : cat === 'Desserts' ? 'បង្អែម' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food List - List View */}
      <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto">
        {filteredMenu.map(item => (
          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm flex p-3 gap-4 hover:shadow-md transition-all active:scale-[0.98] group">
            <div className="relative flex-shrink-0">
                <img src={item.image} alt={item.nameEN} className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <div className="truncate">
                    <h3 className="text-base sm:text-xl font-bold text-gray-900 leading-tight">
                        {language === 'EN' ? item.nameEN : item.nameKH}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">{item.nameEN}</p>
                </div>
                <span className="text-brand-brown font-black text-lg sm:text-xl whitespace-nowrap">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3 opacity-80">
                {language === 'EN' ? item.descEN : item.descKH}
              </p>
              <div className="mt-auto flex justify-end">
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="px-5 py-2 bg-brand-brown/5 text-brand-brown font-black rounded-xl border border-brand-brown/10 hover:bg-brand-brown hover:text-white transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm"
                  >
                    <span className="text-lg leading-none">+</span> {texts.addToCart}
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 max-w-3xl mx-auto">
          <button 
            onClick={() => setShowCart(true)}
            className="w-full bg-brand-brown text-white py-4.5 rounded-3xl shadow-[0_15px_40px_rgba(112,24,4,0.4)] flex justify-between items-center px-6 hover:scale-[1.02] transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="bg-brand-gold text-brand-brown w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shadow-inner">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </div>
              <span className="font-black text-lg tracking-tight">{texts.myCart}</span>
            </div>
            <span className="text-2xl font-black">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative w-full bg-white rounded-t-[2.5rem] p-8 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto max-w-3xl mx-auto">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-brand-brown tracking-tighter">{texts.myCart}</h2>
              <button onClick={() => setShowCart(false)} className="bg-gray-100 text-gray-400 p-2 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">×</button>
            </div>
            
            <div className="space-y-6 mb-10">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 leading-tight">{language === 'EN' ? item.nameEN : item.nameKH}</h4>
                    <p className="text-brand-brown font-black text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center font-black text-gray-400 hover:text-brand-brown transition-colors text-xl">-</button>
                    <span className="font-black w-6 text-center text-gray-800 text-lg">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center font-black text-brand-brown hover:bg-brand-brown hover:text-white rounded-xl transition-all text-xl">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-gray-100 pt-8 mb-4">
              <div className="flex justify-between items-center text-2xl font-black mb-8">
                <span className="text-gray-400">{texts.total}</span>
                <span className="text-brand-brown text-3xl tracking-tighter">${cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => { setShowCart(false); setShowCheckout(true); }}
                className="w-full bg-brand-brown text-white py-5 rounded-2xl text-xl font-black shadow-[0_10px_30px_rgba(112,24,4,0.3)] hover:scale-[1.01] transition-all"
              >
                {texts.placeOrder}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Dialog */}
      {showCheckout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowCheckout(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2rem] p-10 shadow-2xl animate-scaleIn">
            <h2 className="text-3xl font-black text-brand-brown mb-8 tracking-tighter">{texts.confirmOrder}</h2>
            
            <div className="space-y-6 mb-10">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{texts.tableNumber}</label>
                <input 
                  type="number" 
                  autoFocus
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:border-brand-brown focus:bg-white text-3xl font-black text-brand-brown outline-none transition-all placeholder:text-gray-200"
                  placeholder="00"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{texts.customerName}</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:border-brand-brown focus:bg-white font-bold outline-none transition-all"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowCheckout(false)}
                className="flex-1 py-5 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-colors"
              >
                {texts.cancel}
              </button>
              <button 
                disabled={!tableNumber}
                onClick={() => onPlaceOrder(tableNumber, customerName)}
                className={`flex-1 py-5 text-white font-black rounded-2xl transition-all ${tableNumber ? 'bg-brand-brown shadow-xl shadow-brand-brown/30 scale-105' : 'bg-gray-300 opacity-50 cursor-not-allowed'}`}
              >
                {texts.confirmOrder}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuView;
