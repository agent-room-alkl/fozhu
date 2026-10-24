import React from 'react';
import { TIKTOK_STORIES } from '../data/malas';
import { singingBowl } from '../utils/audio';

interface TikTokViralSectionProps {
  onQuickView: (productId: string) => void;
  onPlaySoundGuide: () => void;
}

export const TikTokViralSection: React.FC<TikTokViralSectionProps> = ({
  onQuickView,
  onPlaySoundGuide,
}) => {
  if (!TIKTOK_STORIES.length) return null;

  return (
    <section className="py-12 bg-[#FAF8F5] border-b border-[#EAE4DC]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-sans text-[#4d6453] uppercase tracking-widest mb-1 font-semibold">
              <span className="material-symbols-outlined text-sm">play_circle</span>
              <span>Emotional Community Testimonials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#321a0f]">
              TikTok Loved: Moments of Calm
            </h2>
          </div>
          <p className="text-sm font-sans text-[#504440] max-w-md">
            Over 3.4M views across TikTok. Real people in Auckland, Sydney, and California finding quiet within chaotic days.
          </p>
        </div>

        {/* 3 Bento Video Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIKTOK_STORIES.map((story) => (
            <div
              key={story.id}
              className="bg-[#F3EFEA] rounded-lg border border-[#EAE4DC] p-4 flex flex-col justify-between hover:border-[#82746f] transition-all aura-shadow group"
            >
              <div className="relative rounded overflow-hidden aspect-[9/10] bg-[#f2ede9] mb-3">
                <img
                  src={story.image}
                  alt={`Practitioner moment: ${story.handle}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to local image if any
                    (e.target as HTMLImageElement).src = '/assets/aistudio/Image_1_514981cf.jpeg';
                  }}
                />

                {/* TikTok Badge Overlay */}
                <div className="absolute top-3 left-3 bg-[#2C1B14]/85 backdrop-blur text-[#FAF8F5] text-[11px] font-sans px-2.5 py-1 rounded flex items-center gap-1.5 shadow">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>{story.handle}</span>
                </div>

                <button
                  onClick={() => {
                    singingBowl.strike(432, 4);
                    onPlaySoundGuide();
                  }}
                  className="absolute bottom-3 right-3 bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-[#321a0f] px-2.5 py-1 rounded text-[11px] font-sans font-medium flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  title="Click to hear original temple singing bowl frequency"
                >
                  <span className="material-symbols-outlined text-xs text-[#E1BD7E]">volume_up</span>
                  <span>{story.sound}</span>
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-sans text-[#3A3835] italic leading-relaxed">
                  {story.quote}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#EAE4DC]">
                  <div>
                    <span className="text-[10px] font-sans text-[#82746f] block uppercase tracking-wider">
                      Featured Bead
                    </span>
                    <span className="text-xs font-sans font-semibold text-[#321a0f]">
                      {story.featuredBead}
                    </span>
                  </div>
                  <button
                    onClick={() => onQuickView(story.productId)}
                    className="px-3 py-1.5 rounded bg-[#ece7e4] hover:bg-[#321a0f] hover:text-[#FAF8F5] text-[#321a0f] text-xs font-sans transition-colors cursor-pointer font-medium"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
