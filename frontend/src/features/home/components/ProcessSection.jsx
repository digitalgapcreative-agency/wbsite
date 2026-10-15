import { useState } from 'react';
import { SectionContainer, Badge } from '../../../components/ui/Primitives.jsx';
import { homeContent } from '../homeContent.js';

export const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <SectionContainer
      id="process"
      className="relative border-y border-[#C4C2B9]/10 bg-gradient-to-b from-[#F9F8F6] to-[#F3F1EE] px-6 py-20 md:px-10 md:py-28 lg:px-12 lg:py-32"
    >
      <div className="section-shell mx-auto max-w-5xl">
        <div className="text-center">
          <Badge>Section 04</Badge>
          <h2 className="mt-8 text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-[#250601] md:text-5xl lg:text-[3.5rem]">
            From Understanding to Growth
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#250601]/55">
            Every successful business starts with a clear direction. We don't begin with design. 
            We begin by understanding the business behind the brand.
          </p>
        </div>

        <div className="relative mt-20">
          <div className="absolute bottom-0 left-8 top-0 w-px bg-gradient-to-b from-transparent via-[#C4C2B9]/40 to-transparent md:left-10"></div>

          {homeContent.process.map(({ step, title, desc }, i) => (
            <div 
              key={step} 
              className={`relative flex gap-8 py-10 pl-20 md:gap-10 md:py-12 md:pl-24 transition-all duration-500 cursor-pointer ${
                activeStep === i ? 'scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className={`absolute left-0 top-10 flex h-16 w-16 items-center justify-center font-mono text-sm font-bold tracking-[0.24em] text-white shadow-xl transition-all duration-500 md:top-12 ${
                activeStep === i 
                  ? 'bg-[#250601] scale-110 rotate-3 shadow-2xl' 
                  : 'bg-[#250601]/80 hover:bg-[#250601]'
              }`}>
                <span className="relative z-10">{step}</span>
                <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#250601] transition-all duration-500 ${
                  activeStep === i ? 'scale-150 opacity-100' : 'scale-0 opacity-0'
                }`}></div>
              </div>

              <div className={`flex-1 pt-2 transition-all duration-500 ${
                activeStep === i ? 'translate-x-2' : ''
              }`}>
                <h3 className={`mb-3 text-xl font-medium transition-all duration-500 md:text-2xl ${
                  activeStep === i ? 'text-[#250601]' : 'text-[#250601]/80'
                }`}>
                  {title}
                </h3>
                <p className={`max-w-2xl leading-relaxed transition-all duration-500 ${
                  activeStep === i ? 'text-[#250601]/65' : 'text-[#250601]/55'
                }`}>
                  {desc}
                </p>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#250601]/20 to-transparent transition-all duration-500 ${
                activeStep === i ? 'opacity-100' : 'opacity-0'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
