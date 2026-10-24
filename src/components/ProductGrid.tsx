import React, { useState } from 'react';
import { Currency, MalaProduct, SoulIntention } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: MalaProduct[];
  currency: Currency;
  activeIntention: SoulIntention;
  searchQuery: string;
  onAddToCart: (product: MalaProduct, size: string, config?: string) => void;
  onQuickView: (productId: string) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currency,
  activeIntention,
  searchQuery,
  onAddToCart,
  onQuickView,
  onResetFilters,
}) => {
  const allCategories = 'All categories';
  const [categoryFilter, setCategoryFilter] = useState(allCategories);
  const categories = [allCategories, ...Array.from(new Set(products.map((product) => product.category)))];

  const filteredProducts = products.filter((p) => {
    // Intention filter
    if (activeIntention !== 'all' && p.intention !== activeIntention) {
      return false;
    }

    if (categoryFilter !== allCategories && p.category !== categoryFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.chineseName.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <section className="py-16 bg-[#FAF8F5] border-b border-[#EAE4DC]" id="collections">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-sans text-[#4d6453] uppercase tracking-widest block mb-1 font-semibold">
              FOZHU NZ · PRODUCT SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#321a0f]">
              Prayer Beads & Bracelets
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-[#3A3835]">
            <span className="text-[#82746f]">Category:</span>
            {categories.map((category) => (
              <button key={category} onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${categoryFilter === category ? 'bg-[#321a0f] text-white font-semibold' : 'bg-[#F3EFEA] text-[#504440] hover:bg-[#EAE4DC]'}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <>
          <p className="text-xs text-[#82746f] mb-4">Showing {filteredProducts.length} of {products.length} products</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>
          </>
        ) : (
          <div className="text-center py-16 bg-[#F3EFEA] rounded-lg border border-[#EAE4DC] p-8 space-y-4">
            <span className="material-symbols-outlined text-4xl text-[#E1BD7E]">spa</span>
            <h3 className="font-serif text-xl text-[#321a0f]">No matching products</h3>
            <p className="text-xs font-sans text-[#504440] max-w-md mx-auto">
              Try another category or clear your search.
            </p>
            <button
              onClick={() => {
                setCategoryFilter(allCategories);
                onResetFilters();
              }}
              className="px-4 py-2 rounded bg-[#321a0f] text-[#FAF8F5] text-xs font-sans font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
