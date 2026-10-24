import React from 'react';
import { Currency, MalaProduct } from '../types';
import { formatMoney } from '../utils/shipping';

interface ProductCardProps {
  product: MalaProduct;
  currency: Currency;
  onAddToCart: (product: MalaProduct, size: string, config?: string) => void;
  onQuickView: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onAddToCart,
  onQuickView,
}) => {

  return (
    <article className="group bg-[#F3EFEA] rounded-lg border border-[#EAE4DC] overflow-hidden flex flex-col justify-between hover:border-[#82746f] transition-all aura-shadow">
      <div>
        {/* Frameless Image Container with Patina Badge */}
        <div
          onClick={() => onQuickView(product.id)}
          className="relative bg-[#ece7e4] aspect-square overflow-hidden cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <span className="absolute top-3 left-3 bg-[#FAF8F5]/95 text-[#321a0f] text-[11px] font-sans px-2.5 py-1 rounded border border-[#EAE4DC] flex items-center gap-1 shadow-sm font-medium">
            <span className="material-symbols-outlined text-xs text-[#E1BD7E]">
              {product.badgeIcon}
            </span>
            <span>{product.category}</span>
          </span>

          <span className="absolute bottom-3 right-3 bg-[#2C1B14]/85 text-[#FAF8F5] text-[10px] tracking-widest font-sans px-2 py-0.5 rounded uppercase font-semibold">
            {product.sku}
          </span>
        </div>

        {/* Product Details */}
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3
                onClick={() => onQuickView(product.id)}
                className="font-serif text-lg font-medium text-[#321a0f] group-hover:text-[#E1BD7E] transition-colors cursor-pointer"
              >
                {product.name}
              </h3>
              <p className="text-[11px] font-sans text-[#82746f] mt-0.5">
                {product.sku}
              </p>
            </div>
          </div>

          <p className="text-xs font-sans text-[#504440] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          {product.variants && <p className="text-[11px] text-[#4d6453]">{product.variants.length} {product.variantLabel || 'style'} options · {product.variants.reduce((total, variant) => total + variant.sizes.length, 0)} available SKUs</p>}
          <p className="text-[11px] font-sans text-[#82746f]">Supplier fulfilment · Shipping details at checkout</p>
        </div>
      </div>

      {/* Card Bottom Bar & Instant Add */}
      <div className="px-5 pb-5 pt-2 border-t border-[#EAE4DC] flex items-center justify-between">
        <div>
          <span className="font-serif text-lg text-[#321a0f] font-bold">
            {formatMoney(currency === 'NZD' ? product.priceNZD : currency === 'AUD' ? product.priceAUD : product.priceUSD, currency)}
          </span>
          <span className="text-[10px] font-sans text-[#82746f] block">
            <span>Retail price</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => product.variants ? onQuickView(product.id) : onAddToCart(product, 'Standard')}
          className="px-4 py-2.5 rounded bg-[#321a0f] text-[#FAF8F5] text-xs font-sans hover:bg-[#2C1B14] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer font-medium"
        >
          <span className="material-symbols-outlined text-sm">{product.variants ? 'tune' : 'add_shopping_cart'}</span>
          <span>{product.variants ? 'Choose options' : 'Add to Bag'}</span>
        </button>
      </div>
    </article>
  );
};
