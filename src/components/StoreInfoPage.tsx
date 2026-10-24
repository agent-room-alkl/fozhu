import React from 'react';
import { SHIPPING_COUNTRIES } from '../data/shippingCountries';

export type StoreInfoSlug = 'shipping' | 'privacy' | 'returns' | 'contact' | 'culture';

const PAGE_CONTENT: Record<Exclude<StoreInfoSlug, 'contact'>, { title: string; sections: Array<{ heading: string; body: string }> }> = {
  shipping: {
    title: 'Shipping & Delivery',
    sections: [
      { heading: 'Available destinations', body: `Shopify delivery is configured for ${SHIPPING_COUNTRIES.length} destinations. Choose your country in the flag selector; checkout confirms whether your basket can be delivered to your address.` },
      { heading: 'Shopify delivery rates', body: 'New Zealand: NZ$10 standard delivery, or NZ$0 when the order subtotal reaches NZ$110. The other 27 configured countries: NZ$33 per order in the store’s base currency (NZD). Shopify may show a converted amount in your local market currency; the checkout amount is final.' },
      { heading: 'Supplier delivery is separate', body: 'Shopify’s 28-country delivery setup does not mean every Alibaba supplier ships every item to all 28 countries. Supplier service, shipping fee, delivery time and minimum quantity vary by product and destination. Confirm the individual product’s shipping service before you publish or order it. One-item orders are supported where the supplier listing allows it; no group purchase is used.' },
      { heading: 'Fulfilment', body: 'Orders are arranged with the supplier after purchase. Fozhu does not currently provide automatic Alibaba order fulfilment. Different items may be sent as separate parcels, and tracking availability and timing depend on the supplier and route.' },
      { heading: 'Multiple items', body: 'The Shopify rate is calculated for the checkout order. When items come from different suppliers, parcels and supplier charges can differ; check the rate and delivery details shown at checkout. For questions before ordering, contact temple@fozhu.co.nz.' },
      { heading: 'Shopify configured destinations and store rates', body: SHIPPING_COUNTRIES.map((country) => `${country.flag} ${country.name}: ${country.code === 'NZ' ? 'NZ$10 standard; free from NZ$110' : 'NZ$33 base rate'}`).join(' · ') },
    ],
  },
  privacy: {
    title: 'Privacy',
    sections: [
      { heading: 'Checkout information', body: 'Payments, delivery addresses and order details are handled by Shopify to process your purchase.' },
      { heading: 'Birth reading information', body: 'If you request a BaZi reading, the birthplace is sent to Open-Meteo to look up location/time-zone information. Birth details are sent to the configured AI reading service to produce the requested reading. This site does not store the reading request in a site database.' },
      { heading: 'Analytics', body: 'Google Analytics is loaded only after you choose “Allow analytics”. You can keep using the site with essential storage only.' },
      { heading: 'Questions', body: 'For privacy questions, email temple@fozhu.co.nz.' },
    ],
  },
  returns: {
    title: 'Returns & Product Care',
    sections: [
      { heading: 'Before returning an item', body: 'Please contact us before sending anything back so we can confirm the correct return address and next steps. Email temple@fozhu.co.nz with your Shopify order number and a description of the issue.' },
      { heading: 'Supplier-fulfilled products', body: 'Items are arranged with suppliers after purchase. Return options may depend on the item and supplier; contact us promptly if an item arrives damaged, incorrect or otherwise not as described.' },
      { heading: 'Care', body: 'Beads and cords can be affected by water, chemicals, perfume and repeated impact. Follow any care information supplied with the particular product. Material and origin details are product-specific and should be checked on the product page.' },
    ],
  },
  culture: {
    title: 'Five Elements & BaZi: Cultural Reference',
    sections: [
      { heading: 'A traditional framework', body: 'The Five Elements (五行) and BaZi (八字) come from long-standing Chinese systems of thought. Fozhu presents these ideas as cultural heritage and a way to reflect on symbolism, balance and personal style.' },
      { heading: 'Personal interpretation', body: 'A reading or product suggestion is for personal reflection and styling reference only. It does not promise luck, protection, improved health, financial success or any other result. Interpretations vary across schools and practitioners.' },
      { heading: 'Product suggestions', body: 'Five-Element associations are traditional symbolic interpretations of colours and materials; they are not scientific assessments of a person or proof that a product changes energy or outcomes.' },
    ],
  },
};

export const StoreInfoPage: React.FC<{ slug: StoreInfoSlug; onBack: () => void }> = ({ slug, onBack }) => {
  if (slug === 'contact') return <main className="mx-auto min-h-[60vh] max-w-3xl px-4 py-14"><button onClick={onBack} className="mb-6 text-sm text-[#4d6453] underline">← Back to store</button><h1 className="font-serif text-4xl text-[#321a0f]">Contact Fozhu</h1><p className="mt-4 text-sm leading-7 text-[#504440]">For order, product, delivery or privacy questions, email us. Include your Shopify order number for order support.</p><a className="mt-5 inline-flex rounded bg-[#321a0f] px-5 py-3 text-sm text-white" href="mailto:temple@fozhu.co.nz">temple@fozhu.co.nz</a></main>;
  const page = PAGE_CONTENT[slug];
  return <main className="mx-auto min-h-[60vh] max-w-3xl px-4 py-14"><button onClick={onBack} className="mb-6 text-sm text-[#4d6453] underline">← Back to store</button><h1 className="font-serif text-4xl text-[#321a0f]">{page.title}</h1><div className="mt-8 space-y-7">{page.sections.map((section) => <section key={section.heading}><h2 className="font-serif text-xl text-[#321a0f]">{section.heading}</h2><p className="mt-2 text-sm leading-7 text-[#504440]">{section.body}</p></section>)}</div></main>;
};
