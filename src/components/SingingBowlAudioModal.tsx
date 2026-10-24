import React, { useState } from 'react';
import { singingBowl } from '../utils/audio';

interface SingingBowlAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SingingBowlAudioModal: React.FC<SingingBowlAudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFreq, setSelectedFreq] = useState<number>(432);
  const [isContinuous, setIsContinuous] = useState<boolean>(false);
  const [lastStrikeTime, setLastStrikeTime] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleStrike = (freq: number) => {
    setSelectedFreq(freq);
    singingBowl.strike(freq, 6);
    setLastStrikeTime(Date.now());
  };

  const handleToggleContinuous = () => {
    singingBowl.toggleChantTone((active) => {
      setIsContinuous(active);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-[#3A3835]">
      <div className="relative bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl max-w-md w-full p-6 sm:p-8 aura-shadow text-center space-y-6">
        {/* Close Button */}
        <button
          onClick={() => {
            if (isContinuous) {
              singingBowl.toggleChantTone();
              setIsContinuous(false);
            }
            onClose();
          }}
          className="absolute top-4 right-4 text-[#82746f] hover:text-[#321a0f] p-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cfe9d4] text-[#0a2013] text-[11px] font-sans font-bold">
            <span className="material-symbols-outlined text-sm">spatial_audio</span>
            <span>Acoustic Frequency Sanctuary</span>
          </div>
          <h2 className="text-2xl font-serif text-[#321a0f]">
            Tibetan Singing Bowl
          </h2>
          <p className="text-xs font-sans text-[#504440] max-w-xs mx-auto">
            Traditional hand-hammered 7-metal acoustic resonance tuned to natural harmonic overtones.
          </p>
        </div>

        {/* Visual Animated Bowl */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full border border-[#E1BD7E]/50 transition-all duration-700 ${
              isContinuous || (lastStrikeTime && Date.now() - lastStrikeTime < 4000)
                ? 'scale-125 opacity-40 bg-[#E1BD7E]/10 animate-ping'
                : 'scale-100 opacity-20'
            }`}
          ></div>
          <button
            type="button"
            onClick={() => handleStrike(selectedFreq)}
            className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-[#E1BD7E] to-[#4a2f23] text-[#FAF8F5] flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">
              spa
            </span>
            <span className="text-[10px] font-sans uppercase font-bold tracking-wider mt-1 text-[#FAF8F5]">
              Tap to Strike
            </span>
          </button>
        </div>

        {/* Frequency Toggles */}
        <div className="space-y-2 text-xs font-sans">
          <span className="text-[#82746f] block uppercase tracking-wider text-[10px] font-semibold">
            Choose Harmonic Tuning
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { freq: 432, label: '432 Hz', desc: 'Heart Center' },
              { freq: 528, label: '528 Hz', desc: 'Inner Calm' },
              { freq: 639, label: '639 Hz', desc: 'Harmony' },
            ].map((f) => (
              <button
                key={f.freq}
                type="button"
                onClick={() => handleStrike(f.freq)}
                className={`p-2 rounded border transition-all cursor-pointer ${
                  selectedFreq === f.freq
                    ? 'border-[#321a0f] bg-[#F3EFEA] text-[#321a0f] font-bold shadow-sm'
                    : 'border-[#EAE4DC] hover:border-[#82746f] text-[#504440]'
                }`}
              >
                <div className="font-serif text-sm">{f.label}</div>
                <div className="text-[9px] text-[#82746f]">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Continuous Meditation Loop */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleToggleContinuous}
            className={`w-full py-2.5 px-4 rounded text-xs font-sans font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isContinuous
                ? 'bg-[#4d6453] text-[#FAF8F5]'
                : 'border border-[#4a2f23] text-[#321a0f] hover:bg-[#F3EFEA]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isContinuous ? 'pause_circle' : 'play_circle'}
            </span>
            <span>{isContinuous ? 'Pause Meditative Resonance' : 'Continuous Breath Cycle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
