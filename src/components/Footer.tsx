import React from 'react';

const linkClass = 'hover:text-[#321a0f] transition-colors underline-offset-4 hover:underline';

export const Footer: React.FC = () => (
  <footer className="bg-[#F3EFEA] border-t border-[#EAE4DC]">
    <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto py-12 lg:py-14">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#EAE4DC]">
        <div className="md:col-span-5 space-y-4">
          <a href="/" className="inline-flex items-baseline gap-2" aria-label="Fozhu home"><span className="font-serif text-2xl font-bold tracking-wide text-[#321a0f]">Fozhu</span><span className="font-serif text-sm text-[#E1BD7E]">FIVE ELEMENTS</span></a>
          <p className="text-xs font-sans text-[#504440] max-w-sm leading-relaxed">Beads and personal readings inspired by Chinese Five Elements and BaZi traditions. Cultural and styling reference only; no particular outcome is promised.</p>
          <p className="text-xs text-[#4d6453]">One item can be ordered at a time · Shopify confirms delivery options and rates at checkout.</p>
        </div>
        <div className="md:col-span-3 space-y-3">
          <h2 className="font-serif text-sm font-semibold text-[#321a0f]">Explore</h2>
          <ul className="space-y-2 text-[11px] font-sans text-[#504440]">
            <li><a className={linkClass} href="/pages/five-elements">Five Elements &amp; BaZi</a></li>
            <li><a className={linkClass} href="/#collections">Shop beads</a></li>
            <li><a className={linkClass} href="/#intention-quiz">Style quiz</a></li>
          </ul>
        </div>
        <div className="md:col-span-4 space-y-3">
          <h2 className="font-serif text-sm font-semibold text-[#321a0f]">Customer information</h2>
          <ul className="space-y-2 text-[11px] font-sans text-[#504440]">
            <li><a className={linkClass} href="/pages/shipping">Shipping &amp; Delivery</a></li>
            <li><a className={linkClass} href="/pages/privacy">Privacy</a></li>
            <li><a className={linkClass} href="/pages/returns">Returns &amp; Product Care</a></li>
            <li><a className={linkClass} href="/pages/contact">Contact</a></li>
            <li><a className={linkClass} href="mailto:temple@fozhu.co.nz">temple@fozhu.co.nz</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs font-sans text-[#82746f]">
        <p className="text-center md:text-left">© {new Date().getFullYear()} Fozhu · Five Elements cultural and styling reference.</p>
        <span>Payment and shipping details are shown by Shopify checkout.</span>
      </div>
    </div>
  </footer>
);
