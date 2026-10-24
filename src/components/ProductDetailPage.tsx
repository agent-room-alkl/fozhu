import React, { useMemo, useState } from 'react';
import { Currency, MalaProduct } from '../types';
import { formatMoney } from '../utils/shipping';
import { getSelectedWoodOption } from '../utils/productVariants';

interface ProductDetailPageProps {
  product: MalaProduct;
  currency: Currency;
  onAddToCart: (product: MalaProduct, size: string, config?: string) => void;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, currency, onAddToCart, onBack }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.name || '');
  const currentVariant = useMemo(() => product.variants?.find((variant) => variant.name === selectedVariant), [product.variants, selectedVariant]);
  const [selectedSize, setSelectedSize] = useState(currentVariant?.sizes[0]?.size || product.defaultSize);
  const selectedOption = getSelectedWoodOption(product, selectedVariant, selectedSize);
  const amount = selectedOption?.priceNZD ?? (currency === 'AUD' ? product.priceAUD : currency === 'USD' ? product.priceUSD : product.priceNZD);
  const images = Array.from(new Set([product.image, ...product.imageGallery, ...(currentVariant?.image ? [currentVariant.image] : [])].filter(Boolean)));
  const [activeImage, setActiveImage] = useState(product.image);

  return (
    <main className="min-h-[70vh] bg-[#FAF8F5] text-[#3A3835]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={onBack} className="mb-6 text-sm text-[#4d6453] underline underline-offset-4">← Back to collection</button>
        <nav aria-label="Breadcrumb" className="mb-5 text-xs text-[#82746f]"><a href="/" className="hover:text-[#321a0f]">Home</a><span className="mx-2">/</span><span>{product.category}</span><span className="mx-2">/</span><span aria-current="page">{product.name}</span></nav>
        <div className="grid gap-8 lg:grid-cols-2">
          <section aria-label="Product images" className="space-y-3">
            <div className="aspect-square overflow-hidden rounded-xl border border-[#EAE4DC] bg-white"><img src={activeImage || product.image} alt={product.name} className="h-full w-full object-cover" /></div>
            <div className="grid grid-cols-5 gap-2">{images.map((image) => <button key={image} onClick={() => setActiveImage(image)} aria-label="View product image" className={`aspect-square overflow-hidden rounded-lg border ${activeImage === image ? 'border-[#321a0f]' : 'border-[#EAE4DC]'}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>
          </section>
          <section className="space-y-5 rounded-xl border border-[#EAE4DC] bg-white p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4d6453]">{product.category}</p>
            <h1 className="font-serif text-3xl leading-tight text-[#321a0f]">{product.name}</h1>
            <p className="text-xs text-[#82746f]">SKU: {selectedOption?.sku || product.sku}</p>
            <p className="font-serif text-2xl font-bold text-[#321a0f]">{formatMoney(amount, currency)} <span className="text-xs font-sans font-normal text-[#82746f]">per item</span></p>
            <p className="whitespace-pre-line text-sm leading-7 text-[#504440]">{product.description}</p>
            {product.variants && <div className="space-y-3"><h2 className="text-sm font-semibold text-[#321a0f]">Choose {product.variantLabel || 'option'}</h2><div className="grid grid-cols-3 gap-2">{product.variants.map((variant) => <button key={variant.name} onClick={() => { setSelectedVariant(variant.name); setSelectedSize(variant.sizes[0]?.size || 'Default'); if (variant.image) setActiveImage(variant.image); }} aria-pressed={selectedVariant === variant.name} className={`rounded-md border px-3 py-2 text-xs ${selectedVariant === variant.name ? 'border-[#321a0f] bg-[#321a0f] text-white' : 'border-[#EAE4DC] bg-[#FAF8F5] text-[#504440]'}`}>{variant.name}</button>)}</div><div className="flex flex-wrap gap-2">{currentVariant?.sizes.map((option) => <button key={option.size} disabled={option.availableForSale === false} onClick={() => setSelectedSize(option.size)} className={`rounded border px-3 py-2 text-xs ${selectedSize === option.size ? 'border-[#321a0f] bg-[#F3EFEA]' : 'border-[#EAE4DC]'}`}>{option.size}</button>)}</div></div>}
            <div className="rounded-lg bg-[#F7F3EF] p-4 text-xs leading-5 text-[#625650]"><p>Delivery countries and the final shipping rate are confirmed by Shopify checkout.</p><p className="mt-2">Product material and origin details are based on the listing and should be confirmed for each item.</p></div>
            <button onClick={() => onAddToCart(product, product.variants ? selectedSize : product.defaultSize, product.variants ? selectedVariant : undefined)} className="w-full rounded-md bg-[#321a0f] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#4a2f23]">Add to bag</button>
          </section>
        </div>
      </div>
    </main>
  );
};
