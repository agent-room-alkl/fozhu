import React from 'react';
import { SoulIntention } from '../types';

interface IntentionSelectorProps {
  selectedIntention: SoulIntention;
  onSelectIntention: (intention: SoulIntention) => void;
}

export const IntentionSelector: React.FC<IntentionSelectorProps> = ({
  selectedIntention,
  onSelectIntention,
}) => {
  const intentions: {
    id: SoulIntention;
    label: string;
    icon: string;
  }[] = [
    {
      id: 'stress',
      label: 'Calm & Reflection',
      icon: 'self_improvement',
    },
    {
      id: 'focus',
      label: 'Focus & Meditation',
      icon: 'center_focus_strong',
    },
    {
      id: 'abundance',
      label: 'Growth & Possibility',
      icon: 'monetization_on',
    },
    {
      id: 'protection',
      label: 'Grounding & Travel',
      icon: 'shield',
    },
  ];

  return (
    <section className="py-12 bg-[#F3EFEA] border-b border-[#EAE4DC]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
        <span className="text-xs font-sans text-[#4d6453] uppercase tracking-widest block mb-2 font-semibold">
          Five Elements · Personal Reflection
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#321a0f] mb-3">
          What meaning would you like to explore today?
        </h2>
        <p className="text-sm font-sans text-[#504440] max-w-lg mx-auto mb-8 leading-relaxed">
          Browse symbolic associations from Chinese Five Elements traditions. Choose a theme for personal reflection; these are not promises of an outcome.
        </p>

        {/* Intention Pills */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          <button
            onClick={() => onSelectIntention(selectedIntention === 'all' ? 'stress' : 'all')}
            className={`px-4 py-2.5 rounded-full text-xs font-sans transition-all flex items-center gap-2 cursor-pointer ${
              selectedIntention === 'all'
                ? 'border-2 border-[#321a0f] bg-[#321a0f] text-[#FAF8F5] shadow-sm font-semibold'
                : 'border border-[#d4c3bd] bg-[#FAF8F5] text-[#3A3835] hover:border-[#321a0f]'
            }`}
          >
            <span className="material-symbols-outlined text-[#E1BD7E] text-base">spa</span>
            <span>All Intentions</span>
          </button>

          {intentions.map((item) => {
            const isSelected = selectedIntention === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectIntention(item.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-sans transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#321a0f] bg-[#321a0f] text-[#FAF8F5] shadow-sm font-semibold'
                    : 'border border-[#d4c3bd] bg-[#FAF8F5] text-[#3A3835] hover:border-[#321a0f]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-base ${
                    isSelected ? 'text-[#E1BD7E]' : 'text-[#4d6453]'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
