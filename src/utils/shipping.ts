import { Currency } from '../types';

const displayCurrencyFactor = (currency: Currency) =>
  currency === 'AUD' ? 1.08 : currency === 'USD' ? 0.61 : 1;

// There is no reliable per-country/per-parcel estimate in this storefront.
// Shopify checkout calculates the real rate after the delivery address is known.
export const getFreeShippingThreshold = (_currency: Currency) => null;

export const getShippingFee = (_subtotal: number, _currency: Currency) => null;

export const formatMoney = (amount: number, currency: Currency) =>
  new Intl.NumberFormat('en-NZ', { style: 'currency', currency }).format(amount);
