import React from 'react';

interface SacredConsecrationSectionProps {
  onExploreMalas: () => void;
  onOpenSoundGuide: () => void;
}

export const SacredConsecrationSection: React.FC<SacredConsecrationSectionProps> = ({
  onExploreMalas,
  onOpenSoundGuide,
}) => {
  return (
    <section
      className="py-16 lg:py-20 bg-[#FAF8F5] border-b border-[#EAE4DC] relative overflow-hidden"
      id="sacred-consecration-story"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Header Label & Headline */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F3EFEA] border border-[#EAE4DC] aura-shadow">
            <span className="material-symbols-outlined text-[#E1BD7E] text-base">spa</span>
            <span className="text-[11px] font-sans tracking-widest text-[#4d6453] uppercase font-semibold">
              Blessing Ritual · Wishes for Peace and Good Fortune
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-serif text-[#321a0f] leading-tight">
            Every Bead Carries a Blessing.<br className="hidden sm:inline" />
            <span className="italic font-normal text-[#2C1B14]">
              Every Mala Brings Peace &amp; Good Fortune.
            </span>
          </h2>

          <p className="text-sm font-sans text-[#504440] max-w-2xl mx-auto leading-relaxed">
            Blessing chants · Peace and protection · May good fortune be with you. Behind every Fozhu Mala lies an ancient spiritual ritual. Crafted with reverence and consecrated in centuries-old Buddhist monasteries to offer comfort, focus, and sacred protection.
          </p>
        </div>

        {/* Main Consecration Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          {/* Cinematic Kaiguang Consecration Image */}
          <div className="lg:col-span-7 relative group">
            <div className="relative rounded-lg overflow-hidden aura-shadow bg-[#f2ede9] aspect-[16/10] border border-[#EAE4DC]">
              <img
                src="/assets/aistudio/Image_7_24558ae0.jpeg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuATf8MUdiDjg5J7kEu_bn360LTCkIIRWrBKK2GXdFTbo3igFeWh1lNyVL2_DAFLh7cuIYnz1iDckC540ClL9Qj9FUgIhyResTLABBW-52tZeNoOJOa56DSKXfH0hqClTzePufOkNsq9U7JIcFOGLUjLsyBAjft7R5x2kDRoC2bRRgZu3lqYOeANkqTBECyy0vRVxIPCWML5JNslvyfBwehkREmE8nOvCAunRKSkTGEVYyp8CFPhEOPgzw';
                }}
                alt="Revered Buddhist monk in saffron robes performing authentic Kaiguang blessing ceremony over sacred prayer beads with incense smoke"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Consecration Seal Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm glass-pill p-3.5 rounded border border-[#EAE4DC] aura-shadow backdrop-blur-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2C1B14] text-[#E1BD7E] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                </div>
                <div>
                  <p className="text-xs font-sans text-[#321a0f] font-semibold">
                    Master Monastic Blessing Seal
                  </p>
                  <p className="text-[11px] font-sans text-[#82746f]">
                    Temple blessing seal • Heart Sutra recitation
                  </p>
                </div>
              </div>

              {/* Status Tag Top */}
              <div className="absolute top-4 left-4 bg-[#2C1B14]/85 backdrop-blur text-[#E1BD7E] text-[11px] font-sans px-3 py-1 rounded flex items-center gap-1.5 shadow-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#E1BD7E] animate-pulse"></span>
                <span>Authentic Temple Kaiguang Ritual</span>
              </div>
            </div>
          </div>

          {/* Elder Monk Wisdom Quote & Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F3EFEA] rounded-lg border border-[#EAE4DC] p-6 lg:p-7 aura-shadow relative">
              <span className="text-[#E1BD7E] text-4xl font-serif leading-none select-none block mb-2">
                “
              </span>
              <blockquote className="text-base sm:text-lg font-serif italic text-[#321a0f] leading-relaxed">
                When the bead touches your wrist, peace enters your heart. It is not just jewelry, but a faithful companion walking with you through turbulent days.
              </blockquote>
              <div className="mt-4 pt-4 border-t border-[#EAE4DC] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-sans font-bold text-[#321a0f]">
                    Elder Monastic Master
                  </h4>
                  <p className="text-[11px] font-sans text-[#82746f]">
                    Tibetan Himalayan Sangha &amp; Consecration Lineage
                  </p>
                </div>
                <span className="text-xs font-serif text-[#E1BD7E] font-semibold tracking-wider">
                  Compassionate Blessing
                </span>
              </div>
            </div>

            <p className="text-sm font-sans text-[#504440] leading-relaxed">
              Before traveling across the oceans to New Zealand, Australia, and North America, every prayer bead strand undergoes deep meditative sound cleansing and mantra recitation to quiet worldly turbulence.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreMalas}
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#321a0f] text-[#FAF8F5] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#2C1B14] transition-all duration-200 aura-shadow group cursor-pointer shadow-sm active:scale-95"
              >
                <span>Explore Consecrated Malas</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={onOpenSoundGuide}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded border border-[#d4c3bd] bg-[#FAF8F5] text-[#3A3835] text-xs font-sans hover:border-[#321a0f] transition-all cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[#4d6453] text-base">
                  menu_book
                </span>
                <span>Read Blessing &amp; Ritual Guide</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Step Sacred Journey Ritual Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-5 rounded-lg bg-[#F3EFEA] border border-[#EAE4DC] hover:border-[#82746f] transition-all aura-shadow flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-[#321a0f] text-[#E1BD7E] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">nature_people</span>
                </div>
                <span className="text-[11px] font-sans text-[#4d6453] font-bold tracking-widest">
                  STEP 01
                </span>
              </div>
              <h3 className="text-xs font-sans text-[#321a0f] font-bold mb-1">
                The Sacred Intention
              </h3>
              <span className="text-[11px] font-sans text-[#E1BD7E] block mb-2 font-medium">
                A Clear Intention · Made with Reverence
              </span>
              <p className="text-xs font-sans text-[#504440] leading-relaxed">
                Handcrafted from sustainably gathered naturally fallen aged woods and wild bodhi seeds, shaped with patient mindfulness and devotion.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE4DC] flex items-center gap-1.5 text-[11px] text-[#82746f]">
              <span className="material-symbols-outlined text-sm text-[#4d6453]">eco</span>
              <span>Pure Untreated Grains</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-lg bg-[#F3EFEA] border border-[#EAE4DC] hover:border-[#82746f] transition-all aura-shadow flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-[#321a0f] text-[#E1BD7E] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">record_voice_over</span>
                </div>
                <span className="text-[11px] font-sans text-[#4d6453] font-bold tracking-widest">
                  STEP 02
                </span>
              </div>
              <h3 className="text-xs font-sans text-[#321a0f] font-bold mb-1">
                Temple Chanting &amp; Kaiguang
              </h3>
              <span className="text-[11px] font-sans text-[#E1BD7E] block mb-2 font-medium">
                Temple Blessing · Sutra Recitation
              </span>
              <p className="text-xs font-sans text-[#504440] leading-relaxed">
                Revered monastic elders recite the Heart Sutra and Great Compassion Mantra over the malas, infusing them with protective spiritual resonance.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE4DC] flex items-center gap-1.5 text-[11px] text-[#82746f]">
              <span className="material-symbols-outlined text-sm text-[#4d6453]">verified</span>
              <span>Consecrated Lineage</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-lg bg-[#F3EFEA] border border-[#EAE4DC] hover:border-[#82746f] transition-all aura-shadow flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-[#321a0f] text-[#E1BD7E] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">temple_buddhist</span>
                </div>
                <span className="text-[11px] font-sans text-[#4d6453] font-bold tracking-widest">
                  STEP 03
                </span>
              </div>
              <h3 className="text-xs font-sans text-[#321a0f] font-bold mb-1">
                Incense &amp; Sound Cleansing
              </h3>
              <span className="text-[11px] font-sans text-[#E1BD7E] block mb-2 font-medium">
                Incense Ritual · Singing Bowl Resonance
              </span>
              <p className="text-xs font-sans text-[#504440] leading-relaxed">
                Purified in swirling smoke of authentic wild sandalwood and aged agarwood, tuned with handcrafted Tibetan singing bowls to reset tactile frequency.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE4DC] flex items-center gap-1.5 text-[11px] text-[#82746f]">
              <span className="material-symbols-outlined text-sm text-[#4d6453]">air</span>
              <span>Natural Smoke Cleansed</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-lg bg-[#F3EFEA] border border-[#EAE4DC] hover:border-[#82746f] transition-all aura-shadow flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded bg-[#321a0f] text-[#E1BD7E] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                </div>
                <span className="text-[11px] font-sans text-[#4d6453] font-bold tracking-widest">
                  STEP 04
                </span>
              </div>
              <h3 className="text-xs font-sans text-[#321a0f] font-bold mb-1">
                Good Fortune &amp; Safe Haven
              </h3>
              <span className="text-[11px] font-sans text-[#E1BD7E] block mb-2 font-medium">
                Daily Reminder · Peace and Wisdom
              </span>
              <p className="text-xs font-sans text-[#504440] leading-relaxed">
                Becomes your quiet anchor against daily anxiety, bringing tranquility, good luck, and mindful grounding across your journeys.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE4DC] flex items-center gap-1.5 text-[11px] text-[#82746f]">
              <span className="material-symbols-outlined text-sm text-[#4d6453]">spa</span>
              <span>Peaceful Life Companion</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
