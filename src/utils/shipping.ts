import { Currency } from '../types';

// Read from the Shopify delivery profile on 24 Oct 2026. Shopify remains the
// source of truth; the storefront only displays a local estimate before checkout.
export const NZ_DOMESTIC_SHIPPING_NZD = 10;
export const NZ_DOMESTIC_FREE_SHIPPING_THRESHOLD_NZD = 110;
export const INTERNATIONAL_SHIPPING_NZD = 33;

const displayCurrencyFactor = (currency: Currency) =>
  currency === 'AUD' ? 1.08 : currency === 'USD' ? 0.61 : 1;

export const getFreeShippingThreshold = (currency: Currency) =>
  currency === 'NZD'
    ? Number((NZ_DOMESTIC_FREE_SHIPPING_THRESHOLD_NZD * displayCurrencyFactor(currency)).toFixed(2))
    : null;

export const getShippingFee = (subtotal: number, currency: Currency) => {
  const factor = displayCurrencyFactor(currency);
  if (currency === 'NZD' && subtotal >= NZ_DOMESTIC_FREE_SHIPPING_THRESHOLD_NZD) return 0;
  const rate = currency === 'NZD' ? NZ_DOMESTIC_SHIPPING_NZD : INTERNATIONAL_SHIPPING_NZD;
  return Number((rate * factor).toFixed(2));
};

export const formatMoney = (amount: number, currency: Currency) =>
  new Intl.NumberFormat('en-NZ', { style: 'currency', currency }).format(amount);
