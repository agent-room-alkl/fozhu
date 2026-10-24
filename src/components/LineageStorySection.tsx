import React from 'react';

export const LineageStorySection: React.FC = () => {
  return (
    <section className="py-16 bg-[#F3EFEA] border-b border-[#EAE4DC]" id="blessing-ritual">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-sans text-[#4d6453] uppercase tracking-widest block font-semibold">
              Lineage &amp; Authenticity
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#321a0f] leading-snug">
              Why Real Consecrated Beads Feel Different.
            </h2>
            <div className="space-y-4 text-sm font-sans text-[#3A3835] leading-relaxed">
              <p>
                Unlike mass-produced tourist replicas found on generic marketplaces, each Fozhu NZ mala begins in sustainable sacred forest sanctuaries where woods are harvested only from naturally fallen aged trees.
              </p>
              <p>
                Before entering their protective wooden paulownia transit cases, the beads are cleansed with incense and consecrated under traditional temple chanting ceremonies, binding positive intention to every grain.
              </p>
            </div>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#4d6453] text-xl mt-0.5">verified</span>
                <div>
                  <h4 className="text-xs font-sans font-bold text-[#321a0f]">
                    Certificate of Natural Patina
                  </h4>
                  <p className="text-xs font-sans text-[#504440]">
                    Guaranteed zero chemical dyes, perfumes, or synthetic resins.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#4d6453] text-xl mt-0.5">
                  spatial_audio
                </span>
                <div>
                  <h4 className="text-xs font-sans font-bold text-[#321a0f]">
                    Temple Chanting &amp; Sound Cleansing
                  </h4>
                  <p className="text-xs font-sans text-[#504440]">
                    Cleansed with Tibetan singing bowls and Sandalwood mantra smoke.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Grid / Visual Story */}
          <div className="lg:col-span-7 grid grid-cols-2 items-start gap-4">
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden aura-shadow bg-[#f2ede9] aspect-[3/4] border border-[#EAE4DC]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmYZvGBPI37BNc7eaePJRe37Rc8KNX4e_jFHFUrqiEPWzSnwJC5W3MopDOUk_ClXF57YrDamp_vCeQ1PNzJAWFEHAzit5WJPoB0oghb6L3bFD5iUlfCr3WqTFWN36HEu7LrO-LTMmMpiXbSJWQp5mXUtmK8S7IOr-ALodkZwVao0JWpjbUjiwKANKuikQLQGbRt-J63VcKALQ4ExOEjZJrs6DaKkE8Z2Qcpyq3Xy2xVFyqYw7LqWhpgQ"
                  alt="Monastery master artisan quietly carving sacred aged wood beads by hand at a weathered timber workbench in morning mist"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-[#FAF8F5] rounded border border-[#EAE4DC] text-center">
                <span className="font-serif text-xl font-bold text-[#321a0f] block">108</span>
                <span className="text-xs font-sans text-[#82746f]">Ancient Beads of Release</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#FAF8F5] rounded border border-[#EAE4DC] text-center">
                <span className="font-serif text-xl font-bold text-[#4d6453] block">100%</span>
                <span className="text-xs font-sans text-[#82746f]">Sustainable Wild Harvest</span>
              </div>
              <div className="rounded-lg overflow-hidden aura-shadow bg-[#f2ede9] aspect-[3/4] border border-[#EAE4DC]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuW3e3XnV3icTiY2p92tiPk6aGYVwqpq6H3SGacdCAWfWiL_K0k55sMi7ntBldq6Slqsk4PCNsmYw7Dj59E6LKDZlkWIcCr8FurejLjATwKkA9DMXjxYHBFo3I7VHPzdNljPFdj03DxbybdZFeoP8WGhUeJKZmYczrJ305sa86HkuM5wqUGQGSy5X7hn7j8uzboZ3_UQnakmU4rgKRYgDTdnBFsyYcKAs3romO2vHHCitl2_8APRRqwA"
                  alt="Temple master consecration wax seal stamped on fibrous handmade rice paper accompanied by consecrated red string and bead bracelets"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
