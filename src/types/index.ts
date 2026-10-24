export type Currency = 'NZD' | 'AUD' | 'USD';

export interface BirthDetails {
  birthDate: string;
  birthTime: string;
  birthplace: string;
  timeZone: string;
  gender: 'female' | 'male' | 'prefer_not_to_say';
}

export type SoulIntention = 
  | 'all'
  | 'stress'
  | 'focus'
  | 'abundance'
  | 'protection';

export interface MalaProduct {
  id: string;
  sku: string;
  category: string;
  supplier: string;
  supplierUrl: string;
  productUrl: string;
  priceLabel: string;
  moq: string;
  salesSnapshot: string;
  riskNote: string;
  imageGallery: string[];
  name: string;
  chineseName: string;
  subtitle: string;
  specimen: string;
  origin: string;
  priceNZD: number;
  priceAUD: number;
  priceUSD: number;
  supplierCostNZD?: number;
  image: string;
  fallbackImage: string;
  intention: 'stress' | 'focus' | 'abundance' | 'protection';
  intentionLabel: string;
  badge: string;
  badgeIcon: string;
  beadSizes: string[];
  defaultSize: string;
  configurations?: string[];
  defaultConfig?: string;
  description: string;
  tactileBenefit: string;
  consecrationSeal: string;
  aromaNote?: string;
  materialsDetail: string[];
  variants?: ProductVariant[];
  variantLabel?: string;
  sizeLabel?: string;
  /** Shopify Storefront API product/variant identifiers; absent in the local preview catalog. */
  shopifyProductId?: string;
  shopifyVariantId?: string;
  shopifyTags?: string[];
}

export interface ProductVariant {
  number: number;
  name: string;
  image?: string;
  sizes: Array<{ size: string; supplierCostNZD: number; supplierCostUSD?: number; sku: string; supplierSku?: string; shopifyVariantId?: string; priceNZD?: number; availableForSale?: boolean }>;
}

export type WoodVariant = ProductVariant;

export interface CartItem {
  cartItemId: string;
  productId: string;
  product: MalaProduct;
  selectedSize: string;
  selectedConfig?: string;
  wristSize: string;
  quantity: number;
  chantingNameDedication: string;
  sealNumber: string;
  shopifyVariantId?: string;
  baziElement?: string;
}

export interface RegionalPoolCircle {
  id: string;
  cityCode: string;
  name: string;
  initiator: string;
  location: string;
  spotsFilled: number;
  totalSpots: number;
  transitHub: string;
  status: 'active' | 'open' | 'almost_full';
  flightCutoffHours: number;
}
