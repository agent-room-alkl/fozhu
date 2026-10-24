import { Currency, MalaProduct } from '../types';
import { SHOPIFY_STARTER_PRODUCTS } from '../data/shopifyStarterCatalog';
import { ShippingCountryCode } from '../data/shippingCountries';

// Storefront API requests must target the Shopify shop domain, not the custom
// storefront domain (which may point to this Vercel app).
const SHOP_DOMAIN = (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'qxn57z-ep.myshopify.com').trim();
const STOREFRONT_TOKEN = (import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '').trim();
const API_VERSION = '2026-10';
export const isShopifyConfigured = Boolean(SHOP_DOMAIN);
export const hasShopifyStorefrontToken = Boolean(STOREFRONT_TOKEN);

interface ShopifyVariant {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  image?: { url: string; altText: string | null } | null;
}

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  images: { nodes: Array<{ url: string; altText: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: ShopifyVariant[] };
}

async function storefront<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!isShopifyConfigured) throw new Error('Shopify Storefront API is not configured.');
  const response = await fetch(`https://${SHOP_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) throw new Error('Shopify could not complete this request. Check Storefront API access and product availability.');
  return payload.data as T;
}

const PRODUCT_QUERY = `query StorefrontProducts($first: Int!, $country: CountryCode!) @inContext(country: $country) {
  products(first: $first, sortKey: BEST_SELLING) {
    nodes {
      id handle title description tags featuredImage { url altText }
      images(first: 8) { nodes { url altText } }
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 100) { nodes { id title sku availableForSale price { amount currencyCode } image { url altText } } }
    }
  }
}`;

export async function loadShopifyProducts(country: ShippingCountryCode): Promise<MalaProduct[]> {
  if (!STOREFRONT_TOKEN) return SHOPIFY_STARTER_PRODUCTS;
  const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(PRODUCT_QUERY, { first: 100, country });
  const liveProducts = data.products.nodes.map((remote, index) => {
    const available = remote.variants.nodes.filter((variant) => variant.availableForSale);
    const variants = available.map((variant, variantIndex) => ({
      number: variantIndex + 1,
      name: variant.title || variant.sku || `Option ${variantIndex + 1}`,
      image: variant.image?.url,
      sizes: [{
        size: variant.title || 'Default',
        sku: variant.sku || remote.handle,
        supplierSku: variant.sku || undefined,
        supplierCostNZD: 0,
        shopifyVariantId: variant.id,
        priceNZD: Number(variant.price.amount),
        availableForSale: variant.availableForSale,
      }],
    }));
    const image = remote.featuredImage?.url || remote.images.nodes[0]?.url || '';
    const amount = available.length
      ? Math.min(...available.map((variant) => Number(variant.price.amount)))
      : Number(remote.priceRange.minVariantPrice.amount);
    const sku = remote.variants.nodes.find((variant) => variant.sku)?.sku || remote.handle.toUpperCase();
    const tags = remote.tags.map((tag) => tag.toLowerCase());
    const localCategory = categoryFromTags(tags, remote.title);
    const localIntention = intentionFromTags(tags);
    const storefrontCurrency = remote.priceRange.minVariantPrice.currencyCode as Currency;
    return {
      id: `shopify-${remote.id.split('/').pop() || index}`,
      shopifyProductId: remote.id,
      shopifyHandle: remote.handle,
      storefrontCurrency,
      shopifyVariantId: variants.length === 1 ? variants[0].sizes[0].shopifyVariantId : undefined,
      shopifyTags: tags,
      sku,
      category: localCategory,
      supplier: 'Shopify catalogue',
      supplierUrl: '',
      productUrl: `https://${SHOP_DOMAIN}/products/${remote.handle}`,
      priceLabel: `${remote.priceRange.minVariantPrice.currencyCode} ${amount.toFixed(2)}`,
      moq: '1 item',
      salesSnapshot: '',
      riskNote: '',
      imageGallery: remote.images.nodes.map((entry) => entry.url),
      name: remote.title,
      chineseName: remote.title,
      subtitle: localCategory,
      specimen: remote.title,
      origin: '',
      priceNZD: amount,
      priceAUD: amount,
      priceUSD: amount,
      image,
      fallbackImage: image,
      intention: localIntention,
      intentionLabel: localCategory,
      badge: 'Shopify product',
      badgeIcon: 'shopping_bag',
      beadSizes: [],
      defaultSize: 'Default',
      configurations: [],
      description: remote.description,
      tactileBenefit: '',
      consecrationSeal: sku,
      materialsDetail: tags,
      variants,
      variantLabel: 'option',
    } satisfies MalaProduct;
  }).filter((product) => product.shopifyVariantId || product.variants?.length);
  return liveProducts.length ? liveProducts : SHOPIFY_STARTER_PRODUCTS;
}

export function categoryFromTags(tags: string[], title: string) {
  const text = `${tags.join(' ')} ${title}`.toLowerCase();
  if (/necklace|pendant/.test(text)) return 'Beaded Necklaces';
  if (/bodhi|seed/.test(text)) return 'Bodhi Seed & Natural Seed Beads';
  if (/agarwood|sandalwood|rosewood|wenge|chicken wing wood|wood prayer|wood mala/.test(text)) return 'Wood Prayer Beads';
  if (/mala|prayer|108/.test(text)) return 'Prayer Beads & Malas';
  return 'Natural Stone & Gemstone Bracelets';
}

function intentionFromTags(tags: string[]): MalaProduct['intention'] {
  const text = tags.join(' ');
  if (/element-water|element_water|water|obsidian/.test(text)) return 'protection';
  if (/element-fire|element_fire|fire|abundance/.test(text)) return 'abundance';
  if (/element-wood|element_wood|wood|focus/.test(text)) return 'focus';
  return 'stress';
}

const CART_CREATE = `mutation CreateStorefrontCart($lines: [CartLineInput!]!, $country: CountryCode!) {
  cartCreate(input: { lines: $lines, buyerIdentity: { countryCode: $country } }) { cart { id checkoutUrl } userErrors { field message } }
}`;

export async function createShopifyCheckout(lines: Array<{ merchandiseId: string; quantity: number; attributes?: Array<{ key: string; value: string }> }>, shippingCountry: ShippingCountryCode) {
  if (!STOREFRONT_TOKEN) {
    const checkoutLines = lines.map(({ merchandiseId, quantity }) => {
      const variantId = merchandiseId.split('/').pop();
      if (!variantId || !/^\d+$/.test(variantId)) throw new Error('A Shopify product option is missing. Remove it from your bag and add it again.');
      return `${variantId}:${Math.max(1, Math.floor(quantity))}`;
    });
    if (!checkoutLines.length) throw new Error('Your bag is empty. Add an item before checkout.');
    return `https://${SHOP_DOMAIN}/cart/${checkoutLines.join(',')}?checkout`;
  }
  const data = await storefront<{ cartCreate: { cart: { id: string; checkoutUrl: string } | null; userErrors: Array<{ message: string }> } }>(CART_CREATE, { lines, country: shippingCountry });
  const result = data.cartCreate;
  if (result.userErrors.length || !result.cart?.checkoutUrl) throw new Error(result.userErrors.map((error) => error.message).join(' ') || 'Shopify could not create checkout.');
  // The custom storefront domain points to this Vercel app, so Shopify's
  // generated checkout URL must use the canonical Shopify host instead.
  const checkoutUrl = new URL(result.cart.checkoutUrl);
  checkoutUrl.protocol = 'https:';
  checkoutUrl.host = SHOP_DOMAIN;
  return checkoutUrl.toString();
}
