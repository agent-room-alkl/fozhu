import React, { useState } from 'react';

interface HeaderProps {
  currentScreen: 'home' | 'cart' | 'birth-chart';
  onNavigate: (screen: 'home' | 'cart') => void;
  cartCount: number;
  onOpenQuiz: () => void;
  onOpenSoundBowl: () => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  onOpenQuiz,
  onOpenSoundBowl,
  onSearch,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 border-b border-[#EAE4DC] backdrop-blur-md transition-all">
      <div className="flex items-center gap-4 w-full px-4 lg:px-8 max-w-7xl mx-auto py-3">

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex min-w-0 items-center gap-3 xl:gap-5 text-[10px] xl:text-[11px] font-sans tracking-wide uppercase">
          <button
            onClick={() => {
              onNavigate('home');
              const el = document.getElementById('collections');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`pb-1 transition-colors duration-200 cursor-pointer ${
              currentScreen === 'home'
                ? 'text-[#321a0f] border-b border-[#321a0f] font-semibold'
                : 'text-[#3A3835] hover:text-[#E1BD7E]'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => {
              onNavigate('home');
              document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden xl:inline-flex text-[#3A3835] pb-1 hover:text-[#E1BD7E] transition-colors duration-200 cursor-pointer"
          >
            108 Malas
          </button>
          <button
            onClick={() => {
              onNavigate('home');
              document.getElementById('sacred-consecration-story')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden 2xl:inline-flex text-[#3A3835] pb-1 hover:text-[#E1BD7E] transition-colors duration-200 cursor-pointer"
          >
            Sacred Woods
          </button>
          <button
            onClick={onOpenQuiz}
            className="hidden 2xl:flex text-[#3A3835] pb-1 hover:text-[#E1BD7E] transition-colors duration-200 items-center gap-1.5 cursor-pointer"
          >
            Mindfulness Quiz
            <span className="px-1 py-0.5 text-[8px] bg-[#cfe9d4] text-[#0a2013] rounded tracking-normal font-bold">60s</span>
          </button>
          <button
            onClick={() => {
              onNavigate('home');
              document.getElementById('blessing-ritual')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden 2xl:inline-flex text-[#3A3835] pb-1 hover:text-[#E1BD7E] transition-colors duration-200 cursor-pointer"
          >
            Blessing Ritual
          </button>
        </nav>

        {/* Trailing Action Cluster */}
        <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSoundBowl}
            title="Singing Bowl Sound Bath"
            aria-label="Open singing bowl sound bath"
            className="hidden xl:inline-flex items-center gap-1.5 rounded border border-[#d4c3bd] px-2.5 py-2 text-[#321a0f] hover:bg-[#F3EFEA] hover:border-[#E1BD7E] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-[#E1BD7E]">temple_buddhist</span>
            <span className="text-[10px] font-sans font-medium">Sound Bath</span>
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                onSearch(e.target.value);
              }}
              placeholder="Search products..."
              className="bg-[#F3EFEA] border border-[#EAE4DC] text-xs font-sans px-3 py-2 pr-8 rounded focus:outline-none focus:border-[#321a0f] w-48 placeholder:text-[#82746f] transition-all"
            />
            <button
              type="submit"
              className="material-symbols-outlined absolute right-2 text-[#82746f] text-base hover:text-[#321a0f]"
            >
              search
            </button>
          </form>

          {/* Shopping Bag Button */}
          <button
            onClick={() => onNavigate(currentScreen === 'cart' ? 'home' : 'cart')}
            aria-label="Shopping Bag"
            className="flex items-center gap-1.5 bg-[#321a0f] text-[#FAF8F5] px-3.5 py-1.5 rounded hover:bg-[#2C1B14] transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-base">shopping_bag</span>
            <span className="text-[11px] font-sans tracking-wider hidden sm:inline font-medium">
              {currentScreen === 'cart' ? 'Store' : 'Bag'}
            </span>
            <span className="text-xs bg-[#E1BD7E] text-[#321a0f] font-bold px-1.5 py-0.2 rounded-full ml-0.5">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#321a0f] hover:text-[#E1BD7E]"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#EAE4DC] px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative mb-3">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                onSearch(e.target.value);
              }}
              placeholder="Search agarwood, bodhi, jade..."
              className="w-full bg-[#F3EFEA] border border-[#EAE4DC] text-xs font-sans px-3 py-2 pr-8 rounded focus:outline-none focus:border-[#321a0f]"
            />
            <button type="submit" className="material-symbols-outlined absolute right-2.5 text-[#82746f]">
              search
            </button>
          </form>

          <div className="flex flex-col space-y-2 text-sm font-sans">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
                const el = document.getElementById('collections');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left py-1 text-[#321a0f] hover:text-[#E1BD7E]"
            >
              Collections
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
                const el = document.getElementById('sacred-consecration-story');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left py-1 text-[#321a0f] hover:text-[#E1BD7E]"
            >
              Sacred Consecration &amp; Lineage
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSoundBowl();
              }}
              className="text-left py-1 text-[#321a0f] hover:text-[#E1BD7E]"
            >
              Singing Bowl Sound Bath
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="text-left py-1 text-[#321a0f] hover:text-[#E1BD7E] flex items-center justify-between"
            >
              <span>Mindfulness Quiz</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-[#cfe9d4] text-[#0a2013] rounded font-bold">
                60s
              </span>
            </button>
            <button
              onClick={() => {
                onNavigate('cart');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 text-[#321a0f] hover:text-[#E1BD7E] flex items-center justify-between"
            >
              <span>Your Sacred Bag &amp; Regional Pool</span>
              <span className="px-2 py-0.5 text-xs bg-[#E1BD7E] text-[#321a0f] rounded-full font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
