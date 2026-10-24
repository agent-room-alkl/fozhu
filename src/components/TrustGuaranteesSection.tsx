import React from 'react';

export const TrustGuaranteesSection: React.FC = () => (
  <section className="py-12 bg-[#FAF8F5] border-b border-[#EAE4DC]">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[
        { icon: 'public', title: 'Supplier fulfilment', copy: 'Orders are arranged with each product’s supplier after purchase.' },
        { icon: 'local_shipping', title: 'Destination coverage', copy: 'Available countries and delivery rates are confirmed at checkout.' },
        { icon: 'redeem', title: 'No group-buy requirement', copy: 'Buy one item at a time. Shopify calculates the available delivery rate at checkout.' },
        { icon: 'support_agent', title: 'Order support', copy: 'Tracking availability depends on the supplier and delivery route.' },
      ].map((item) => (
        <div key={item.title} className="p-5 rounded bg-[#F3EFEA] border border-[#EAE4DC] flex items-start gap-3">
          <span className="material-symbols-outlined text-[#4d6453] text-2xl shrink-0 mt-0.5">{item.icon}</span>
          <div>
            <h4 className="text-xs font-sans font-bold text-[#321a0f]">{item.title}</h4>
            <p className="text-xs font-sans text-[#504440] mt-1 leading-relaxed">{item.copy}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
