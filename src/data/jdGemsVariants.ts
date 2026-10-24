import { ProductVariant } from '../types';

// Alibaba listing 1601307903632. Model number is listing-level; no separate
// supplier SKU is exposed for each color, so these are internal store SKUs.
export const JD_GEMS_FIVE_ELEMENTS_VARIANTS: ProductVariant[] = [
  ['Multi 1 Wood', 2.62],
  ['Multi 2 Fire', 3.72],
  ['Multi 3 Metal', 2.32],
  ['Multi 4 Water', 2.41],
  ['Multi 5 Water Wood', 2.16],
  ['Multi 6 Wood Fire', 2.62],
  ['Multi 7 Metal Water', 2.07],
].map(([name, supplierCostNZD], index) => ({
  number: index + 1,
  name: name as string,
  sizes: [{
    size: '8mm',
    supplierCostNZD: supplierCostNZD as number,
    sku: `JD-24JDJSJ515-M${String(index + 1).padStart(2, '0')}-8`,
  }],
}));
