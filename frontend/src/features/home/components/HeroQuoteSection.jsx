import { Quote } from 'lucide-react';
import Reveal from '../../../components/ui/Reveal.jsx';
import { SectionContainer } from '../../../components/ui/Primitives.jsx';
import { homeContent } from '../homeContent.js';

export const HeroQuoteSection = () => {
  return (
    <Reveal direction="bottom" className="block w-full">
      <SectionContainer id="hero-copy" className="relative px-6 py-10 md:px-10 md:py-14 lg:px-12 lg:py-16 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#250601] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#250601] rounded-full blur-3xl"></div>
        </div>

        <div className="section-shell relative">
          <div className="grid items-start gap-8 lg:grid-cols-[auto,1fr] lg:gap-14">
            <div className="hidden lg:block">
              <div className="relative">
                <Quote size={48} className="text-[#250601]/8" />
                <div className="absolute -top-4 -left-4 w-4 h-4 bg-gradient-to-br from-[#250601]/20 to-transparent rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="relative border-l-[4px] border-[#250601] pl-6 md:pl-10 transition-all duration-700 hover:border-l-[6px]">
                <div className="absolute -left-[3px] top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#250601] via-[#250601]/80 to-[#250601]/40 rounded-full"></div>
                <p className="text-base font-light leading-relaxed text-[#250601]/65 md:text-lg lg:text-xl font-playfair transition-colors duration-500 hover:text-[#250601]/80">
                  {homeContent.hero.heroQuote1}
                </p>
                <p className="mt-4 text-base font-medium leading-relaxed text-[#250601] md:text-lg lg:text-xl font-playfair-italic">
                  {homeContent.hero.heroQuote2}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </Reveal>
  );
};
