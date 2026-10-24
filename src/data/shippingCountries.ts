import { Currency } from '../types';

// Keep this list aligned with Shopify's active shipping zones. At the moment,
// New Zealand is the only configured destination; add countries here only
// after shipping is enabled for them in Shopify.
export const SHIPPING_COUNTRIES = [
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', currency: 'NZD' },
] as const satisfies ReadonlyArray<{
  code: string;
  name: string;
  flag: string;
  currency: Currency;
}>;

export type ShippingCountryCode = (typeof SHIPPING_COUNTRIES)[number]['code'];

export const DEFAULT_SHIPPING_COUNTRY: ShippingCountryCode = 'NZ';

export const getShippingCountry = (code: string | null | undefined) =>
  SHIPPING_COUNTRIES.find((country) => country.code === code?.toUpperCase());
