import { WoodVariant } from '../types';

// Supplier page variants observed on 24 Oct 2026. Alibaba displays no separate
// supplier SKU (Model Number: NONE), so the size SKUs below are our internal IDs.
const options: Array<[string, number, number]> = [
  ['Green & Brown Sandalwood Wood', 1.83, 2.21],
  ['Fragrant Vietnamese Agarwood', 1.47, 1.83],
  ['Peltogyne / Purple Heart Wood', 1.47, 1.83],
  ['Fragrant Burmese Rosewood / Padauk', 1.47, 1.83],
  ['Golden / Yellow Sandalwood', 1.83, 2.21],
  ['Fragrant Tiger Skin Sandalwood', 2.21, 2.57],
  ['Black Sandalwood', 1.47, 1.83],
  ['Fragrant Brown Babie Sandalwood', 3.30, 3.68],
  ['Fragrant Cypress Wood (Chinese Thuja Wood)', 1.47, 1.83],
  ['Wenge Wood', 1.47, 1.83],
];

export const DIBISHI_STRETCH_108_VARIANTS: WoodVariant[] = options.map(([name, cost6, cost8], index) => ({
  number: index + 1,
  name,
  sizes: [
    { size: '6mm', supplierCostNZD: cost6, sku: `ZB-SANDAL-108-STRETCH-${String(index + 1).padStart(2, '0')}-6` },
    { size: '8mm', supplierCostNZD: cost8, sku: `ZB-SANDAL-108-STRETCH-${String(index + 1).padStart(2, '0')}-8` },
  ],
}));
