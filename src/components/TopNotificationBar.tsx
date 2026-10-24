import React from 'react';
import { Currency } from '../types';

interface TopNotificationBarProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  flightTimer: string;
}

export const TopNotificationBar: React.FC<TopNotificationBarProps> = ({
  currency,
  onCurrencyChange,
}) => {
  return (
    <aside
      aria-label="Announcement"
      className="bg-[#2C1B14] text-[#FAF8F5] px-4 py-2 text-[11px] font-sans tracking-widest border-b border-[#4a2f23] select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-center md:text-left">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E1BD7E] animate-pulse"></span>
          <span className="font-medium">INTERNATIONAL SHIPPING AVAILABLE</span>
          <span className="text-[#bd9686] hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[#E1BD7E]">
            Rates and eligible destinations confirmed at checkout
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-[#bd9686]">
            <span className="material-symbols-outlined text-sm">local_shipping</span>
            <span>Supplier fulfilment · tracking depends on route</span>
          </span>
          <div className="h-3 w-px bg-[#4a2f23]"></div>
          <div className="flex items-center gap-1.5 font-semibold text-[#FAF8F5]">
            <button
              onClick={() => onCurrencyChange('NZD')}
              className={`transition-colors cursor-pointer px-1 py-0.5 rounded ${
                currency === 'NZD' ? 'text-[#E1BD7E] font-bold' : 'text-[#bd9686] hover:text-[#FAF8F5]'
              }`}
            >
              NZD $
            </button>
            <span className="text-[#4a2f23]">/</span>
            <button
              onClick={() => onCurrencyChange('AUD')}
              className={`transition-colors cursor-pointer px-1 py-0.5 rounded ${
                currency === 'AUD' ? 'text-[#E1BD7E] font-bold' : 'text-[#bd9686] hover:text-[#FAF8F5]'
              }`}
            >
              AUD $
            </button>
            <span className="text-[#4a2f23]">/</span>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`transition-colors cursor-pointer px-1 py-0.5 rounded ${
                currency === 'USD' ? 'text-[#E1BD7E] font-bold' : 'text-[#bd9686] hover:text-[#FAF8F5]'
              }`}
            >
              USD $
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
