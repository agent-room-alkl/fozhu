import React from 'react';

export const LineageStorySection: React.FC = () => (
  <section className="py-16 bg-[#F3EFEA] border-b border-[#EAE4DC]" id="blessing-ritual">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-5 space-y-5">
        <span className="text-xs font-sans text-[#4d6453] uppercase tracking-widest block font-semibold">Materials &amp; product information</span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#321a0f] leading-snug">Clear details, without claims we cannot verify.</h2>
        <p className="text-sm text-[#3A3835] leading-7">Product pages show the available photos, listed bead count, options and supplier-provided material descriptions. Natural materials can vary in colour and texture. Exact species, treatment, origin and certifications are stated only when verified for that product.</p>
        <p className="text-sm text-[#3A3835] leading-7">We do not claim temple consecration, chanting, certification, sustainability credentials or chemical-free materials unless product-specific evidence is available.</p>
      </div>
      <div className="lg:col-span-7 grid grid-cols-2 gap-4 items-center">
        <img src="/assets/aistudio/Image_1_514981cf.jpeg" alt="Beads and natural materials arranged for product photography" className="w-full aspect-[4/5] object-cover rounded-lg border border-[#EAE4DC]" />
        <div className="space-y-4"><div className="rounded-lg border border-[#EAE4DC] bg-[#FAF8F5] p-5"><p className="font-serif text-2xl text-[#321a0f]">Details by item</p><p className="mt-2 text-xs leading-5 text-[#625650]">Check each product page for its specific materials, bead size, count and available options.</p></div><img src="/assets/aistudio/Image_2_1813fd33.jpeg" alt="A close view of bead colours and surface texture" className="w-full aspect-[4/5] object-cover rounded-lg border border-[#EAE4DC]" /></div>
      </div>
    </div>
  </section>
);
