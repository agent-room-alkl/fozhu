import React from 'react';
import { Currency } from '../types';
import { DEFAULT_SHIPPING_COUNTRY, SHIPPING_COUNTRIES, ShippingCountryCode } from '../data/shippingCountries';

interface TopNotificationBarProps {
  currency: Currency;
  shippingCountry: ShippingCountryCode;
  detectedCountryCode: string | null;
  onShippingCountryChange: (code: ShippingCountryCode) => void;
  flightTimer: string;
}

export const TopNotificationBar: React.FC<TopNotificationBarProps> = ({
  shippingCountry,
  detectedCountryCode,
  onShippingCountryChange,
}) => {
  const selectedCountry = SHIPPING_COUNTRIES.find((country) => country.code === shippingCountry)
    || SHIPPING_COUNTRIES.find((country) => country.code === DEFAULT_SHIPPING_COUNTRY)!;
  const visitorIsOutsideShippingArea = detectedCountryCode && detectedCountryCode !== selectedCountry.code;

  return (
    <aside
      aria-label="Shipping information"
      className="bg-[#2C1B14] text-[#FAF8F5] px-4 py-2 text-[11px] font-sans tracking-wide border-b border-[#4a2f23]"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-center md:text-left">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E1BD7E]"></span>
          <span className="font-medium">CURRENTLY SHIPPING TO NEW ZEALAND</span>
          <span className="text-[#bd9686] hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[#E1BD7E]">More destinations coming soon</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label htmlFor="shipping-country" className="text-[#bd9686]">Ship to</label>
          <div className="relative">
            <select
              id="shipping-country"
              aria-label="Shipping destination"
              value={selectedCountry.code}
              onChange={(event) => onShippingCountryChange(event.target.value as ShippingCountryCode)}
              className="appearance-none bg-transparent text-[#FAF8F5] font-semibold cursor-pointer rounded px-1 pr-5 py-1 focus:outline-none focus:ring-1 focus:ring-[#E1BD7E]"
            >
              {SHIPPING_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code} className="bg-[#2C1B14] text-[#FAF8F5]">
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            <span aria-hidden="true" className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-sm pointer-events-none">expand_more</span>
          </div>
          {visitorIsOutsideShippingArea && (
            <span className="hidden lg:inline text-[#bd9686]">Your location is detected, but delivery is currently available to New Zealand only.</span>
          )}
        </div>
      </div>
    </aside>
  );
};
