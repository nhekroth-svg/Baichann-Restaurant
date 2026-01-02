
import React, { useState, useRef } from 'react';
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
}

const AdminView: React.FC<AdminViewProps> = ({ 
  orders, menu, categories, language, isLoggedIn, onLogin, onLogout, onBack, 
  updateOrderStatus, deleteMenuItem, addOrUpdateMenuItem, 
  addCategory, deleteCategory, updateCategory 
}) => {
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'categories'>('orders');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<{old: string, new: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const texts = UI_TEXT[language];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({
          ...editingItem,
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
          <button onClick={onBack} className="mb-4 text-gray-400">← Back</button>
          <h2 className="text-2xl font-bold mb-6 text-brand-brown">Admin Login</h2>
          <input 
            type="password" 
            placeholder="Pass: 1234" 
            className="w-full border p-4 rounded-xl mb-4"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button 
            onClick={() => pass === '1234' ? onLogin() : alert('Wrong code')}
            className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold"
          >
            Login
          </button>
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
        <button onClick={onLogout} className="text-red-600 font-bold px-4 py-2 hover:bg-red-50 rounded-xl transition-colors">{texts.logout}</button>
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
                
                <div className="space-y-2 mb-4 border-y border-gray-50 py-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600"><span className="font-bold text-gray-800">{item.quantity}x</span> {item.nameEN}</span>
                      <span className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
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
                    <p className="khmer-moul text-xs text-gray-400 mt-1 truncate">{item.nameKH}</p>
                    <p className="text-brand-brown font-black mt-2 text-lg">${item.price.toFixed(2)}</p>
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
      </main>

      {/* Menu Edit Dialog */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setEditingItem(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-scaleIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">{editingItem.id ? texts.edit : texts.addFood}</h2>
              <button onClick={() => setEditingItem(null)} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 transition-colors">✕</button>
            </div>
            
            <div className="space-y-6">
              {/* Image Section */}
              <div className="flex flex-col items-center">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 group shadow-inner border-2 border-dashed border-gray-200">
                  <img 
                    src={editingItem.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-bold text-sm uppercase tracking-widest">Change Photo</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 text-brand-brown text-sm font-bold uppercase tracking-widest hover:underline"
                >
                  Upload New Image
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{texts.name} (EN)</label>
                  <input value={editingItem.nameEN} onChange={e => setEditingItem({...editingItem, nameEN: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-brown/20 outline-none font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{texts.name} (KH)</label>
                  <input value={editingItem.nameKH} onChange={e => setEditingItem({...editingItem, nameKH: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-brown/20 outline-none font-bold khmer-moul" />
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
                onClick={() => { addOrUpdateMenuItem(editingItem); setEditingItem(null); }}
                className="flex-1 py-5 bg-brand-brown text-white font-black rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                {texts.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
