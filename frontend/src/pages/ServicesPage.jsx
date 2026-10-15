import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout.jsx';
import ConsultationModal from '../components/sections/ConsultationModal.jsx';
import { SectionContainer, Badge } from '../components/ui/Primitives.jsx';

const SERVICE_IMAGES = [
    'https://plus.unsplash.com/premium_photo-1736583008967-d0e92d28ce23?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1681364365218-2a882a191f2a?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1643122966676-29e8597257f7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1681711648582-34ccda82c20b?q=80&w=855&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const SOLUTIONS = [
    {
        num: '01',
        title: 'Strategic Diagnosis',
        tagline: 'Understand what\'s holding your business back.',
        intro: 'Before investing in branding or marketing, you need clarity. Our Strategic Diagnosis gives you a clear picture of where your business stands today, what\'s creating friction, and where the greatest opportunities for growth exist.',
        ideal: [
            'Feel stuck despite growing',
            'Need an objective business assessment',
            'Want to make better strategic decisions',
        ],
        includes: ['Business & Brand Audit', 'Positioning Analysis', 'Competitive Review', 'Customer Profile', 'Strategic Recommendations'],
          start: 'from IDR 3,500,000',
    },
    {
        num: '02',
        title: 'Brand Strategy',
        tagline: 'Build a brand people understand and trust.',
        intro: 'A strong brand gives your business direction. We define how your company should be positioned, communicated and perceived, so customers clearly understand your value—and why they should choose you.',
        ideal: [
            'Have outgrown their current brand',
            'Need stronger positioning',
            'Want to compete on value instead of price',
        ],
        includes: ['Brand Positioning', 'Brand Strategy', 'Brand Messaging', 'Communication Framework', 'Visual Direction'],
        investment: 'from IDR 5,000,000',
    },
    {
        num: '03',
        title: 'Brand Management',
        tagline: 'Keep your brand consistent as your business grows.',
        intro: 'Building a brand is only the beginning. We help your business communicate consistently across every customer touchpoint while maintaining a strategic and active digital presence.',
        ideal: [
            'Need ongoing execution',
            'Want consistent communication',
            'Need marketing aligned with business goals',
        ],
        includes: ['Content Strategy', 'Creative Production', 'Social Media Management', 'Community Engagement', 'Performance Reporting'],
        investment: 'from IDR 5,000,000 / month',
    },
    {
        num: '04',
        title: 'Digital Experience',
        tagline: 'Build digital experiences that support business growth.',
        intro: 'Your digital presence should do more than look professional. It should build trust, communicate value and create opportunities. We design and develop digital experiences that support long-term business growth.',
        ideal: [
            'Need a professional website',
            'Want a better customer experience',
            'Require custom digital solutions',
            'Want to integrate AI into their business',
        ],
        includes: ['Website Design', 'Website Development', 'SEO Foundations', 'Analytics Integration', 'AI-Powered Customer Support'],
        investment: 'upon consultation',
    }
];

const PROCESS_STEPS = [
    'Discovery',
    'Business & Brand Audit',
    'Brand Strategy',
    'Execution',
    'Brand Rollout'
];

const ServicesPage = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <PageLayout
                heroBg={SERVICE_IMAGES}
                heroContent={
                    <>
                        <p className="text-[#FDFDFD]/70 text-sm tracking-[0.25em] uppercase font-medium mb-6">Services</p>
                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter font-medium text-[#FDFDFD] leading-none mb-8">
                            Build a business people understand.
                        </h1>
                    </>
                }
            >
                <SectionContainer className="p-8 md:p-16 lg:p-24 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8 leading-tight">
                            Every business is different.<br />
                        </h2>
                        <p className="text-[#250601]/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            We start by understanding your business, then recommend the right solution for where you are today.
                        </p>
                        <div className="flex flex-col items-center gap-6 mt-4">
                            <p className="text-[#250601] font-medium">Investment from IDR 3,500,000</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center gap-2 bg-[#250601] text-[#FDFDFD] px-8 py-4 rounded-none text-sm font-medium hover:bg-[#250601]/90 hover:scale-[1.01] transition-all duration-300 shadow-lg"
                            >
                                Request a Consultation <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </SectionContainer>

                <SectionContainer className="p-8 md:p-16">
                    <div className="max-w-5xl mx-auto text-center">
                        <Badge>How We Help</Badge>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-8 mb-4">
                            Strategic solutions designed around your business.
                        </h2>
                        <p className="text-[#250601]/60 text-lg max-w-2xl mx-auto">
                            Whether you're building, repositioning or growing, every engagement is designed to solve a different business challenge.
                        </p>
                    </div>
                </SectionContainer>

                {SOLUTIONS.map(({ num, title, tagline, intro, ideal, includes, investment }) => (
                    <SectionContainer
                        key={num}
                        className={`p-8 md:p-16 lg:p-24 ${num === '01' || num === '03' ? '' : 'bg-[#250601]/5 border border-[#C4C2B9]/30'}`}
                        whiteBg={num === '01' || num === '03'}
                    >
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-12 h-12 rounded-none bg-[#250601] text-[#FDFDFD] flex items-center justify-center text-xs font-bold tracking-widest shrink-0">
                                    {num}
                                </span>
                                <Badge>{title}</Badge>
                            </div>
                            <div className="md:grid md:grid-cols-2 md:gap-16 items-start">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 leading-tight">{tagline}</h2>
                                    <p className="text-[#250601]/60 leading-relaxed mb-8">{intro}</p>
                                    <div className="mb-8">
                                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#250601]/40 mb-4">Ideal for businesses that:</p>
                                        <ul className="space-y-2">
                                            {ideal.map((item) => (
                                                <li key={item} className="flex items-start gap-3 text-[#250601]/70">
                                                    <span className="w-1.5 h-1.5 rounded-none bg-[#250601]/40 mt-2 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <p className="text-[#250601]/50 text-sm">Investment {investment}</p>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="inline-flex items-center gap-2 bg-[#250601] text-[#FDFDFD] px-6 py-3 rounded-none text-sm font-medium hover:bg-[#250601]/90 hover:scale-[1.01] transition-all duration-300"
                                        >
                                            Request a Consultation <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0">
                                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#250601]/40 mb-4">What's included</p>
                                    <div className="bg-[#250601]/5 p-8 border border-[#C4C2B9]/30 rounded-none">
                                        <div className="space-y-3">
                                            {includes.map((item) => (
                                                <div key={item} className="flex items-center gap-3 py-3 border-b border-[#C4C2B9]/30">
                                                    <span className="w-5 h-5 rounded-none border border-[#C4C2B9] flex items-center justify-center shrink-0">
                                                        <span className="w-2 h-2 rounded-none bg-[#250601]" />
                                                    </span>
                                                    <span className="text-[#250601]/80 font-medium">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SectionContainer>
                ))}

                <SectionContainer
                    className="p-8 md:p-16 lg:p-24 bg-[#250601] text-[#FDFDFD]"
                    whiteBg={false}
                >
                    <div className="max-w-5xl mx-auto">
                        <Badge darkMode>Our Approach</Badge>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-8 mb-12">
                            Every engagement follows the same strategic process.
                        </h2>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-0">
                            {PROCESS_STEPS.map((step, i) => (
                                <div key={step} className="flex md:flex-col items-center gap-4 md:gap-3 flex-1">
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-3 flex-1">
                                        <div className="w-8 h-8 rounded-none border border-[#FDFDFD]/30 flex items-center justify-center text-xs font-bold">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <span className="text-[#FDFDFD]/80 text-sm font-medium">{step}</span>
                                    </div>
                                    {i < PROCESS_STEPS.length - 1 && (
                                        <div className="hidden md:block w-full h-px bg-[#FDFDFD]/20 flex-1 mx-2" />
                                    )}
                                    {i < PROCESS_STEPS.length - 1 && (
                                        <div className="md:hidden w-px h-8 bg-[#FDFDFD]/20" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="mt-12 text-[#FDFDFD]/50 text-sm">The best solutions begin with understanding—not assumptions.</p>
                    </div>
                </SectionContainer>

                <SectionContainer className="p-8 md:p-16 lg:p-24">
                    <div className="max-w-5xl mx-auto text-center">
                        <Badge>Investment</Badge>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-8 mb-6">
                            Every investment starts with understanding.
                        </h2>
                        <p className="text-[#250601]/60 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
                            Every project is tailored to your goals, your challenges and your stage of growth. Engagements start from IDR 3,500,000 with a Strategic Diagnosis.
                        </p>
                        <p className="text-[#250601]/60 mb-10">
                            If your business requires a broader solution, we'll create a tailored engagement around your objectives.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 bg-[#250601] text-[#FDFDFD] px-8 py-4 rounded-none text-sm font-medium hover:bg-[#250601]/90 hover:scale-[1.01] transition-all duration-300 shadow-lg"
                        >
                            Request a Consultation <ArrowRight size={16} />
                        </button>
                    </div>
                </SectionContainer>

                <SectionContainer
                    className="p-8 md:p-16 lg:p-24 flex flex-col items-center text-center bg-[#250601]/5 border border-[#C4C2B9]/30"
                    whiteBg={false}
                >
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 max-w-2xl leading-tight">
                        Not sure which solution is right for your business?
                    </h2>
                    <p className="text-[#250601]/60 text-lg max-w-xl mb-3 leading-relaxed">
                        That's exactly why every engagement begins with a conversation. We'll help you understand what your business needs before recommending any service.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-6 inline-flex items-center gap-2 bg-[#250601] text-[#FDFDFD] px-8 py-4 rounded-none text-sm font-medium hover:bg-[#250601]/90 hover:scale-[1.01] transition-all duration-300 shadow-lg"
                    >
                        Request a Consultation <ArrowRight size={16} />
                    </button>
                </SectionContainer>
            </PageLayout>

            {showModal && <ConsultationModal onClose={() => setShowModal(false)} />}
        </>
    );
};

export default ServicesPage;
