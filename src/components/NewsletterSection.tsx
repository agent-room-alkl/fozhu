import React, { useState } from 'react';
import { singingBowl } from '../utils/audio';

interface NewsletterSectionProps {
  onPlayAudioGuide: () => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onPlayAudioGuide }) => {
  const [email, setEmail] = useState('');
  const [claimed, setClaimed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setClaimed(true);
      singingBowl.strike(528, 4);
    }
  };

  return (
    <section className="py-14 bg-[#F3EFEA] border-b border-[#EAE4DC]">
      <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs font-sans text-[#4d6453] uppercase tracking-widest block font-semibold">
          Join the Quiet Mind Sangha
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif text-[#321a0f]">
          Receive $15 Off Your First Sacred Mala
        </h3>
        <p className="text-sm font-sans text-[#504440] leading-relaxed max-w-xl mx-auto">
          Plus receive our complimentary 15-minute Tibetan Singing Bowl &amp; Mala Counting Audio Guide directly to your inbox.
        </p>

        {claimed ? (
          <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#cfe9d4] max-w-md mx-auto space-y-2 text-center aura-shadow">
            <span className="material-symbols-outlined text-2xl text-[#4d6453]">check_circle</span>
            <p className="text-xs font-sans font-semibold text-[#321a0f]">
              Welcome to the Sangha! Use code <strong className="text-[#E1BD7E] tracking-wider">SANGHA15</strong> at checkout for $15 off.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onPlayAudioGuide}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#321a0f] text-[#FAF8F5] text-xs font-sans hover:bg-[#2C1B14] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#E1BD7E]">play_circle</span>
                <span>Listen to 15-Min Singing Bowl Guide Now</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="bg-[#FAF8F5] border border-[#EAE4DC] px-4 py-3 rounded text-sm font-sans focus:outline-none focus:border-[#321a0f] flex-1 placeholder:text-[#82746f]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded bg-[#321a0f] text-[#FAF8F5] font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#2C1B14] transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              Claim Gift
            </button>
          </form>
        )}

        <span className="text-[11px] text-[#82746f] block">
          We honour silence: no spam, unsubscribe at any moment.
        </span>
      </div>
    </section>
  );
};
