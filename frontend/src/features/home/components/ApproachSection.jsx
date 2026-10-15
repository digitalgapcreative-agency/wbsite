import { Layers, Target, Eye } from 'lucide-react';
import Reveal from '../../../components/ui/Reveal.jsx';
import { SectionContainer, Badge } from '../../../components/ui/Primitives.jsx';

const SECTION_03_IMAGE = '/home_section_03.png';

export const ApproachSection = () => {
  return (
    <Reveal direction="bottom" className="block w-full">
      <SectionContainer id="our-approach" className="relative bg-white px-6 py-20 md:px-10 md:py-28 lg:px-12 lg:py-32">
        <div className="section-shell">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <Badge>Section 03</Badge>
              <h2 className="mt-8 text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-[#250601] md:text-5xl lg:text-[3.5rem] font-display">
                That's why we build brands differently.
              </h2>
              
              <div className="mt-10 space-y-8">
                <div className="group flex items-start gap-5 transition-all duration-300 hover:translate-x-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#250601]/5 transition-all duration-300 group-hover:bg-[#250601]/10 group-hover:scale-110 group-hover:shadow-lg">
                    <Layers size={22} className="text-[#250601]/40 transition-colors duration-300 group-hover:text-[#250601]/60" />
                  </div>
                  <div>
                    <p className="text-lg text-[#250601]/55 transition-colors duration-300 group-hover:text-[#250601]/70">
                      Most branding starts with visuals. Logos. Websites. Colours.
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-5 transition-all duration-300 hover:translate-x-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#250601] transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    <Target size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-medium text-[#250601] transition-colors duration-300 group-hover:text-[#250601]/80">
                      We start somewhere else.
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-5 transition-all duration-300 hover:translate-x-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#250601]/5 transition-all duration-300 group-hover:bg-[#250601]/10 group-hover:scale-110 group-hover:shadow-lg">
                    <Eye size={22} className="text-[#250601]/40 transition-colors duration-300 group-hover:text-[#250601]/60" />
                  </div>
                  <div>
                    <p className="text-lg text-[#250601]/55 transition-colors duration-300 group-hover:text-[#250601]/70">
                      We start with the business. What makes it valuable. Why customers choose you. Why others don't.
                    </p>
                  </div>
                </div>

                <div className="relative border-l-4 border-[#250601] pl-6 pt-2 transition-all duration-300 hover:border-l-[5px] hover:pl-7">
                  <div className="absolute -left-[2px] top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#250601] to-transparent"></div>
                  <p className="text-xl font-medium leading-[1.3] text-[#250601]">
                    Only then do we build a brand that reflects the business you've become.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-square overflow-hidden rounded-[2.5rem] bg-[#250601]/5 ring-1 ring-[#250601]/5">
                <img
                  src={SECTION_03_IMAGE}
                  alt="Brand strategy process"
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.05] group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#250601]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-28 w-28 border border-[#250601]/10 rounded-2xl transition-all duration-500 group-hover:border-[#250601]/20 group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
              <div className="absolute -left-6 -top-6 h-28 w-28 border border-[#250601]/10 rounded-2xl transition-all duration-500 group-hover:border-[#250601]/20 group-hover:translate-x-2 group-hover:translate-y-2"></div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </Reveal>
  );
};
