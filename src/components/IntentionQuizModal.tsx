import React, { useState } from 'react';
import { MALA_PRODUCTS } from '../data/malas';
import { MalaProduct } from '../types';
import { singingBowl } from '../utils/audio';

interface IntentionQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: MalaProduct, size: string, config?: string) => void;
}

export const IntentionQuizModal: React.FC<IntentionQuizModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
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
      const match = MALA_PRODUCTS.find((product) => product.category === category) || MALA_PRODUCTS[0];
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
              <span className="font-semibold text-[#4d6453]">SOUL WOOD INTUITION</span>
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
              Step 01 • Stress Pattern
            </span>
            <h3 className="text-xl font-serif text-[#321a0f]">
              Where does modern noise or tension weigh on you the most?
            </h3>
            <p className="text-xs font-sans text-[#504440]">
              Beads serve as visceral anchors to interrupt cognitive feedback loops.
            </p>
            <div className="space-y-2.5 pt-2">
              {[
                { id: 'racing_thoughts', label: 'Overthinking & racing mind before rest or meetings' },
                { id: 'screen_fatigue', label: 'Sensory overload from endless digital screens and emails' },
                { id: 'emotional_heaviness', label: 'Emotional weariness and feeling ungrounded in chaotic transit' },
                { id: 'focus_drift', label: 'Difficulty staying centered in deep meditation or creative flow' },
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
              Which tactile sensation instinctively soothes your central nervous system?
            </h3>
            <div className="space-y-2.5 pt-2">
              {[
                {
                  id: 'sacred_seeds',
                  label: 'Textured natural seeds with deep ridges that stimulate palm acupressure points',
                },
                {
                  id: 'aromatic_wood',
                  label: 'Naturally aged resinous timber emitting a mellow, warm honey-woody fragrance',
                },
                {
                  id: 'cool_stone',
                  label: 'Pure mineral jade gemstone that feels soothingly cool against the skin',
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
              What spiritual intention do you wish to invite into your upcoming days?
            </h3>
            <div className="space-y-2.5 pt-2">
              {[
                { id: 'stress', label: 'Emotional equanimity, relief from anxiety & peaceful sleep' },
                { id: 'focus', label: 'Unshakable meditation focus, breath awareness & spiritual grounding' },
                { id: 'abundance', label: 'Harmonious relationships, career prosperity & clear heart meridian' },
                { id: 'protection', label: 'Safe travels across borders & sanctuary against negative energy' },
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
              How do you envision communing with your consecrated mala?
            </h3>
            <div className="space-y-2.5 pt-2">
              {[
                { id: 'wrist_daily', label: 'Worn constantly on my wrist as a silent companion at work & home' },
                { id: '108_necklace', label: 'Full 108 rosary for mindful counting, mantra breathwork & altar' },
                { id: 'pocket_touch', label: 'Carried in pocket or bag to roll between fingers in quiet pause' },
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
              <span>Intuitive Resonance Match</span>
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
                Your Soul Wood
              </span>
              <h3 className="text-2xl font-serif text-[#321a0f] font-medium">
                {resultProduct.name}
              </h3>
              <p className="font-serif text-xs text-[#E1BD7E] mt-0.5 tracking-wider font-semibold">
                {resultProduct.sku}
              </p>
            </div>

            {/* Personalized Mantra Box */}
            <div className="p-4 rounded-lg bg-[#F3EFEA] border border-[#EAE4DC] text-left space-y-1.5">
              <span className="text-[10px] font-sans text-[#4d6453] uppercase tracking-widest font-bold block">
                Your Personalized Sacred Mantra
              </span>
              <p className="font-serif text-base text-[#321a0f] italic">
                {resultProduct.intention === 'stress'
                  ? 'Om Mani Padme Hum — May your mind be freed from fear, finding tranquil stillness.'
                  : resultProduct.intention === 'abundance'
                  ? 'Gate Gate Paragate Parasamgate Bodhi Svaha — Heart clarity & auspicious harmony.'
                  : 'Om Tare Tuttare Ture Soha — Unshakable grounding, swift wisdom & spiritual peace.'}
              </p>
              <p className="text-[11px] font-sans text-[#82746f] pt-1 border-t border-[#EAE4DC]">Supplier fulfilment · Shipping coverage and rates are confirmed at checkout</p>
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
