import Reveal from '../../../components/ui/Reveal.jsx';
import { SectionContainer, Badge } from '../../../components/ui/Primitives.jsx';
import { homeContent } from '../homeContent.js';

export const FamiliarSection = () => {
  return (
    <Reveal direction="left" className="block w-full">
      <SectionContainer
        id="familiar"
        className="relative bg-gradient-to-br from-[#fcfaf6] via-[#f6efe7] to-[#efe5d6] px-6 py-20 md:px-10 md:py-28 lg:px-12 lg:py-32"
      >
        <div className="section-shell">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-3">
              <Badge>Section 01</Badge>
              <div className="h-px w-12 bg-gradient-to-r from-[#250601]/20 to-transparent" />
            </div>

            <h2 className="mt-8 mb-6 font-display text-4xl font-medium tracking-[-0.02em] text-[#250601] md:text-5xl lg:text-[3.5rem]">
              Does this sound familiar?
            </h2>

            <p className="mx-auto max-w-2xl text-lg text-[#250601]/75 md:mx-0">
              These are the signs that your brand isn't telling a clear enough story.
            </p>
          </div>

          <div className="mt-16 grid gap-8">
            {homeContent.problems.map(({ q, a }, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl bg-[#fffdfa] p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(37,6,1,0.12)] md:p-10 lg:p-12"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#250601]/0 via-[#250601]/[0.025] to-[#250601]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative items-start md:grid md:grid-cols-2 md:gap-16">
                  <div className="flex items-start gap-5">
                    <span className="shrink-0 font-mono text-sm font-bold tracking-[0.24em] text-[#250601]/20 transition-colors duration-500 group-hover:text-[#250601]/35">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <p className="text-xl font-medium leading-snug text-[#250601] transition-colors duration-300 group-hover:text-[#250601]/95 md:text-2xl">
                      {q}
                    </p>
                  </div>

                  <div className="mt-6 flex items-start gap-6 md:mt-0">
                    <div className="mt-2 hidden h-10 w-px bg-gradient-to-b from-[#C4C2B9]/60 to-transparent md:block" />

                    <p className="leading-relaxed text-[#250601]/75 transition-colors duration-500 group-hover:text-[#250601]/85">
                      {a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </Reveal>
  );
};
