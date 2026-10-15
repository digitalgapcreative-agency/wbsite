import { Shield, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import Reveal from '../../../components/ui/Reveal.jsx';
import { SectionContainer, Badge } from '../../../components/ui/Primitives.jsx';
import { homeContent } from '../homeContent.js';

const ICONS = [Shield, Sparkles, TrendingUp];

export const ClaritySection = () => {
  return (
    <Reveal direction="left" className="block w-full">
      <SectionContainer id="clarity" className="relative bg-white px-6 py-20 text-center md:px-10 md:py-28 lg:px-12 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#250601] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#250601] rounded-full blur-3xl"></div>
        </div>

        <div className="section-shell relative">
          <Badge>Section 05</Badge>
          <h2 className="mx-auto mt-8 max-w-4xl text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-[#250601] md:text-5xl lg:text-[3.5rem] font-display">
            Why clarity changes everything.
          </h2>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            {homeContent.clarityPoints.map(({ cond, result }, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div
                  key={cond}
                  className="group relative rounded-[2rem] border border-[#C4C2B9]/15 bg-white p-10 shadow-[0_20px_40px_rgba(37,6,1,0.06)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(37,6,1,0.12)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#250601]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {i < 2 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight size={24} className="text-[#C4C2B9]/30 group-hover:text-[#250601]/20 transition-colors duration-500" />
                    </div>
                  )}

                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#250601]/5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#250601]/10 group-hover:shadow-xl">
                      <Icon size={32} className="text-[#250601]/40 transition-colors duration-500 group-hover:text-[#250601]/60" />
                    </div>
                    <p className="mb-3 text-sm leading-relaxed text-[#250601]/50 transition-colors duration-300 group-hover:text-[#250601]/60">{cond}</p>
                    <p className="text-2xl font-semibold text-[#250601] transition-colors duration-300 group-hover:text-[#250601]/80">{result}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-20 max-w-3xl">
            <div className="mx-auto mb-8 h-px w-20 bg-gradient-to-r from-transparent via-[#C4C2B9]/30 to-transparent"></div>
            <div className="flex items-center justify-center gap-5">
              <div className="h-2 w-2 rounded-full bg-[#250601]/15 transition-all duration-300 hover:bg-[#250601]/30 hover:scale-150"></div>
              <p className="text-xl leading-relaxed text-[#250601]/55 transition-colors duration-300 hover:text-[#250601]/70">
                A clear brand doesn't just change how your business looks. It changes how your business grows.
              </p>
              <div className="h-2 w-2 rounded-full bg-[#250601]/15 transition-all duration-300 hover:bg-[#250601]/30 hover:scale-150"></div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </Reveal>
  );
};
