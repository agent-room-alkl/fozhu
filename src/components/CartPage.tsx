import React from 'react';
import { CartItem, Currency } from '../types';
import { formatMoney, getFreeShippingThreshold, getShippingFee } from '../utils/shipping';
import { getCartItemImage, getCartItemPrice, getCartItemSku } from '../utils/productVariants';

interface CartPageProps {
  cartItems: CartItem[];
  currency: Currency;
  onUpdateQty: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
  checkoutBusy?: boolean;
  checkoutError?: string;
}

export const CartPage: React.FC<CartPageProps> = ({ cartItems, currency, onUpdateQty, onRemoveItem, onContinueShopping, onCheckout, checkoutBusy = false, checkoutError = '' }) => {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => {
    const price = getCartItemPrice(item, currency);
    return sum + price * item.quantity;
  }, 0);
  const shipping = getShippingFee(subtotal, currency);
  const freeShippingThreshold = getFreeShippingThreshold(currency);
  const remainingForFreeShipping = freeShippingThreshold === null ? 0 : Math.max(0, freeShippingThreshold - subtotal);

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#3A3835]">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EAE4DC] pb-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#4d6453] font-semibold">Your order</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#321a0f] mt-1">Shopping Bag</h1>
        <p className="text-sm text-[#82746f] mt-2">Payment and delivery address are confirmed at Shopify checkout. Supplier fulfilment is arranged after you place an order.</p>
          </div>
          <button onClick={onContinueShopping} className="text-sm text-[#4d6453] underline underline-offset-4">Continue shopping</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-[#F3EFEA] rounded-xl border border-[#EAE4DC] p-8 max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-4xl text-[#E1BD7E]">shopping_bag</span>
            <h2 className="font-serif text-2xl text-[#321a0f] mt-3">Your bag is empty</h2>
            <p className="text-sm text-[#504440] mt-2">Browse the collection and add a piece to get started.</p>
            <button onClick={onContinueShopping} className="mt-6 px-6 py-3 rounded bg-[#321a0f] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider">Shop the collection</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
            <section className="space-y-4">
              {freeShippingThreshold !== null && remainingForFreeShipping > 0 ? (
                <div className="p-4 rounded-lg bg-[#F3EFEA] border border-[#EAE4DC] text-sm">
                  Add <strong>{formatMoney(remainingForFreeShipping, currency)}</strong> to reach the current New Zealand free-shipping threshold of {formatMoney(freeShippingThreshold, currency)}.
                  <div className="mt-3 h-1.5 rounded-full bg-[#EAE4DC] overflow-hidden"><div className="h-full bg-[#4d6453]" style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }} /></div>
                </div>
              ) : freeShippingThreshold !== null ? (
                <div className="p-4 rounded-lg bg-[#cfe9d4]/70 border border-[#cfe9d4] text-sm text-[#0a2013] flex items-center gap-2"><span className="material-symbols-outlined">local_shipping</span>Free-shipping estimate reached. Shopify checkout confirms the final delivery rate.</div>
              ) : (
                <div className="p-4 rounded-lg bg-[#F3EFEA] border border-[#EAE4DC] text-sm">International delivery is available to selected destinations. The final rate is confirmed at Shopify checkout.</div>
              )}

              {cartItems.map((item) => {
                const unitPrice = getCartItemPrice(item, currency);
                return (
                  <article key={item.cartItemId} className="bg-white rounded-xl border border-[#EAE4DC] p-4 sm:p-5 flex gap-4">
                    <img src={getCartItemImage(item)} alt={item.product.name} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg bg-[#F3EFEA]" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                      <div className="flex justify-between gap-3">
                        <div><h2 className="font-serif text-base sm:text-lg text-[#321a0f]">{item.product.name}</h2><p className="text-xs text-[#82746f] mt-1">{item.selectedConfig && item.selectedConfig !== item.selectedSize ? <>{item.selectedConfig} · </> : null}{item.selectedSize}</p>{item.baziElement && <p className="mt-1 text-[11px] text-[#4d6453]">Recommended from your Five Elements reading · {item.baziElement}</p>}<p className="text-[10px] font-mono text-[#82746f] mt-1">{getCartItemSku(item)}</p></div>
                        <button onClick={() => onRemoveItem(item.cartItemId)} aria-label={`Remove ${item.product.name}`} className="text-xs text-[#82746f] hover:text-red-700 underline shrink-0">Remove</button>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center border border-[#EAE4DC] rounded">
                          <button onClick={() => onUpdateQty(item.cartItemId, item.quantity - 1)} aria-label="Decrease quantity" className="px-3 py-1.5">−</button>
                          <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.cartItemId, item.quantity + 1)} aria-label="Increase quantity" className="px-3 py-1.5">+</button>
                        </div>
                        <span className="font-semibold text-[#321a0f]">{formatMoney(unitPrice * item.quantity, currency)}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="bg-white rounded-xl border border-[#EAE4DC] p-6 space-y-4 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl text-[#321a0f]">Order summary</h2>
              <div className="flex justify-between text-sm"><span>Items ({itemCount})</span><span>{formatMoney(subtotal, currency)}</span></div>
              <div className="flex justify-between items-start text-sm gap-4"><span>Estimated shipping</span><span className={shipping === 0 ? 'text-[#4d6453] font-semibold' : ''}>{shipping === 0 ? 'FREE' : formatMoney(shipping, currency)}</span></div>
              <p className="text-[11px] text-[#82746f] -mt-2">Current Shopify rates: NZ orders are NZ$10, free at NZ$110+; selected international destinations are NZ$33 equivalent. Shopify confirms the final destination rate and taxes at checkout.</p>
              <div className="border-t border-[#EAE4DC] pt-4 flex justify-between font-semibold text-[#321a0f]"><span>Total</span><span>{formatMoney(subtotal + shipping, currency)}</span></div>
              {checkoutError && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800">{checkoutError}</p>}
              <button onClick={onCheckout} disabled={checkoutBusy} className="w-full py-3.5 rounded bg-[#321a0f] hover:bg-[#2C1B14] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider">{checkoutBusy ? 'Preparing secure checkout…' : 'Continue to Shopify checkout'}</button>
              <p className="text-[11px] text-center text-[#82746f]">Supplier shipping fees and delivery coverage have not yet been matched to these store rates. Review the final rate before paying.</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};
