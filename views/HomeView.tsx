
import React from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface HomeViewProps {
  onViewMenu: () => void;
  language: Language;
  toggleLanguage: () => void;
  onAdminClick: () => void;
}

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 400 400" className={className} fill="currentColor">
    {/* Moon Crescent */}
    <path d="M190,40 C110,40 45,105 45,185 C45,245 80,295 130,318 L130,310 C85,288 55,240 55,185 C55,110 115,50 190,50 C235,50 275,72 300,105 C270,80 230,65 190,65 C125,65 70,118 70,185 C70,230 95,270 132,290 L132,282 C100,262 80,225 80,185 C80,125 130,75 190,75 C215,75 240,85 260,100 C235,90 215,85 190,85 C135,85 90,130 90,185 C90,215 105,242 128,260 L128,252 C110,238 100,215 100,185 C100,135 140,95 190,95 C205,95 220,100 232,108 C215,102 205,100 190,100 C145,100 110,135 110,185 C110,205 120,225 135,238 L135,230 C125,220 120,205 120,185 C120,145 152,112 190,112 C200,112 210,115 218,120 C208,115 200,112 190,112 Z" opacity="0.1" />
    {/* Solid Moon Part */}
    <path d="M180,60 C110,60 54,116 54,186 C54,230 76,270 110,295 C90,270 78,240 78,206 C78,136 134,80 204,80 C234,80 262,92 284,110 C260,80 222,60 180,60 Z" />
    
    {/* The Bowl */}
    <path d="M60,200 L300,200 L270,250 L90,250 Z" />
    <rect x="58" y="194" width="244" height="4" rx="1" />
    <rect x="110" y="252" width="140" height="3" rx="1.5" />
    
    {/* Steam Squiggle */}
    <path d="M140,185 C140,160 170,165 170,140 C170,115 145,120 145,100 C145,85 155,80 165,85 C150,75 135,85 135,105 C135,130 160,125 160,150 C160,175 130,170 130,195 L140,195 Z" />
    
    {/* Stars (4-pointed) */}
    <path d="M185,85 L190,105 L210,110 L190,115 L185,135 L180,115 L160,110 L180,105 Z" />
    <path d="M180,135 L183,145 L193,148 L183,151 L180,161 L177,151 L167,148 L177,145 Z" />
    <path d="M210,130 L213,140 L223,143 L213,146 L210,156 L207,146 L197,143 L207,140 Z" />
  </svg>
);

const HomeView: React.FC<HomeViewProps> = ({ onViewMenu, language, toggleLanguage, onAdminClick }) => {
  const texts = UI_TEXT[language];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-[#faf7f2] relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--brand-brown) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="flex flex-col items-center max-w-sm w-full animate-fadeIn relative z-10">
        {/* Brand Identity */}
        <div className="mb-8 flex flex-col items-center text-brand-brown">
            <Logo className="w-56 h-56 -mb-6" />
            <h1 className="text-6xl font-normal khmer-moul tracking-normal mb-1">បាយច័ន្ទ</h1>
            <h2 className="text-4xl font-bold uppercase tracking-[0.25em] -mr-[0.25em] mb-2">Baichann</h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] -mr-[0.35em] opacity-80">Restaurant and Garden Bar</p>
        </div>

        <div className="w-full space-y-4">
          <p className="text-center text-lg mb-8 text-gray-700 italic font-medium px-4">
            {texts.welcome}
          </p>

          <button 
            onClick={onViewMenu}
            className="w-full bg-brand-brown text-white py-5 rounded-2xl text-xl font-bold shadow-[0_10px_30px_rgba(112,24,4,0.3)] hover:translate-y-[-2px] hover:shadow-[0_15px_35px_rgba(112,24,4,0.4)] transition-all active:scale-95"
          >
            {texts.viewMenu}
          </button>

          <div className="flex gap-4 w-full">
              <button 
                  onClick={toggleLanguage}
                  className="flex-1 border-2 border-brand-brown text-brand-brown py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-brown hover:text-white transition-all shadow-sm"
              >
                  {language === 'EN' ? '🇬🇧 English' : '🇰🇭 ភាសាខ្មែរ'}
              </button>
              <button 
                  onClick={onAdminClick}
                  className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 text-gray-400 rounded-2xl hover:text-brand-brown hover:border-brand-brown transition-all bg-white"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
              </button>
          </div>
        </div>
        
        <div className="mt-16 text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] opacity-60">Siem Reap, Cambodia</div>
      </div>
    </div>
  );
};

export default HomeView;
