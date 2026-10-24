import React, { useEffect, useState } from 'react';
import { Currency, MalaProduct } from '../types';
import { formatMoney } from '../utils/shipping';

interface QuickViewModalProps {
  product: MalaProduct | null;
  currency: Currency;
  preferredElement?: string;
  onClose: () => void;
  onAddToCart: (product: MalaProduct, size: string, config?: string) => void;
  onViewProduct: (product: MalaProduct) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, currency, preferredElement, onClose, onAddToCart, onViewProduct }) => {
  const [activeImage, setActiveImage] = useState('');
  const [selectedWood, setSelectedWood] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    setActiveImage(product?.image || '');
    const matchedVariant = product?.variants?.find((variant) => preferredElement && variant.name.toLowerCase().includes(preferredElement.toLowerCase()));
    const firstVariant = matchedVariant || product?.variants?.[0];
    setSelectedWood(firstVariant?.name || '');
    setSelectedSize(firstVariant?.sizes[0]?.size || 'Standard');
  }, [product?.id, product?.image, preferredElement]);

  if (!product) return null;

  const price = currency === 'AUD' ? product.priceAUD : currency === 'USD' ? product.priceUSD : product.priceNZD;
  const selectedVariant = product.variants?.find((variant) => variant.name === selectedWood);
  const selectedOption = selectedVariant?.sizes.find((option) => option.size === selectedSize);
  const chooseWood = (wood: string) => {
    const variant = product.variants?.find((item) => item.name === wood);
    if (!variant) return;
    setSelectedWood(wood);
    setSelectedSize((current) => variant.sizes.some((item) => item.size === current) ? current : variant.sizes[0].size);
    setActiveImage(variant.image || product.image);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-[#3A3835]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="relative bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl max-w-3xl w-full p-6 sm:p-8 aura-shadow overflow-y-auto max-h-[92vh]">
        <button onClick={onClose} aria-label="Close product details" className="absolute top-4 right-4 text-[#82746f] hover:text-[#321a0f] p-1.5 cursor-pointer">
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden bg-[#F3EFEA] aspect-square border border-[#EAE4DC]">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.imageGallery.map((image) => (
                <button key={image} onClick={() => setActiveImage(image)} aria-label="View product image" className={`aspect-square overflow-hidden rounded border ${activeImage === image ? 'border-[#321a0f]' : 'border-[#EAE4DC]'}`}>
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              {product.variants?.filter((variant) => variant.name === selectedWood && variant.image).map((variant) => (
                <button key={variant.image} onClick={() => setActiveImage(variant.image!)} aria-label="View selected wood option" className={`aspect-square overflow-hidden rounded border ${activeImage === variant.image ? 'border-[#321a0f]' : 'border-[#EAE4DC]'}`}>
                  <img src={variant.image!} alt="Selected wood" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <span className="text-[10px] text-[#4d6453] uppercase tracking-widest font-semibold">{product.category}</span>
              <h2 className="font-serif text-2xl text-[#321a0f] font-medium mt-1">{product.name}</h2>
              <p className="text-xs text-[#82746f] mt-1">{product.sku}</p>
            </div>
            <div><p className="font-serif text-2xl font-bold text-[#321a0f]">{formatMoney(selectedOption?.priceNZD ?? price, currency)} <span className="text-xs font-sans font-normal text-[#82746f]">per strand</span></p>{selectedOption && selectedOption.supplierCostNZD > 0 && <p className="mt-1 text-[11px] text-[#82746f]">Supplier cost snapshot: NZ${selectedOption.supplierCostNZD.toFixed(2)} per strand</p>}</div>
            <p className="text-sm text-[#504440] leading-relaxed">{product.description}</p>
            {product.variants && (
              <div className="space-y-3">
                <div className="flex justify-between items-center"><h3 className="text-sm font-semibold text-[#321a0f]">Choose {product.variantLabel || 'style'}</h3><span className="text-[11px] text-[#82746f]">{product.variants.length} options</span></div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1">
                  {product.variants.map((variant) => (
                    <button key={variant.name} type="button" onClick={() => chooseWood(variant.name)} title={variant.name} aria-label={variant.name} aria-pressed={selectedWood === variant.name} className={`relative rounded-md overflow-hidden border-2 aspect-square ${selectedWood === variant.name ? 'border-[#4d6453] ring-2 ring-[#4d6453]/20' : 'border-[#EAE4DC]'}`}>
                      {variant.image ? <><img src={variant.image} alt="" className="w-full h-full object-cover" /><span className="absolute bottom-0 inset-x-0 bg-[#321a0f]/80 text-white text-[9px] py-0.5">#{variant.number}</span></> : <span className="flex h-full flex-col items-center justify-center gap-1 bg-white px-1 text-center"><span className="font-serif text-lg text-[#bd8a36]">{String(variant.number).padStart(2, '0')}</span><span className="line-clamp-3 text-[9px] leading-3 text-[#504440]">{variant.name}</span></span>}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#504440]">{selectedWood}</p>
                <div>
                  <h3 className="text-sm font-semibold text-[#321a0f] mb-2">{product.sizeLabel || 'Size'}</h3>
                  <div className="flex gap-2">
                    {(selectedVariant?.sizes.map((option) => option.size) || []).map((size) => {
                      const available = selectedVariant?.sizes.some((option) => option.size === size && option.availableForSale !== false);
                      return <button key={size} type="button" disabled={!available} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded border text-xs ${!available ? 'opacity-40 cursor-not-allowed bg-[#F3EFEA]' : selectedSize === size ? 'bg-[#321a0f] border-[#321a0f] text-white' : 'bg-white border-[#EAE4DC] text-[#504440]'}`}>{size}{!available && ' · unavailable'}</button>;
                    })}
                  </div>
                </div>
                {selectedOption && <p className="text-[11px] text-[#82746f]">Store SKU: <span className="font-mono text-[#504440]">{selectedOption.sku}</span></p>}
                <p className="text-[10px] leading-relaxed text-[#82746f]">Variant names and material details are supplier-provided and should be confirmed before sale.</p>
              </div>
            )}
            <div className="rounded-lg bg-[#F3EFEA] border border-[#EAE4DC] p-4 space-y-2 text-xs text-[#504440]">
              <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[#4d6453]">public</span>Fulfilment location depends on the supplier.</p>
              <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[#4d6453]">local_shipping</span>Delivery coverage and the final shipping rate are confirmed at Shopify checkout.</p>
            </div>
            <button onClick={() => { onAddToCart(product, product.variants ? selectedSize : 'Standard', product.variants ? selectedWood : undefined); onClose(); }} disabled={Boolean(product.variants && !selectedOption)} className="w-full py-3.5 px-4 rounded bg-[#321a0f] hover:bg-[#2C1B14] disabled:opacity-50 text-[#FAF8F5] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md">
              <span className="material-symbols-outlined text-[#E1BD7E]">add_shopping_cart</span>
              <span>Add to Bag</span>
            </button>
            <button onClick={() => { onClose(); onViewProduct(product); }} className="w-full py-2 text-xs font-semibold text-[#4d6453] underline underline-offset-4">View full product page</button>
          </div>
        </div>
      </div>
    </div>
  );
};
