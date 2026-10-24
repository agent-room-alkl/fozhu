import React from 'react';

interface NewsletterSectionProps { onPlayAudioGuide: () => void }

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onPlayAudioGuide }) => (
  <section className="py-14 bg-[#F3EFEA] border-b border-[#EAE4DC]">
    <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
      <span className="text-xs font-sans text-[#4d6453] uppercase tracking-widest block font-semibold">A quiet moment</span>
      <h2 className="text-2xl sm:text-3xl font-serif text-[#321a0f]">Listen to the bead-counting guide</h2>
      <p className="text-sm font-sans text-[#504440] leading-relaxed max-w-xl mx-auto">A simple audio guide for a personal pause. It is offered for listening and reflection, not as a therapeutic or spiritual treatment.</p>
      <button type="button" onClick={onPlayAudioGuide} className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#321a0f] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2C1B14]"><span className="material-symbols-outlined text-sm">play_circle</span>Play the audio guide</button>
    </div>
  </section>
);
