import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Reveal from '../../../components/ui/Reveal.jsx';
import { SectionContainer } from '../../../components/ui/Primitives.jsx';

export const CtaSection = ({ onConsultClick }) => {
  return (
    <Reveal direction="bottom" className="block w-full">
      <SectionContainer id="cta" className="relative flex flex-col items-center bg-white px-6 py-20 text-center text-[#250601] md:px-10 md:py-28 lg:px-12 lg:py-32 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 border border-[#250601]/5 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-[#250601]/5 rounded-full"></div>
        
        <div className="section-shell relative max-w-4xl">
          <div className="mb-8">
            <div className="mx-auto h-1.5 w-16 bg-gradient-to-r from-[#250601]/50 to-[#250601] rounded-full"></div>
          </div>
          
          <h2 className="text-4xl font-medium leading-[1.08] tracking-[-0.02em] md:text-5xl lg:text-[3.5rem] font-display transition-all duration-500 hover:scale-[1.02]">
            Ready to build a brand people believe in?
          </h2>
          
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="group rounded-[2rem] border border-[#C4C2B9]/15 bg-gradient-to-br from-[#250601]/[0.03] to-[#250601]/[0.07] p-10 md:p-12 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(37,6,1,0.1)] hover:scale-[1.02]">
              <p className="text-lg leading-relaxed text-[#250601]/55 group-hover:text-[#250601]/65 transition-colors duration-300">
                Let's build a business people understand—through a brand they trust. 
                Because when people understand your business, they trust your value. 
                And when they trust your value, they're far more likely to choose you.
              </p>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">
            <button
              onClick={onConsultClick}
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[#250601] px-10 py-5 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(37,6,1,0.2)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(37,6,1,0.3)] hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <span className="relative z-10">Request a Consultation</span>
              <ArrowRight size={18} className="relative z-10 transition-all duration-300 group-hover:translate-x-1.5 group-hover:scale-110" />
            </button>
            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#250601]/20 px-10 py-5 text-sm font-semibold text-[#250601] transition-all duration-500 hover:border-[#250601] hover:bg-[#250601] hover:text-white hover:-translate-y-1 hover:shadow-lg"
            >
              Explore Solutions
              <ChevronRight size={18} className="transition-all duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>
      </SectionContainer>
    </Reveal>
  );
};
