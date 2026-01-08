
import React, { useState, useRef, useEffect } from 'react';
import { Order, MenuItem, Language, Category } from '../types';
import { UI_TEXT } from '../constants';

interface AdminViewProps {
  orders: Order[];
  menu: MenuItem[];
  categories: Category[];
  language: Language;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onBack: () => void;
  updateOrderStatus: (id: string, status: any) => void;
  deleteMenuItem: (id: string) => void;
  addOrUpdateMenuItem: (item: MenuItem) => void;
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  logo: string | null;
  onUpdateLogo: (logo: string | null) => void;
  brandColor: string;
  onUpdateBrandColor: (color: string) => void;
  siteTitle: string;
  setSiteTitle: (title: string) => void;
  companyNameEN: string;
  setCompanyNameEN: (name: string) => void;
  companyNameKH: string;
  setCompanyNameKH: (name: string) => void;
  welcomeMessageEN: string;
  setWelcomeMessageEN: (msg: string) => void;
  welcomeMessageKH: string;
  setWelcomeMessageKH: (msg: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ 
  orders, menu, categories, language, isLoggedIn, onLogin, onLogout, onBack, 
  updateOrderStatus, deleteMenuItem, addOrUpdateMenuItem, 
  addCategory, deleteCategory, updateCategory, logo, onUpdateLogo,
  brandColor, onUpdateBrandColor, siteTitle, setSiteTitle, companyNameEN, setCompanyNameEN, companyNameKH, setCompanyNameKH,
  welcomeMessageEN, setWelcomeMessageEN, welcomeMessageKH, setWelcomeMessageKH
}) => {
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'categories' | 'settings'>('orders');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<{old: string, new: string} | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  
  // Collapsible sections state
  const [isIdentityExpanded, setIsIdentityExpanded] = useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);

  // Security State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 30000; // 30 seconds

  const texts = UI_TEXT[language];

  // Lockout timer effect
  useEffect(() => {
    let interval: number;
    if (lockoutUntil) {
      interval = window.setInterval(() => {
        const now = Date.now();
        if (now >= lockoutUntil) {
          setLockoutUntil(null);
          setFailedAttempts(0);
          setSecondsRemaining(0);
        } else {
          setSecondsRemaining(Math.ceil((lockoutUntil - now) / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Image processing helper to resize and compress
  const processImage = (file: File, callback: (base64: string) => void, forcePng: boolean = false) => {
    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1024; // Limit to 1024px to save space
        
        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // Clear canvas for PNG transparency support
        ctx?.clearRect(0, 0, width, height);
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Use PNG for logos to preserve transparency, JPEG for menu items to save space
        const outputType = forcePng ? 'image/png' : 'image/jpeg';
        const quality = forcePng ? undefined : 0.8;
        const compressedBase64 = canvas.toDataURL(outputType, quality);
        
        callback(compressedBase64);
        setIsProcessingImage(false);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = () => {
    if (lockoutUntil) return;

    if (pass === '1234') {
      onLogin();
      setFailedAttempts(0);
      setPass('');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setPass('');
      
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION;
        setLockoutUntil(until);
        setSecondsRemaining(Math.ceil(LOCKOUT_DURATION / 1000));
        alert(`Too many failed attempts. Locked out for 30 seconds.`);
      } else {
        alert(`Access Denied. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      processImage(file, (base64) => {
        setEditingItem({
          ...editingItem,
          image: base64
        });
      }, false); // Menu items don't need PNG transparency
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file, (base64) => {
        onUpdateLogo(base64);
      }, true); // Force PNG for logo to support transparency
    }
  };

  if (!isLoggedIn) {
    const isLocked = lockoutUntil !== null;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-sm">
          <button onClick={onBack} className="mb-4 text-gray-400 p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-sm font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h2 className="text-2xl font-black text-brand-brown mb-6">Admin Login</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="password" 
                placeholder={isLocked ? `Locked out...` : "Admin Passcode"}
                disabled={isLocked}
                className={`w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none transition-all font-bold ${
                  isLocked ? 'opacity-50 cursor-not-allowed bg-red-50 text-red-300' : 'focus:ring-2 focus:ring-brand-brown/20'
                }`}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              {failedAttempts > 0 && !isLocked && (
                <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-wider text-right">
                  {MAX_ATTEMPTS - failedAttempts} attempts remaining
                </p>
              )}
            </div>

            {isLocked && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
                <p className="text-red-600 font-bold text-xs uppercase tracking-widest">
                  Try again in {secondsRemaining}s
                </p>
              </div>
            )}

            <button 
              disabled={isLocked}
              onClick={handleLogin}
              className={`w-full py-4 rounded-2xl font-black shadow-lg transition-all ${
                isLocked 
                ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed' 
                : 'bg-brand-brown text-white shadow-brand-brown/20 hover:brightness-110 active:scale-95'
              }`}
            >
              {isLocked ? "System Locked" : "Login to Dashboard"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Header */}
      <header className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-400 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-brand-brown">{texts.adminTitle}</h1>
        </div>
        <button 
          onClick={() => setShowLogoutConfirm(true)} 
          className="text-red-600 font-bold px-4 py-2 hover:bg-red-50 rounded-xl transition-colors"
        >
          {texts.logout}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex bg-white border-b overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 min-w-[100px] py-4 font-bold border-b-2 transition-all ${activeTab === 'orders' ? 'border-brand-brown text-brand-brown' : 'border-transparent text-gray-400'}`}
        >
          {texts.liveOrders}
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex-1 min-w-[100px] py-4 font-bold border-b-2 transition-all ${activeTab === 'menu' ? 'border-brand-brown text-brand-brown' : 'border-transparent text-gray-400'}`}
        >
          {texts.menuMgmt}
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`flex-1 min-w-[100px] py-4 font-bold border-b-2 transition-all ${activeTab === 'categories' ? 'border-brand-brown text-brand-brown' : 'border-transparent text-gray-400'}`}
        >
          {texts.categoryMgmt}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 min-w-[100px] py-4 font-bold border-b-2 transition-all ${activeTab === 'settings' ? 'border-brand-brown text-brand-brown' : 'border-transparent text-gray-400'}`}
        >
          Settings
        </button>
      </div>

      <main className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'orders' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {orders.length === 0 && <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">No orders yet.</p>
            </div>}
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-brand-gold text-brand-brown px-3 py-1 rounded-full text-xs font-bold mr-2">Table {order.tableNumber}</span>
                    <h3 className="text-lg font-bold inline text-gray-800">{order.customerName || 'Guest'}</h3>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                    order.status === 'accepted' ? 'bg-blue-100 text-blue-600' : 
                    'bg-green-100 text-green-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4 border-y border-gray-50 py-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600"><span className="font-bold text-gray-800">{item.quantity}x</span> {item.nameEN}</span>
                        <span className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      {item.note && (
                        <div className="bg-orange-50/50 text-orange-600 text-[11px] font-black italic px-2 py-1 rounded mt-1 border-l-2 border-orange-200">
                          Note: {item.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 text-sm font-medium">Total Amount</span>
                  <span className="text-xl font-black text-brand-brown">${order.total.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                      className="flex-1 bg-brand-brown text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:brightness-110 transition-all"
                    >
                      {texts.accept}
                    </button>
                  )}
                  {order.status === 'accepted' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:brightness-110 transition-all"
                    >
                      {texts.complete}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-700">{menu.length} Items</h2>
              <button 
                onClick={() => setEditingItem({
                  id: Math.random().toString(36).substr(2, 9),
                  nameEN: '', nameKH: '', descEN: '', descKH: '', price: 0, category: categories[0] || '', image: 'https://picsum.photos/400/300'
                })}
                className="bg-brand-brown text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {texts.addFood}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-3xl flex gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <img src={item.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold leading-tight text-gray-800 truncate">{item.nameEN}</h4>
                    <p className="khmer-suwannaphum text-xs text-gray-400 mt-1 truncate">{item.nameKH}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-brand-brown font-black text-lg">${item.price.toFixed(2)}</p>
                      {item.subCategory && (
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold text-gray-400 uppercase tracking-tighter truncate">{item.subCategory}</span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-3">
                      <button onClick={() => setEditingItem(item)} className="text-blue-500 text-xs font-bold uppercase tracking-wider hover:text-blue-600">{texts.edit}</button>
                      <button onClick={() => { if(confirm('Delete this item?')) deleteMenuItem(item.id) }} className="text-red-500 text-xs font-bold uppercase tracking-wider hover:text-red-600">{texts.delete}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="max-w-xl mx-auto">
            <div className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-gray-100">
              <h3 className="font-bold mb-4 text-gray-700">{texts.addCategory}</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Italian Food"
                  className="flex-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-brown/20 focus:bg-white transition-all"
                />
                <button 
                  onClick={() => { if(newCatName) { addCategory(newCatName); setNewCatName(''); } }}
                  className="bg-brand-brown text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  {texts.save}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 group">
                  {editingCat?.old === cat ? (
                    <div className="flex-1 flex gap-2 animate-fadeIn">
                      <input 
                        type="text" 
                        value={editingCat.new}
                        autoFocus
                        onChange={(e) => setEditingCat({...editingCat, new: e.target.value})}
                        className="flex-1 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-brand-brown/20"
                      />
                      <button onClick={() => { updateCategory(cat, editingCat.new); setEditingCat(null); }} className="bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold shadow-sm">✓</button>
                      <button onClick={() => setEditingCat(null)} className="bg-gray-200 text-gray-500 w-10 h-10 flex items-center justify-center rounded-xl font-bold">✕</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-brown"></div>
                        <span className="font-bold text-gray-700">{cat}</span>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => setEditingCat({old: cat, new: cat})} className="text-blue-500 font-bold text-xs uppercase tracking-widest hover:text-blue-600">{texts.edit}</button>
                        <button onClick={() => { if(confirm('Delete category?')) deleteCategory(cat) }} className="text-red-400 font-bold text-xs uppercase tracking-widest hover:text-red-500">{texts.delete}</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-8">
            {/* Branding Settings (Collapsible) */}
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-fadeIn">
              <button 
                onClick={() => setIsIdentityExpanded(!isIdentityExpanded)}
                className="w-full flex justify-between items-center group focus:outline-none"
              >
                <h3 className="text-xl font-black text-gray-800 tracking-tight">Restaurant Identity</h3>
                <div className={`p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-all ${isIdentityExpanded ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {isIdentityExpanded && (
                <div className="space-y-8 mt-8 animate-fadeIn">
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Site Title (Browser Tab)</label>
                    <input 
                      type="text" 
                      value={siteTitle}
                      onChange={(e) => setSiteTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-brown/20 transition-all font-bold"
                      placeholder="e.g. Baichann E-Menu"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Company Name (EN)</label>
                      <input 
                        type="text" 
                        value={companyNameEN}
                        onChange={(e) => setCompanyNameEN(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-brown/20 transition-all font-bold"
                        placeholder="e.g. Baichann"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Company Name (KH)</label>
                      <input 
                        type="text" 
                        value={companyNameKH}
                        onChange={(e) => setCompanyNameKH(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-brown/20 transition-all font-bold khmer-suwannaphum"
                        placeholder="ភោជនីយដ្ឋាន"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Welcome Message (EN)</label>
                      <textarea 
                        value={welcomeMessageEN}
                        onChange={(e) => setWelcomeMessageEN(e.target.value)}
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-brown/20 transition-all font-medium resize-none"
                        placeholder="English welcome message..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Welcome Message (KH)</label>
                      <textarea 
                        value={welcomeMessageKH}
                        onChange={(e) => setWelcomeMessageKH(e.target.value)}
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-brown/20 transition-all font-medium resize-none"
                        placeholder="សារស្វាគមន៍ជាភាសាខ្មែរ..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-6 border-t border-gray-50">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Restaurant Logo (Supports PNG)</label>
                    <div className="relative w-48 h-48 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                      {logo ? (
                        <img src={logo} className={`w-full h-full object-contain p-4 ${isProcessingImage ? 'opacity-30' : ''}`} alt="Custom Logo" />
                      ) : (
                        <div className="text-center p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-200 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-gray-400 font-bold">Default Logo Active</span>
                        </div>
                      )}
                      {isProcessingImage && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-brand-brown border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <div 
                        onClick={() => logoInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs uppercase tracking-widest"
                      >
                        Upload New
                      </div>
                    </div>
                    
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg" 
                      ref={logoInputRef} 
                      onChange={handleLogoUpload} 
                      className="hidden" 
                    />
                    
                    <div className="flex gap-4 mt-6">
                      <button 
                        onClick={() => logoInputRef.current?.click()}
                        disabled={isProcessingImage}
                        className="px-6 py-3 bg-brand-brown text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                      >
                        {isProcessingImage ? 'Processing...' : 'Change Logo'}
                      </button>
                      {logo && (
                        <button 
                          onClick={() => { if(confirm('Reset to default logo?')) onUpdateLogo(null) }}
                          className="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                          Reset Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Settings (Collapsible) */}
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-fadeIn">
              <button 
                onClick={() => setIsThemeExpanded(!isThemeExpanded)}
                className="w-full flex justify-between items-center group focus:outline-none"
              >
                <h3 className="text-xl font-black text-gray-800 tracking-tight">Theme Customization</h3>
                <div className={`p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-all ${isThemeExpanded ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {isThemeExpanded && (
                <div className="mt-8 animate-fadeIn">
                  <div className="flex flex-col items-center">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Primary Branding Color</label>
                    <div className="flex items-center gap-6">
                      <div 
                        className="w-20 h-20 rounded-3xl shadow-lg border-4 border-white"
                        style={{ backgroundColor: brandColor }}
                      />
                      <div className="flex flex-col gap-2">
                        <input 
                          type="color" 
                          value={brandColor}
                          onChange={(e) => onUpdateBrandColor(e.target.value)}
                          className="w-full h-12 cursor-pointer border-none bg-transparent rounded-xl"
                        />
                        <span className="text-xs font-bold text-gray-400 uppercase font-mono">{brandColor}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onUpdateBrandColor('#701804')}
                      className="mt-6 text-xs font-bold text-brand-brown uppercase tracking-widest hover:underline"
                    >
                      Reset to Baichann Brown
                    </button>
                  </div>

                  <div className="pt-8 mt-8 border-t border-gray-50 text-center">
                      <p className="text-xs text-gray-400 leading-relaxed italic">
                          Changing the primary color will update all buttons, headers, and UI highlights across the entire app for all users.
                      </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative w-full max-sm bg-white rounded-[2.5rem] p-10 shadow-2xl animate-scaleIn text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-4 tracking-tight">Confirm Logout</h2>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">Are you sure you want to end your administrative session?</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={onLogout}
                className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-200 hover:brightness-110 active:scale-95 transition-all"
              >
                {texts.logout}
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all"
              >
                {texts.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Edit Dialog */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setEditingItem(null)} />
          <div className="relative w-full max-lg bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-scaleIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">{editingItem.id ? texts.edit : texts.addFood}</h2>
              <button onClick={() => setEditingItem(null)} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 transition-colors">✕</button>
            </div>
            
            <div className="space-y-6">
              {/* Image Section */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md aspect-video rounded-3xl overflow-hidden bg-gray-100 group shadow-inner border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <img 
                    src={editingItem.image} 
                    alt="Preview" 
                    className={`w-full h-full object-cover ${isProcessingImage ? 'opacity-30' : ''}`} 
                  />
                  {isProcessingImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-brand-brown border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div 
                    onClick={() => !isProcessingImage && fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-bold text-sm uppercase tracking-widest">Change Photo</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={() => !isProcessingImage && fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="mt-4 text-brand-brown text-sm font-bold uppercase tracking-widest hover:underline disabled:opacity-50"
                >
                  {isProcessingImage ? 'PROCESSING...' : 'UPLOAD NEW IMAGE'}
                </button>

                <div className="w-full mt-6">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Photo URL (Optional)</label>
                  <input 
                    type="text"
                    value={editingItem.image.startsWith('data:') ? 'Custom Uploaded Image' : editingItem.image}
                    onChange={e => {
                      const val = e.target.value;
                      if (val !== 'Custom Uploaded Image') {
                        setEditingItem({...editingItem, image: val});
                      }
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-brown/20 outline-none font-medium text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{texts.name} (EN)</label>
                  <input value={editingItem.nameEN} onChange={e => setEditingItem({...editingItem, nameEN: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-brown/20 outline-none font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{texts.name} (KH)</label>
                  <input value={editingItem.nameKH} onChange={e => setEditingItem({...editingItem, nameKH: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-brown/20 outline-none font-bold khmer-suwannaphum" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{texts.price} ($)</label>
                  <input type="number" step="0.01" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-brown/20 outline-none font-black text-xl" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{texts.category}</label>
                  <select value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-brown/20 outline-none font-bold appearance-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Sub-Category Input */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Sub-Category (Optional - e.g. Coffee, Juice, Beer)</label>
                <input 
                  value={editingItem.subCategory || ''} 
                  onChange={e => setEditingItem({...editingItem, subCategory: e.target.value})} 
                  placeholder="e.g. Signature Cocktails"
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-brown/20 outline-none font-bold" 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{texts.desc} (EN)</label>
                <textarea value={editingItem.descEN} onChange={e => setEditingItem({...editingItem, descEN: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-brown/20 outline-none font-medium h-24 resize-none" />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{texts.desc} (KH)</label>
                <textarea value={editingItem.descKH} onChange={e => setEditingItem({...editingItem, descKH: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-brown/20 outline-none font-medium h-24 resize-none" />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setEditingItem(null)} 
                className="flex-1 py-5 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
              >
                {texts.cancel}
              </button>
              <button 
                disabled={isProcessingImage}
                onClick={() => { editingItem && addOrUpdateMenuItem(editingItem); setEditingItem(null); }}
                className="flex-1 py-5 bg-brand-brown text-white font-black rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {isProcessingImage ? 'Wait...' : texts.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
