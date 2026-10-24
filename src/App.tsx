import { useEffect, useState } from 'react';
import { BirthDetails, Currency, SoulIntention, CartItem, MalaProduct } from './types';
import { MALA_PRODUCTS } from './data/malas';
import { SHOPIFY_STARTER_PRODUCTS } from './data/shopifyStarterCatalog';
import { DEFAULT_SHIPPING_COUNTRY, getShippingCountry, SHIPPING_COUNTRIES, ShippingCountryCode } from './data/shippingCountries';
import { singingBowl } from './utils/audio';

// Components
import { TopNotificationBar } from './components/TopNotificationBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IntentionSelector } from './components/IntentionSelector';
import { ProductGrid } from './components/ProductGrid';
import { SacredConsecrationSection } from './components/SacredConsecrationSection';
import { LineageStorySection } from './components/LineageStorySection';
import { IntentionQuizBanner } from './components/IntentionQuizBanner';
import { IntentionQuizModal } from './components/IntentionQuizModal';
import { TrustGuaranteesSection } from './components/TrustGuaranteesSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { CartPage } from './components/CartPage';
import { QuickViewModal } from './components/QuickViewModal';
import { SingingBowlAudioModal } from './components/SingingBowlAudioModal';
import { Toast } from './components/Toast';
import { BirthChartGuide } from './components/BirthChartGuide';
import { ProductDetailPage } from './components/ProductDetailPage';
import { StoreInfoPage, StoreInfoSlug } from './components/StoreInfoPage';
import { createShopifyCheckout, hasShopifyStorefrontToken, isShopifyConfigured, loadShopifyProducts } from './services/shopifyStorefront';
import { getShopifyVariantId } from './utils/productVariants';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'cart' | 'birth-chart'>('home');
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [currency, setCurrency] = useState<Currency>('NZD');
  const [shippingCountry, setShippingCountry] = useState<ShippingCountryCode>(DEFAULT_SHIPPING_COUNTRY);
  const [detectedCountryCode, setDetectedCountryCode] = useState<string | null>(null);
  const [activeIntention, setActiveIntention] = useState<SoulIntention>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collectionFilter, setCollectionFilter] = useState<'108-malas' | 'sacred-woods' | null>(null);
  const [birthDetails, setBirthDetails] = useState<BirthDetails | null>(null);
  const [products, setProducts] = useState<MalaProduct[]>(SHOPIFY_STARTER_PRODUCTS);
  const [shopifyCatalogState, setShopifyCatalogState] = useState<'loading' | 'connected' | 'empty' | 'preview' | 'error'>(hasShopifyStorefrontToken ? 'loading' : 'preview');
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    let active = true;
    const savedCountryCode = localStorage.getItem('fozhu-ship-country');
    const savedCountry = getShippingCountry(savedCountryCode);
    if (savedCountry) {
      setShippingCountry(savedCountry.code);
      setCurrency(savedCountry.currency);
    }
    fetch('/api/geo-country', { headers: { Accept: 'application/json' } })
      .then((response) => response.ok ? response.json() : null)
      .then((result: { countryCode?: string | null } | null) => {
        if (!active || !result?.countryCode) return;
        setDetectedCountryCode(result.countryCode.toUpperCase());
        if (savedCountry) return;
        const detectedCountry = getShippingCountry(result.countryCode);
        const country = detectedCountry || SHIPPING_COUNTRIES.find((item) => item.code === DEFAULT_SHIPPING_COUNTRY)!;
        setShippingCountry(country.code);
        setCurrency(country.currency);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const onPopState = () => { setPathname(window.location.pathname); setCurrentScreen('home'); window.scrollTo(0, 0); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigatePath = (path: string) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setPathname(path);
    setCurrentScreen('home');
    window.scrollTo(0, 0);
  };

  const handleShippingCountryChange = (code: ShippingCountryCode) => {
    const country = getShippingCountry(code);
    if (!country) return;
    setShippingCountry(country.code);
    setCurrency(country.currency);
    localStorage.setItem('fozhu-ship-country', country.code);
    singingBowl.strike(528, 1.5);
    showToast(`Shipping destination set to ${country.name}.`);
  };

  useEffect(() => {
    if (!hasShopifyStorefrontToken) return;
    let active = true;
    setShopifyCatalogState('loading');
    loadShopifyProducts(shippingCountry).then((items) => {
      if (!active) return;
      setProducts(items);
      if (items[0]?.storefrontCurrency) setCurrency(items[0].storefrontCurrency);
      setCartItems((current) => current.map((item) => {
        const liveProduct = items.find((product) => product.shopifyProductId === item.product.shopifyProductId || product.sku === item.product.sku);
        return liveProduct ? { ...item, product: liveProduct } : item;
      }));
      setShopifyCatalogState(items.length ? 'connected' : 'empty');
    }).catch(() => {
      if (active) setShopifyCatalogState('error');
    });
    return () => { active = false; };
  }, [shippingCountry]);

  // Keep the same bag across refreshes; Shopify product data is reconciled when it loads.
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('fozhu-cart') || '[]') as CartItem[];
      return saved.map((item) => {
        const latestProduct = MALA_PRODUCTS.find((product) => product.id === item.productId);
        return latestProduct ? { ...item, product: latestProduct } : item;
      });
    }
    catch { return []; }
  });
  useEffect(() => { localStorage.setItem('fozhu-cart', JSON.stringify(cartItems)); }, [cartItems]);

  // Modals state
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAudioGuideOpen, setIsAudioGuideOpen] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [pendingBaziElement, setPendingBaziElement] = useState<string | undefined>();

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const handleAddToCart = (product: MalaProduct, size: string, config?: string, baziElement?: string) => {
    const shopifyVariantId = getShopifyVariantId(product, config, size);
    setCartItems((prev) => {
      const existing = prev.find(
        (it) => it.productId === product.id && it.selectedSize === size && it.selectedConfig === config && it.shopifyVariantId === shopifyVariantId && it.baziElement === baziElement
      );
      if (existing) {
        return prev.map((it) =>
          it.cartItemId === existing.cartItemId ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      const newItem: CartItem = {
        cartItemId: `item-${Date.now()}`,
        productId: product.id,
        product,
        selectedSize: size,
        selectedConfig: config,
        wristSize: config === 'Full 108 Beads' ? 'Standard 108 Mala' : '16.5cm (Natural Fit)',
        quantity: 1,
        chantingNameDedication: '',
        sealNumber: '',
        shopifyVariantId,
        baziElement,
      };
      return [...prev, newItem];
    });

    singingBowl.strike(432, 2.5);
    showToast(`Added ${product.name} to your Sacred Bag.`);
  };

  const handleUpdateQty = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((it) => (it.cartItemId === cartItemId ? { ...it, quantity: newQty } : it))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.cartItemId !== cartItemId));
    showToast('Mala removed from bag.');
  };

  const handleCheckout = async () => {
    setCheckoutError('');
    if (!isShopifyConfigured) {
      setCheckoutError('Shopify checkout is not connected yet. Add the Storefront API settings, then products and checkout will use your Shopify store.');
      return;
    }
    const lines = cartItems.map((item) => ({
      merchandiseId: item.shopifyVariantId || getShopifyVariantId(item.product, item.selectedConfig, item.selectedSize),
      quantity: item.quantity,
      ...(item.baziElement ? { attributes: [{ key: 'Five Elements recommendation', value: item.baziElement }] } : {}),
    }));
    if (lines.some((line) => !line.merchandiseId)) {
      setCheckoutError('One or more items are from the local preview catalogue and do not have a Shopify variant. Please add the Shopify-listed products again.');
      return;
    }
    setCheckoutBusy(true);
    try {
      const checkoutUrl = await createShopifyCheckout(lines as Array<{ merchandiseId: string; quantity: number; attributes?: Array<{ key: string; value: string }> }>, shippingCountry);
      window.location.assign(checkoutUrl);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Shopify could not open checkout. Please try again.');
    } finally {
      setCheckoutBusy(false);
    }
  };

  const quickViewProduct = products.find((p) => p.id === quickViewProductId) || null;
  const productHandleFromPath = pathname.match(/^\/products\/([^/]+)/)?.[1];
  const activeProduct = productHandleFromPath ? products.find((product) => product.shopifyHandle === productHandleFromPath || product.id === productHandleFromPath) : undefined;
  const infoSlug = pathname.match(/^\/pages\/([^/]+)/)?.[1] as StoreInfoSlug | undefined;
  const handleViewProduct = (product: MalaProduct) => {
    const handle = product.shopifyHandle || product.id;
    navigatePath(`/products/${handle}`);
  };
  const selectCollection = (filter: '108-malas' | 'sacred-woods' | null) => {
    setCollectionFilter(filter);
    setActiveIntention('all');
  };
  const infoPages: StoreInfoSlug[] = ['shipping', 'privacy', 'returns', 'contact', 'culture'];

  useEffect(() => {
    const title = activeProduct
      ? `${activeProduct.name} | Fozhu`
      : infoSlug && infoPages.includes(infoSlug)
        ? `${infoSlug === 'contact' ? 'Contact' : infoSlug === 'culture' ? 'Five Elements & BaZi' : infoSlug[0].toUpperCase() + infoSlug.slice(1)} | Fozhu`
        : 'Five Elements Beads & Prayer Malas | Fozhu NZ';
    document.title = title;
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.appendChild(description); }
    description.content = activeProduct
      ? `${activeProduct.description.slice(0, 250)} Five Elements meanings are a cultural reference, not a promised outcome.`
      : 'Explore bead designs and BaZi-inspired readings rooted in Chinese Five Elements traditions. Cultural and styling reference only.';
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `https://fozhu.co.nz${pathname === '/' ? '/' : pathname}`;
    const existingProductSchema = document.getElementById('fozhu-product-schema');
    existingProductSchema?.remove();
    if (activeProduct) {
      const schema = document.createElement('script');
      schema.id = 'fozhu-product-schema';
      schema.type = 'application/ld+json';
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: activeProduct.name,
        description: activeProduct.description,
        image: activeProduct.imageGallery.length ? activeProduct.imageGallery : [activeProduct.image],
        sku: activeProduct.sku,
        category: activeProduct.category,
        brand: { '@type': 'Brand', name: 'Fozhu' },
        url: `https://fozhu.co.nz/products/${activeProduct.shopifyHandle || activeProduct.id}`,
      });
      document.head.appendChild(schema);
    }
  }, [pathname, activeProduct?.id, infoSlug]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#3A3835] font-sans flex flex-col selection:bg-[#E1BD7E] selection:text-[#2C1B14]">
      {/* 1. Regional Notification Bar */}
      <TopNotificationBar
        currency={currency}
        shippingCountry={shippingCountry}
        detectedCountryCode={detectedCountryCode}
        onShippingCountryChange={handleShippingCountryChange}
        flightTimer="04:32:15"
      />

      {/* 2. Top Navigation Bar */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(scr) => {
          if (pathname !== '/') {
            window.history.pushState({}, '', '/');
            setPathname('/');
          }
          setCurrentScreen(scr);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCollection={selectCollection}
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenSoundBowl={() => setIsAudioGuideOpen(true)}
        onSearch={(q) => {
          setSearchQuery(q);
          if (pathname !== '/') {
            window.history.pushState({}, '', '/');
            setPathname('/');
          }
          setCurrentScreen('home');
          window.setTimeout(() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }), 0);
        }}
      />

      {/* 3. Screen Switching: Home View vs Cart / Spiritual Order View */}
      {productHandleFromPath ? (
        activeProduct ? <ProductDetailPage product={activeProduct} currency={currency} onAddToCart={(product, size, config) => handleAddToCart(product, size, config)} onBack={() => navigatePath('/')} />
          : <main className="min-h-[60vh] mx-auto max-w-3xl p-8 text-center"><h1 className="font-serif text-3xl text-[#321a0f]">{shopifyCatalogState === 'loading' ? 'Loading product…' : 'Product not found'}</h1><button onClick={() => navigatePath('/')} className="mt-5 underline">Return to the collection</button></main>
      ) : infoSlug && infoPages.includes(infoSlug) ? (
        <StoreInfoPage slug={infoSlug} onBack={() => navigatePath('/')} />
      ) : currentScreen === 'home' ? (
        <main className="flex-1">
          {/* Hero Section with Cinematic Visual */}
          <HeroSection
            currency={currency}
            featuredProduct={products[0]}
            onExploreCollections={() => {
              const el = document.getElementById('collections');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onSubmitBirthDetails={(details) => {
              setBirthDetails(details);
              setCurrentScreen('birth-chart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          onQuickViewHeroItem={() => { if (products[0]) handleViewProduct(products[0]); }}
          />

          {/* Interactive 'Choose by Life Intention' Selector */}
          <IntentionSelector
            selectedIntention={activeIntention}
            onSelectIntention={(intent) => {
              setActiveIntention(intent);
              singingBowl.strike(432, 1.5);
              const el = document.getElementById('collections');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Curated Sacred Bead Collections (Main Store Grid) */}
          {shopifyCatalogState !== 'connected' && (
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
              <p className={`rounded-lg border px-4 py-3 text-xs leading-5 ${shopifyCatalogState === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-[#EAE4DC] bg-white text-[#625650]'}`}>
                {shopifyCatalogState === 'loading' ? 'Loading products from Shopify…' : shopifyCatalogState === 'error' ? 'Shopify catalogue could not load. Check Storefront API access and make sure products are active on the Online Store.' : shopifyCatalogState === 'empty' ? 'Shopify is connected, but no active products are available on the Online Store channel yet. Draft products stay hidden from customers.' : 'Showing the local preview catalogue. Shopify checkout is available, but live product sync is not connected yet.'}
              </p>
            </div>
          )}
          <ProductGrid
            products={products}
            currency={currency}
            activeIntention={activeIntention}
            searchQuery={searchQuery}
            collectionFilter={collectionFilter}
            onCollectionFilterChange={selectCollection}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            onQuickView={(id) => { setPendingBaziElement(undefined); setQuickViewProductId(id); }}
            onResetFilters={() => {
              setActiveIntention('all');
              setSearchQuery('');
            }}
          />

          {/* The Sacred Consecration Story (Monastic Kaiguang & 4-Step Bento Grid) */}
          <SacredConsecrationSection
            onExploreMalas={() => {
              const el = document.getElementById('collections');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenSoundGuide={() => setIsAudioGuideOpen(true)}
          />

          {/* Lineage & Authenticity Story (Editorial Section) */}
          <LineageStorySection />

          {/* Interactive 60-Sec Intention Quiz Banner */}
          <IntentionQuizBanner onOpenQuiz={() => setIsQuizOpen(true)} />

          {/* Customer Trust & Shipping Guarantee (NZ, AU, US) */}
          <TrustGuaranteesSection />

          {/* Email Newsletter / First Mala Gift */}
          <NewsletterSection onPlayAudioGuide={() => setIsAudioGuideOpen(true)} />
        </main>
      ) : currentScreen === 'cart' ? (
        /* Cart / Spiritual Order Screen */
        <div className="flex-1">
          <CartPage
            cartItems={cartItems}
            currency={currency}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onContinueShopping={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCheckout={() => void handleCheckout()}
            checkoutBusy={checkoutBusy}
            checkoutError={checkoutError}
          />
        </div>
      ) : (
        <BirthChartGuide
          currency={currency}
          products={products}
          initialDetails={birthDetails}
          onAddToCart={handleAddToCart}
          onBackToStore={() => setCurrentScreen('home')}
          onViewProduct={handleViewProduct}
          onQuickView={(id, element) => { setPendingBaziElement(element); setQuickViewProductId(id); }}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <IntentionQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onAddToCart={handleAddToCart}
        products={products}
      />

      <QuickViewModal
        product={quickViewProduct}
        currency={currency}
        preferredElement={pendingBaziElement}
        onClose={() => { setQuickViewProductId(null); setPendingBaziElement(undefined); }}
        onViewProduct={handleViewProduct}
        onAddToCart={(product, size, config) => { handleAddToCart(product, size, config, pendingBaziElement); setPendingBaziElement(undefined); }}
      />

      <SingingBowlAudioModal
        isOpen={isAudioGuideOpen}
        onClose={() => setIsAudioGuideOpen(false)}
      />

      {/* Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
