import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout.jsx';
import { SectionContainer, Badge } from '../components/ui/Primitives.jsx';

const SERVICES = [
    {
        title: 'Business Architecture',
        desc: 'Design a business built for sustainable growth.',
    },
    {
        title: 'Strategic Planning',
        desc: 'Create a clear direction for the next stage of growth.',
    },
    {
        title: 'Process Design',
        desc: 'Develop systems that improve consistency and efficiency.',
    },
    {
        title: 'Operational Systems',
        desc: 'Build operational foundations that support better decision-making.',
    },
    {
        title: 'Capacity Management',
        desc: 'Prepare your business to scale without creating unnecessary complexity.',
    },
    {
        title: 'Growth Frameworks',
        desc: 'Create repeatable systems that support long-term growth.',
    },
];

const WHO_WE_WORK_WITH = [
    'Preparing for growth',
    'Restructuring operations',
    'Entering new markets',
    'Building internal processes',
    'Clarifying leadership direction',
    'Strengthening business performance',
];

const CONSULTING_HERO = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2400&auto=format&fit=crop&q=85&ixlib=rb-4.1.0';
const CONSULTING_APPROACH = '/consulting_approach.png';

const ConsultingPage = () => {
    return (
        <PageLayout
            heroBg={CONSULTING_HERO}
            heroContent={
                <>
                    <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter font-medium text-[#FDFDFD] leading-none mb-8">
                        Beyond Branding.<br />Build the business behind the brand.
                    </h1>
                    <p className="text-lg md:text-xl text-[#FDFDFD]/70 max-w-2xl leading-relaxed mb-6">
                        Every successful brand depends on a business that can support it. We help founders and leadership teams strengthen the structure, systems and strategy that make sustainable growth possible.
                    </p>
                    <Link
                        to="/request-consultation"
                        className="inline-flex items-center gap-2 bg-[#FDFDFD] text-[#250601] px-8 py-4 rounded-none text-sm font-medium hover:bg-[#FDFDFD]/90 hover:scale-[1.01] transition-all duration-300 shadow-lg mt-4"
                    >
                        Book a Discovery Call <ArrowRight size={16} />
                    </Link>
                </>
            }
        >
            <SectionContainer className="p-8 md:p-16 lg:p-24">
                <div className="max-w-5xl mx-auto">
                    <Badge>Section 1</Badge>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-8 mb-8 max-w-3xl leading-tight">
                        Every business reaches a point where experience isn't enough.
                    </h2>
                    <div className="md:grid md:grid-cols-2 md:gap-16">
                        <div className="space-y-4 text-[#250601]/60 leading-relaxed">
                            <p>Growth creates new challenges. More people. More decisions. More complexity.</p>
                            <p>Without the right structure, progress slows. Communication becomes inconsistent. Teams work harder. Results become less predictable.</p>
                        </div>
                        <div className="mt-6 md:mt-0">
                            <p className="text-[#250601]/60 mb-6">The answer isn't working more.</p>
                            <p className="text-2xl md:text-3xl font-medium leading-snug">It's building a business that works better.</p>
                        </div>
                    </div>
                </div>
            </SectionContainer>

            <SectionContainer
                className="p-8 md:p-16 lg:p-24 bg-[#250601] text-[#FDFDFD]"
                whiteBg={false}
            >
                <div className="max-w-5xl mx-auto">
                    <Badge darkMode>What we help businesses build</Badge>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-8 mb-4">
                        We work alongside founders and leadership teams to strengthen the business behind the brand.
                    </h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SERVICES.map(({ title, desc }) => (
                            <div key={title} className="p-6 rounded-none border border-[#FDFDFD]/10 hover:border-[#FDFDFD]/30 hover:bg-[#FDFDFD]/5 transition-all duration-300">
                                <h3 className="text-lg font-medium mb-3">{title}</h3>
                                <p className="text-[#FDFDFD]/60 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionContainer>

            <SectionContainer className="p-8 md:p-16 lg:p-24">
                <div className="max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-16 items-start">
                    <div>
                        <Badge>Our Consulting Approach</Badge>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-8 mb-8 leading-tight">
                            Every engagement begins with understanding.
                        </h2>
                        <p className="text-[#250601]/60 leading-relaxed mb-6">
                            We work closely with your team to understand how your business operates today, where opportunities are being lost and what needs to change.
                        </p>
                        <p className="text-[#250601] font-medium text-lg">
                            Together, we build practical solutions that strengthen the business—not just the strategy.
                        </p>
                    </div>
                    <div className="mt-10 md:mt-0 aspect-square rounded-none overflow-hidden">
                        <img src={CONSULTING_APPROACH} alt="Consulting approach" className="w-full h-full object-cover" />
                    </div>
                </div>
            </SectionContainer>

            <SectionContainer
                className="p-8 md:p-16 lg:p-24 bg-[#250601]/5 border border-[#C4C2B9]/30"
                whiteBg={false}
            >
                <div className="max-w-5xl mx-auto">
                    <Badge>Who We Work With</Badge>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-8 mb-12">
                        Our consulting engagements are designed for businesses that are:
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {WHO_WE_WORK_WITH.map((item) => (
                            <div key={item} className="flex items-center gap-4 p-5 rounded-none bg-[#FDFDFD] border border-[#C4C2B9]/30">
                                <span className="w-1.5 h-1.5 rounded-none bg-[#250601] shrink-0" />
                                <span className="font-medium text-[#250601]">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionContainer>

            <SectionContainer className="p-8 md:p-16 lg:p-24 text-center">
                <div className="max-w-3xl mx-auto">
                    <Badge>Why Work With Digital Gap?</Badge>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mt-8 mb-8 leading-tight">
                        We don't believe in generic business advice.
                    </h2>
                    <p className="text-[#250601]/60 text-lg mb-6 leading-relaxed">
                        Every recommendation is based on the reality of your business.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left mt-10">
                        {[
                            { title: 'No templates.', desc: 'Every solution is built around your specific business context.' },
                            { title: 'No unnecessary complexity.', desc: 'We focus on practical strategies that make a real difference.' },
                            { title: 'Built to grow.', desc: 'Just practical strategies that help businesses become stronger, more efficient and better prepared for growth.' },
                        ].map(({ title, desc }) => (
                            <div key={title} className="p-6 rounded-none bg-[#250601]/5 border border-[#C4C2B9]/30">
                                <h3 className="font-medium mb-3">{title}</h3>
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
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 max-w-3xl leading-tight">
                    Ready to build a stronger business?
                </h2>
                <p className="text-[#FDFDFD]/60 text-lg max-w-xl mb-10 leading-relaxed">
                    If your business is preparing for its next stage of growth, we'd love to start the conversation.
                </p>
                <Link
                    to="/request-consultation"
                    className="inline-flex items-center gap-2 bg-[#FDFDFD] text-[#250601] px-8 py-4 rounded-none text-sm font-medium hover:bg-[#FDFDFD]/90 hover:scale-[1.01] transition-all duration-300 shadow-lg"
                >
                    Book a Discovery Call <ArrowRight size={16} />
                </Link>
            </SectionContainer>
        </PageLayout>
    );
};

export default ConsultingPage;
