import React from 'react';

interface IntentionQuizBannerProps {
  onOpenQuiz: () => void;
}

export const IntentionQuizBanner: React.FC<IntentionQuizBannerProps> = ({ onOpenQuiz }) => {
  return (
    <section className="py-14 bg-[#2C1B14] text-[#FAF8F5]" id="intention-quiz">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a2f23] text-[#E1BD7E] text-[11px] font-sans font-semibold">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span>Five Elements · Style Quiz</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#FAF8F5]">
          Find a piece that feels personal to you
        </h2>

        <p className="text-sm sm:text-base font-sans text-[#EAE4DC] max-w-xl mx-auto leading-relaxed">
          Answer a few questions about your preferred colours, materials and everyday style to find a piece that feels right for you.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenQuiz}
            className="px-8 py-4 rounded bg-[#E1BD7E] text-[#2C1B14] font-sans text-xs tracking-wider uppercase font-bold hover:bg-[#FAF8F5] transition-colors duration-200 aura-shadow inline-flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
          >
            <span>Take the 60-Second Style Quiz</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        <p className="text-xs font-sans text-[#bd9686]">
          No sign-up required • Instant product suggestions
        </p>
      </div>
    </section>
  );
};
