import { CartItem, Currency, MalaProduct, WoodVariant } from '../types';

export const getWoodVariant = (product: MalaProduct, woodName?: string): WoodVariant | undefined =>
  product.variants?.find((variant) => variant.name === woodName);

export const getSelectedWoodOption = (product: MalaProduct, woodName?: string, size?: string) =>
  getWoodVariant(product, woodName)?.sizes.find((option) => option.size === size);

export const getShopifyVariantId = (product: MalaProduct, woodName?: string, size?: string) =>
  getSelectedWoodOption(product, woodName, size)?.shopifyVariantId || product.shopifyVariantId;

export const getCartItemImage = (item: CartItem) =>
  getWoodVariant(item.product, item.selectedConfig)?.image || item.product.image;

export const getCartItemSku = (item: CartItem) =>
  getSelectedWoodOption(item.product, item.selectedConfig, item.selectedSize)?.sku || item.product.sku;

export const getRetailPrice = (product: MalaProduct, currency: Currency) =>
  currency === 'AUD' ? product.priceAUD : currency === 'USD' ? product.priceUSD : product.priceNZD;

export const getCartItemPrice = (item: CartItem, currency: Currency) =>
  getSelectedWoodOption(item.product, item.selectedConfig, item.selectedSize)?.priceNZD ?? getRetailPrice(item.product, currency);
