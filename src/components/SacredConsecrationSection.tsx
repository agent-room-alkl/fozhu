import React from 'react';

interface SacredConsecrationSectionProps {
  onExploreMalas: () => void;
  onOpenSoundGuide: () => void;
}

export const SacredConsecrationSection: React.FC<SacredConsecrationSectionProps> = ({ onExploreMalas, onOpenSoundGuide }) => (
  <section className="py-16 lg:py-20 bg-[#FAF8F5] border-b border-[#EAE4DC] relative overflow-hidden" id="five-elements-culture">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F3EFEA] border border-[#EAE4DC]"><span className="material-symbols-outlined text-[#E1BD7E] text-base">spa</span><span className="text-[11px] font-sans tracking-widest text-[#4d6453] uppercase font-semibold">Chinese Five Elements · Cultural Heritage</span></div>
        <h2 className="text-3xl lg:text-4xl font-serif text-[#321a0f] leading-tight">A traditional framework for reflection and personal style.</h2>
        <p className="text-sm font-sans text-[#504440] max-w-2xl mx-auto leading-relaxed">五行 (Five Elements) and 八字 (BaZi) are part of a long Chinese intellectual and cultural tradition. We explain their symbolism as a reference for reflection and choosing colours or materials. Schools and interpretations differ; these ideas are not scientific guarantees or promises of luck, protection, health or financial results.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
        <div className="rounded-lg overflow-hidden bg-[#f2ede9] border border-[#EAE4DC] min-h-72"><img src="/assets/aistudio/Image_7_24558ae0.jpeg" alt="A quiet still life illustrating traditional Five Elements symbolism" className="w-full h-full object-cover" /></div>
        <div className="flex flex-col justify-center gap-5">
          <div className="rounded-lg bg-[#F3EFEA] border border-[#EAE4DC] p-6"><p className="text-xs uppercase tracking-widest font-semibold text-[#4d6453]">How Fozhu uses the tradition</p><h3 className="mt-2 font-serif text-2xl text-[#321a0f]">Symbolism, explained with care</h3><p className="mt-3 text-sm leading-7 text-[#504440]">The Five Elements describe relationships among Wood (木), Fire (火), Earth (土), Metal (金) and Water (水) in traditional Chinese thought. A BaZi chart is interpreted within a particular school and depends on accurate birth details. Our reading offers one contemporary interpretation for reflection; it is not a fixed prediction.</p></div>
          <div className="flex flex-wrap gap-3"><button onClick={onExploreMalas} className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#321a0f] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2C1B14]">Explore bead collection <span className="material-symbols-outlined text-sm">arrow_forward</span></button><button onClick={onOpenSoundGuide} className="inline-flex items-center gap-2 px-5 py-3 rounded border border-[#d4c3bd] bg-[#FAF8F5] text-[#3A3835] text-xs font-medium hover:border-[#321a0f]"><span className="material-symbols-outlined text-[#4d6453] text-base">graphic_eq</span>Listen to the sound guide</button></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          ['01', 'A cultural lens', 'Five Elements and BaZi have a long history in Chinese philosophy and practice; interpretations vary.'],
          ['02', 'Product details', 'Material, bead count and size are listed by product. Supplier-provided details can vary by item.'],
          ['03', 'Your own meaning', 'Choose a piece for its appearance, material and the meaning you personally associate with it.'],
          ['04', 'No promised outcomes', 'Suggestions are for cultural reflection and styling, not a guarantee of luck, health, protection or success.'],
        ].map(([number, title, copy]) => <article key={number} className="p-5 rounded-lg bg-[#F3EFEA] border border-[#EAE4DC]"><p className="text-[11px] text-[#4d6453] font-bold tracking-widest">{number}</p><h3 className="mt-3 text-sm font-bold text-[#321a0f]">{title}</h3><p className="mt-2 text-xs leading-relaxed text-[#504440]">{copy}</p></article>)}
      </div>
    </div>
  </section>
);
