import { MalaProduct } from '../types';
import { MALA_PRODUCTS } from './malas';

const SHOP_DOMAIN = 'fozhu.co.nz';
const IMAGE_BASE = 'https://cdn.shopify.com/s/files/1/0858/3482/5964/files/';

const SHOPIFY_VARIANTS: Record<string, Array<{ id: string; title: string; sku: string }>> = {
  'jd-five-elements-bracelet': [
    { id: '67858045337836', title: 'Multi 1 Wood', sku: 'JD-24JDJSJ515-M01-8' },
    { id: '67858045370604', title: 'Multi 2 Fire', sku: 'JD-24JDJSJ515-M02-8' },
    { id: '67858045403372', title: 'Multi 3 Metal', sku: 'JD-24JDJSJ515-M03-8' },
    { id: '67858045436140', title: 'Multi 4 Water', sku: 'JD-24JDJSJ515-M04-8' },
    { id: '67858045468908', title: 'Multi 5 Water Wood', sku: 'JD-24JDJSJ515-M05-8' },
    { id: '67858045501676', title: 'Multi 6 Wood Fire', sku: 'JD-24JDJSJ515-M06-8' },
    { id: '67858045534444', title: 'Multi 7 Metal Water', sku: 'JD-24JDJSJ515-M07-8' },
  ],
  'zb-lava-black': [
    { id: '67858073682156', title: '4mm', sku: 'ZB-LAVA-BLACK-4' },
    { id: '67858073714924', title: '6mm', sku: 'ZB-LAVA-BLACK-6' },
    { id: '67858073747692', title: '8mm', sku: 'ZB-LAVA-BLACK-8' },
    { id: '67858073780460', title: '10mm', sku: 'ZB-LAVA-BLACK-10' },
  ],
};

const SHOPIFY_PRODUCTS: Record<string, { productId: string; handle: string; images: string[]; tags: string[] }> = {
  'jd-five-elements-bracelet': {
    productId: '15472583377132', handle: 'five-elements-natural-stone-bracelet-8-mm',
    images: ['jd-five-elements-bracelet.jpg', 'jd-five-elements-gallery-1_c30f344e-5381-4f08-a37f-4fe9e61df826.jpg', 'jd-five-elements-gallery-2_f7d6a460-9283-4134-9b86-d16c7a18fd4e.jpg', 'jd-five-elements-gallery-3_dc8250a3-a0a3-4b43-aa19-f41d8f02c61e.jpg', 'jd-five-elements-gallery-4_7159b882-e2c2-4d27-8721-f9620213348f.jpg', 'jd-five-elements-gallery-5_aa184282-fe35-4b3e-9b1d-06a5d37ad1b4.jpg'],
    tags: ['element-fire', 'element-metal', 'element-water', 'element-wood', 'five-elements'],
  },
  'zb-lava-tiger': {
    productId: '15472609755372', handle: 'tiger-eye-lava-stone-bracelet',
    images: ['zb-lava-tiger-1.jpg', 'zb-lava-tiger-2.jpg', 'zb-lava-tiger-3.jpg', 'zb-lava-tiger-4.jpg', 'zb-lava-tiger-6.jpg', 'zb-lava-tiger-7.jpg'],
    tags: ['lava-stone', 'tiger-eye', 'element-fire', 'element-earth'],
  },
  'zb-bodhi-jade': {
    productId: '15472609951980', handle: 'bodhi-seed-bracelet-with-green-beads',
    images: ['zb-bodhi-jade-1.jpg', 'zb-bodhi-jade-2.jpg', 'zb-bodhi-jade-3.jpg', 'zb-bodhi-jade-4.jpg', 'zb-bodhi-jade-5.jpg', 'zb-bodhi-jade-6.jpg'],
    tags: ['bodhi-seed', 'green-beads', 'element-wood', 'element-earth'],
  },
  'zb-lava-howlite': {
    productId: '15472610345196', handle: 'howlite-lava-stone-bracelet-8-mm',
    images: ['zb-lava-howlite-1.jpg', 'zb-lava-howlite-2.jpg', 'zb-lava-howlite-3.jpg', 'zb-lava-howlite-4.jpg', 'zb-lava-howlite-5.jpg', 'zb-lava-howlite-6.jpg', 'zb-lava-howlite-7.jpg'],
    tags: ['element-metal', 'element-earth', 'lava-stone', '8mm'],
  },
  'zb-lava-black': {
    productId: '15472610443500', handle: 'black-lava-stone-bracelet-4-6-8-10-mm',
    images: ['zb-lava-black-1.jpg', 'zb-lava-black-2.jpg', 'zb-lava-black-4.jpg'],
    tags: ['element-water', 'lava-stone', '4mm', '6mm', '8mm', '10mm'],
  },
};

const ACTIVE_PRODUCT_IDS = Object.keys(SHOPIFY_PRODUCTS);

function attachShopifyVariants(product: MalaProduct): MalaProduct {
  const data = SHOPIFY_PRODUCTS[product.id];
  if (!data) return product;
  const variants = SHOPIFY_VARIANTS[product.id];

  return {
    ...product,
    shopifyProductId: `gid://shopify/Product/${data.productId}`,
    shopifyHandle: data.handle,
    shopifyTags: data.tags,
    productUrl: `https://${SHOP_DOMAIN}/products/${data.handle}`,
    image: `${IMAGE_BASE}${data.images[0]}`,
    fallbackImage: `${IMAGE_BASE}${data.images[0]}`,
    imageGallery: data.images.map((image) => `${IMAGE_BASE}${image}`),
    ...(product.id === 'jd-five-elements-bracelet' ? {
      variants: product.variants?.map((variant, index) => ({
        ...variant,
        sizes: variant.sizes.map((size) => ({
          ...size,
          shopifyVariantId: variants?.[index]?.id ? `gid://shopify/ProductVariant/${variants[index].id}` : undefined,
          sku: variants?.[index]?.sku || size.sku,
          availableForSale: true,
        })),
      })),
    } : {}),
    ...(product.id === 'zb-lava-black' && variants ? {
      variantLabel: 'bead size',
      sizeLabel: 'Bead diameter',
      variants: variants.map((variant, index) => ({
        number: index + 1,
        name: variant.title,
        sizes: [{
          size: variant.title,
          supplierCostNZD: [0.72, 0.65, 0.60, 0.56][index],
          sku: variant.sku,
          shopifyVariantId: `gid://shopify/ProductVariant/${variant.id}`,
          priceNZD: 16.99,
          availableForSale: true,
        }],
      })),
    } : {}),
    ...(product.id !== 'jd-five-elements-bracelet' && product.id !== 'zb-lava-black' ? {
      shopifyVariantId: variants?.[0] ? `gid://shopify/ProductVariant/${variants[0].id}` : {
        'zb-lava-tiger': 'gid://shopify/ProductVariant/67858072994028',
        'zb-bodhi-jade': 'gid://shopify/ProductVariant/67858073223404',
        'zb-lava-howlite': 'gid://shopify/ProductVariant/67858073583852',
      }[product.id],
    } : {}),
  };
}

export const SHOPIFY_STARTER_PRODUCTS = MALA_PRODUCTS
  .filter((product) => ACTIVE_PRODUCT_IDS.includes(product.id))
  .map(attachShopifyVariants)
  .sort((a, b) => ACTIVE_PRODUCT_IDS.indexOf(a.id) - ACTIVE_PRODUCT_IDS.indexOf(b.id));

