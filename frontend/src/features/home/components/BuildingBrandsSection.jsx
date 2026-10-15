import { CheckCircle2 } from 'lucide-react';
import Reveal from '../../../components/ui/Reveal.jsx';
import { SectionContainer, Badge } from '../../../components/ui/Primitives.jsx';

const SECTION_02_IMAGE = '/home_session_02.png';

export const BuildingBrandsSection = () => {
  return (
    <Reveal direction="right" className="block w-full">
      <SectionContainer id="building-brands" className="relative bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.10),_transparent_35%),linear-gradient(135deg,_#2b0d05_0%,_#1d0703_100%)] px-6 py-20 text-white md:px-10 md:py-28 lg:px-12 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/[0.08] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/[0.05] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="section-shell relative">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="order-2 flex flex-col lg:order-1">
              <Badge darkMode>Section 02</Badge>
              <h2 className="mt-8 text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white md:text-5xl lg:text-[3.5rem] font-display">
                We build brands that create clarity, direction and growth.
              </h2>
              
              <div className="mt-10 space-y-6 leading-relaxed text-white/80">
                <p className="text-lg">
                  A brand is more than a logo. It's how people understand your business. 
                  It's why customers trust you. It's why they remember you. And it's why they choose you.
                </p>
              </div>

              <div className="mt-12 space-y-6">
                <p className="text-2xl font-medium leading-[1.2] text-white/95">
                  When people clearly understand your value, every part of your business becomes stronger.
                </p>
                <div className="space-y-5 pt-4">
                  {[
                    'Marketing becomes more effective.',
                    'Sales become easier.',
                    'Growth becomes more sustainable.',
                  ].map((text, i) => (
                    <div key={i} className="group flex items-start gap-4 transition-all duration-300 hover:translate-x-2">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/25 transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/15 group-hover:scale-110">
                        <CheckCircle2 size={14} className="text-white/70 transition-all duration-300 group-hover:text-white/90" />
                      </div>
                      <p className={`leading-relaxed transition-colors duration-300 ${i === 0 ? 'text-white/80 group-hover:text-white/90' : 'text-lg font-medium text-white group-hover:text-white/90'}`}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-[#f4e7d8] ring-1 ring-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#1a0603]/45 via-transparent to-[#ffffff]/20"></div>
                  <img
                    src={SECTION_02_IMAGE}
                    alt="Brand clarity"
                    className="relative z-0 h-full w-full object-cover opacity-100 brightness-[0.95] saturate-110 transition-all duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-white/[0.15] rounded-2xl transition-all duration-500 group-hover:border-white/[0.25] group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                {['Clarity', 'Direction', 'Growth'].map((label) => (
                  <div 
                    key={label} 
                    className="group rounded-2xl border border-white/[0.15] bg-white/[0.10] p-4 text-center transition-all duration-500 hover:bg-white/[0.15] hover:border-white/[0.25] hover:scale-105 cursor-default"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70 transition-colors duration-300 group-hover:text-white/90">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </Reveal>
  );
};
