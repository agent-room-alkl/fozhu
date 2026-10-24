import React, { useState } from 'react';
import { MalaProduct } from '../types';
import { singingBowl } from '../utils/audio';

interface IntentionQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: MalaProduct, size: string, config?: string) => void;
  products: MalaProduct[];
}

export const IntentionQuizModal: React.FC<IntentionQuizModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  products,
}) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<{
    stressPattern?: string;
    sensoryTouch?: string;
    chapterGoal?: string;
    styleFormat?: string;
  }>({});
  const [resultProduct, setResultProduct] = useState<MalaProduct | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (key: string, value: string) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    singingBowl.strike(528, 2.5);

    if (step < 4) {
      setStep(step + 1);
    } else {
      // Calculate match
      const category = updated.sensoryTouch === 'cool_stone' || updated.chapterGoal === 'abundance'
        ? 'Natural Stone & Gemstone Bracelets'
        : updated.sensoryTouch === 'aromatic_wood' || updated.chapterGoal === 'focus' || updated.styleFormat === '108_necklace'
          ? 'Wood Prayer Beads'
          : 'Bodhi Seed & Natural Seed Beads';
      const match = products.find((product) => product.category === category) || products[0];
      setResultProduct(match);
      setStep(5); // Result step
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({});
    setResultProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl max-w-lg w-full p-6 sm:p-8 aura-shadow overflow-hidden text-[#3A3835]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#82746f] hover:text-[#321a0f] p-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Step indicator */}
        {step <= 4 && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-sans text-[#82746f]">
              <span className="font-semibold text-[#4d6453]">PERSONAL STYLE GUIDE</span>
              <span>Question {step} of 4</span>
            </div>
            <div className="w-full bg-[#EAE4DC] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#E1BD7E] h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Question 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <span className="text-[11px] font-sans text-[#4d6453] uppercase tracking-widest font-semibold block">
              Step 01 • Everyday style
            </span>
            <h3 className="text-xl font-serif text-[#321a0f]">
              Which kind of moment are you choosing a piece for?
            </h3>
            <p className="text-xs font-sans text-[#504440]">
              Think about how you would like to wear or use it.
            </p>
            <div className="space-y-2.5 pt-2">
              {[
                { id: 'racing_thoughts', label: 'A small reminder in a busy day' },
                { id: 'screen_fatigue', label: 'A piece for work or study' },
                { id: 'emotional_heaviness', label: 'Something meaningful for travel' },
                { id: 'focus_drift', label: 'A piece for quiet reflection' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption('stressPattern', opt.id)}
                  className="w-full text-left p-3.5 rounded-lg border border-[#EAE4DC] bg-[#F3EFEA] hover:bg-[#ece7e4] hover:border-[#321a0f] text-xs font-sans text-[#321a0f] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>{opt.label}</span>
                  <span className="material-symbols-outlined text-sm text-[#82746f] group-hover:text-[#321a0f]">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <span className="text-[11px] font-sans text-[#4d6453] uppercase tracking-widest font-semibold block">
              Step 02 • Sensory Alignment
            </span>
            <h3 className="text-xl font-serif text-[#321a0f]">
              Which material and feel appeal to you?
            </h3>
            <div className="space-y-2.5 pt-2">
              {[
                {
                  id: 'sacred_seeds',
                  label: 'Textured seed beads',
                },
                {
                  id: 'aromatic_wood',
                  label: 'Wood beads',
                },
                {
                  id: 'cool_stone',
                  label: 'Smooth stone beads',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption('sensoryTouch', opt.id)}
                  className="w-full text-left p-3.5 rounded-lg border border-[#EAE4DC] bg-[#F3EFEA] hover:bg-[#ece7e4] hover:border-[#321a0f] text-xs font-sans text-[#321a0f] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>{opt.label}</span>
                  <span className="material-symbols-outlined text-sm text-[#82746f] group-hover:text-[#321a0f]">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <span className="text-[11px] font-sans text-[#4d6453] uppercase tracking-widest font-semibold block">
              Step 03 • Life Intention
            </span>
            <h3 className="text-xl font-serif text-[#321a0f]">
              What symbolism or colour would you like to explore?
            </h3>
            <div className="space-y-2.5 pt-2">
              {[
                { id: 'stress', label: 'Calm colours and a simple reminder' },
                { id: 'focus', label: 'Wood and nature associations' },
                { id: 'abundance', label: 'Warm colours and growth symbolism' },
                { id: 'protection', label: 'Dark tones and grounding symbolism' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption('chapterGoal', opt.id)}
                  className="w-full text-left p-3.5 rounded-lg border border-[#EAE4DC] bg-[#F3EFEA] hover:bg-[#ece7e4] hover:border-[#321a0f] text-xs font-sans text-[#321a0f] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>{opt.label}</span>
                  <span className="material-symbols-outlined text-sm text-[#82746f] group-hover:text-[#321a0f]">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <span className="text-[11px] font-sans text-[#4d6453] uppercase tracking-widest font-semibold block">
              Step 04 • Everyday Ritual
            </span>
            <h3 className="text-xl font-serif text-[#321a0f]">
              How would you like to wear or use the piece?
            </h3>
            <div className="space-y-2.5 pt-2">
              {[
                { id: 'wrist_daily', label: 'As an everyday bracelet' },
                { id: '108_necklace', label: 'A full 108-bead mala' },
                { id: 'pocket_touch', label: 'As a necklace or something to carry' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption('styleFormat', opt.id)}
                  className="w-full text-left p-3.5 rounded-lg border border-[#EAE4DC] bg-[#F3EFEA] hover:bg-[#ece7e4] hover:border-[#321a0f] text-xs font-sans text-[#321a0f] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>{opt.label}</span>
                  <span className="material-symbols-outlined text-sm text-[#82746f] group-hover:text-[#321a0f]">
                    auto_awesome
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Result Match & Personal Mantra */}
        {step === 5 && resultProduct && (
          <div className="space-y-5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cfe9d4] text-[#0a2013] text-xs font-sans font-bold">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Style suggestion</span>
            </div>

            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#E1BD7E] shadow-md">
              <img
                src={resultProduct.image}
                alt={resultProduct.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = resultProduct.fallbackImage;
                }}
              />
            </div>

            <div>
              <span className="text-xs font-sans text-[#82746f] block uppercase tracking-wider">
                Suggested piece
              </span>
              <h3 className="text-2xl font-serif text-[#321a0f] font-medium">
                {resultProduct.name}
              </h3>
              <p className="font-serif text-xs text-[#E1BD7E] mt-0.5 tracking-wider font-semibold">
                {resultProduct.sku}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F3EFEA] border border-[#EAE4DC] text-left space-y-1.5">
              <p className="text-xs leading-5 text-[#504440]">Suggested from your style preferences and available catalogue. Five Elements meanings are cultural associations for reflection, not predicted or guaranteed effects.</p>
              <p className="text-[11px] font-sans text-[#82746f] pt-1 border-t border-[#EAE4DC]">One item can be ordered individually · Shopify confirms delivery at checkout.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-4 rounded border border-[#d4c3bd] hover:border-[#321a0f] text-xs font-sans font-medium text-[#504440] transition-colors cursor-pointer"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => { onAddToCart(resultProduct, resultProduct.defaultSize); onClose(); }}
                className="flex-1 py-3 px-4 rounded bg-[#321a0f] hover:bg-[#2C1B14] text-[#FAF8F5] text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Add to Bag
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
