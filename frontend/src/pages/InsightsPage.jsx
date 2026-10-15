import { ArrowUpRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout.jsx';
import { SectionContainer, Badge } from '../components/ui/Primitives.jsx';

const INSIGHTS_HERO = 'https://images.unsplash.com/photo-1676287569988-e5d4f914968d?q=80&w=2400&auto=format&fit=crop&q=85';

const FEATURED_ARTICLES = [
    'Why Trust Is a Competitive Advantage',
    'The Cost of Poor Positioning',
    'Building a Business Before Building a Brand',
    'When Marketing Cannot Solve a Structural Problem',
    'Why Consistency Creates Authority',
    'Digital Presence as Business Infrastructure',
];

const METHOD_STEPS = [
    { num: '01', title: 'Discovery', desc: 'Understanding the real problem before naming a solution.' },
    { num: '02', title: 'Research & Diagnosis', desc: 'Diagnosing what is structural versus what is cosmetic.' },
    { num: '03', title: 'Strategic Plan', desc: 'Translating diagnosis into a sequenced plan of action.' },
    { num: '04', title: 'Execution', desc: 'Building the brand, systems, or campaigns the plan calls for.' },
    { num: '05', title: 'Implementation', desc: 'Embedding the work into how the business runs day to day.' },
];

const PRINCIPLES = [
    { roman: 'I', title: 'Structure First', desc: 'Every piece starts from a real business problem, not a content calendar slot.' },
    { roman: 'II', title: 'No Borrowed Trends', desc: 'We write from our own method, not from what is currently performing well online.' },
    { roman: 'III', title: 'Built to Last', desc: 'Frameworks are designed to stay useful long after the news cycle moves on.' },
];

const InsightsPage = () => (
    <PageLayout
        heroBg={INSIGHTS_HERO}
        heroContent={
            <>
                <p className="text-[#FDFDFD]/70 text-sm tracking-[0.25em] uppercase font-medium mb-6">Insights</p>
                <h1 className="text-5xl md:text-7xl lg:text-[5rem] tracking-tighter font-medium text-[#FDFDFD] leading-none mb-8">
                    Ideas that help businesses think more strategically.
                </h1>
                <p className="text-lg md:text-xl text-[#FDFDFD]/70 max-w-2xl leading-relaxed">
                    Exploring branding, positioning, communication, digital authority, and the principles behind sustainable growth.
                </p>
            </>
        }
    >
        <SectionContainer className="p-8 md:p-16 lg:p-24">
            <div className="max-w-5xl mx-auto">
                <Badge>Our Philosophy</Badge>
                <div className="md:grid md:grid-cols-2 md:gap-16 mt-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 leading-tight">
                            Not every article is worth reading.
                        </h2>
                        <p className="text-[#250601]/60 leading-relaxed mb-6">
                            We publish ideas that help leaders make better decisions, build stronger brands and create businesses prepared for long-term growth.
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 space-y-6">
                        <div>
                            <h3 className="font-medium text-lg mb-2">Why We Share Knowledge</h3>
                            <p className="text-[#250601]/60 leading-relaxed text-sm">
                                We believe the strongest organisations are built on informed decisions. That is why we publish insights that go beyond marketing and explore the strategic foundations of modern business.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-lg mb-2">Education is part of our philosophy.</h3>
                            <p className="text-[#250601]/60 leading-relaxed text-sm">
                                At DGAP, we don't believe knowledge should remain closed within an agency. We believe better-informed businesses make better decisions, communicate with more clarity, and build lasting competitive advantages.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SectionContainer>

        <SectionContainer
            className="p-8 md:p-16 lg:p-24 bg-[#250601] text-[#FDFDFD]"
            whiteBg={false}
        >
            <div className="max-w-5xl mx-auto">
                <Badge darkMode>How We Think</Badge>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-8 mb-4">The Structure Behind Every Insight</h2>
                <p className="text-[#FDFDFD]/60 max-w-xl mb-16">
                    Every article we publish is filtered through the same five-step method we use with clients — because ideas without a path to execution are just opinions.
                </p>
                <div className="space-y-0">
                    {METHOD_STEPS.map(({ num, title, desc }, i) => (
                        <div key={num} className={`flex gap-8 py-8 ${i < METHOD_STEPS.length - 1 ? 'border-b border-[#FDFDFD]/10' : ''}`}>
                            <div className="shrink-0 w-10 h-10 rounded-none border border-[#FDFDFD]/20 flex items-center justify-center text-xs font-bold text-[#FDFDFD]/50">
                                {num}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-1">{title}</h3>
                                <p className="text-[#FDFDFD]/60 text-sm leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-12 text-[#FDFDFD]/40 text-sm">
                    We prioritise depth over trends. Our goal is not to publish more content, but to publish ideas that remain relevant long after headlines change.
                </p>
            </div>
        </SectionContainer>

        <SectionContainer className="p-8 md:p-16 lg:p-24">
            <div className="max-w-5xl mx-auto">
                <Badge>Start Here</Badge>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-8 mb-12">Featured Insights</h2>
                <div className="space-y-0">
                    {FEATURED_ARTICLES.map((article, i) => (
                        <div
                            key={article}
                            className="flex items-center justify-between py-6 border-b border-[#C4C2B9]/30 group cursor-pointer hover:bg-[#250601]/3 -mx-4 px-4 rounded-none transition-colors"
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-xs font-bold text-[#250601]/30 tracking-widest w-6">{String(i + 1).padStart(2, '0')}</span>
                                <span className="text-lg font-medium group-hover:text-[#250601]/70 transition-colors">→ {article}</span>
                            </div>
                            <ArrowUpRight size={20} className="text-[#250601]/30 group-hover:text-[#250601] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                    ))}
                </div>
            </div>
        </SectionContainer>

        <SectionContainer
            className="p-8 md:p-16 lg:p-24 bg-[#250601]/5 border border-[#C4C2B9]/30"
            whiteBg={false}
        >
            <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {PRINCIPLES.map(({ roman, title, desc }) => (
                        <div key={roman} className="p-8 rounded-none bg-[#FDFDFD] border border-[#C4C2B9]/30">
                            <span className="text-5xl font-medium text-[#250601]/10 block mb-4">{roman}</span>
                            <h3 className="text-xl font-medium mb-3">{title}</h3>
                            <p className="text-[#250601]/60 text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </SectionContainer>

        <SectionContainer
            className="p-8 md:p-16 lg:p-32 flex flex-col items-center text-center bg-[#250601] text-[#FDFDFD]"
            whiteBg={false}
        >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 max-w-3xl leading-tight">
                Learn. Apply. Grow.
            </h2>
            <p className="text-[#FDFDFD]/60 text-lg max-w-xl leading-relaxed">
                Every article, framework, and perspective we share is intended to help leaders make better decisions and build organisations prepared for long-term success.
            </p>
        </SectionContainer>
    </PageLayout>
);

export default InsightsPage;
