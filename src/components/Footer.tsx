import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F3EFEA] border-t border-[#EAE4DC]">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#EAE4DC]">
          {/* Brand Narrative Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold tracking-wide text-[#321a0f]">
                Fozhu NZ
              </span>
              <span className="font-serif text-sm text-[#E1BD7E]">PRAYER BEADS</span>
            </div>
            <p className="text-xs font-sans text-[#504440] max-w-sm leading-relaxed">
              Preserving Buddhist tactile mindfulness traditions through sustainably sourced wild woods, Grade A untreated jade, and authentic temple consecration rituals.
            </p>
            <div className="flex items-center gap-3 text-[#4d6453] text-xs pt-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span> New Zealand
              </span>
              <span>•</span>
              <span>International destinations are confirmed at checkout</span>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2 py-1 rounded bg-[#f2ede9] text-[10px] font-sans text-[#504440] border border-[#EAE4DC]">
                Supplier fulfilment
              </span>
              <span className="px-2 py-1 rounded bg-[#f2ede9] text-[10px] font-sans text-[#504440] border border-[#EAE4DC]">
                Rates confirmed at checkout
              </span>
            </div>
          </div>

          {/* Quick Links: Lineage & Guides */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#321a0f]">
              Sacred Lineage
            </h4>
            <ul className="space-y-2 text-[11px] font-sans text-[#504440]">
              <li>
                <a className="hover:text-[#321a0f] transition-colors" href="#sacred-consecration-story">
                  Sacred Lineage &amp; Temple Blessing
                </a>
              </li>
              <li>
                <a className="hover:text-[#321a0f] transition-colors" href="#intention-quiz">
                  Bead Energy Guide
                </a>
              </li>
              <li>
                <a className="hover:text-[#321a0f] transition-colors" href="#blessing-ritual">
                  Authenticity Certification
                </a>
              </li>
              <li>
                <a className="hover:text-[#321a0f] transition-colors" href="#blessing-ritual">
                  Sustainable Sandalwood &amp; Agarwood
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links: Logistics & Support */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#321a0f]">
              Client Ritual Care
            </h4>
            <ul className="space-y-2 text-[11px] font-sans text-[#504440]">
              <li>
                <span className="hover:text-[#321a0f] transition-colors cursor-pointer">
                  Shipping &amp; Delivery Information
                </span>
              </li>
              <li>
                <span className="hover:text-[#321a0f] transition-colors cursor-pointer">
                  Privacy &amp; Ritual Care
                </span>
              </li>
              <li>
                <span className="hover:text-[#321a0f] transition-colors cursor-pointer">
                  Restringing &amp; Lifetime Lineage Warranty
                </span>
              </li>
              <li>
                <span className="hover:text-[#321a0f] transition-colors cursor-pointer">
                  Contact Temple Care Team (temple@fozhu.co.nz)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Bottom Line */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-[#82746f]">
          <p className="text-center md:text-left">
            © 2026 Fozhu.co.nz — Handcrafted Buddhist Prayer Beads &amp; Consecrated Mala. Delivery destinations are confirmed at Shopify checkout.
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Encrypted 256-Bit SSL Checkout</span>
            <span>•</span>
            <span className="text-[#321a0f] font-medium">Afterpay / Klarna / Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
