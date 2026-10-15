import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LOGO_URL = '/dgap-logo-exact.svg';

const NAV_ITEMS = [
    { label: 'Home', to: '/' },
    { label: 'Solutions', to: '/services' },
    { label: 'Consulting', to: '/consulting' },
    { label: 'Insights', to: '/insights' },
];

const Navigation = ({ lightBg = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isGlassy = !lightBg && !scrolled;

    const shellClass = isGlassy
        ? 'border border-white/15 bg-white/10 text-[#FDFDFD] backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.12)]'
        : 'border border-[#C4C2B9]/15 bg-[#FDFDFD]/80 text-[#250601] backdrop-blur-md shadow-[0_12px_36px_rgba(37,6,1,0.05)]';

    const linkClass = isGlassy
        ? 'text-[#FDFDFD]/80 hover:text-[#FDFDFD] hover:bg-white/10'
        : 'text-[#250601]/70 hover:text-[#250601] hover:bg-[#D6D7D1]/50';

    return (
        <nav className="relative mx-auto flex w-full max-w-[1400px] items-center justify-between">
            <Link
                to="/"
                className={`flex h-11 w-11 items-center justify-center rounded-full border p-2 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${isGlassy ? 'border-white/15 bg-white/10' : 'border-[#C4C2B9]/15 bg-[#FDFDFD]/80'}`}
            >
                <img src={LOGO_URL} alt="DGAP logo" className="h-7 w-auto object-contain" />
            </Link>

            <div className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 md:flex ${shellClass}`}>
                {NAV_ITEMS.map(({ label, to }) => {
                    const isActive = location.pathname === to;
                    return (
                        <Link
                            key={label}
                            to={to}
                            className={`rounded-full px-3.5 py-2 text-sm font-medium ${isActive
                                ? isGlassy
                                    ? 'bg-[#FDFDFD] text-[#250601] shadow-sm'
                                    : 'bg-[#250601] text-[#FDFDFD]'
                                : linkClass}`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>

            <div className="md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`rounded-full border p-2.5 ${isGlassy ? 'border-white/15 bg-white/10 text-[#FDFDFD]' : 'border-[#C4C2B9]/15 bg-[#FDFDFD]/80 text-[#250601]'}`}
                    aria-label="Toggle navigation"
                >
                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {isOpen && (
                <div className={`absolute left-0 right-0 top-16 z-50 flex flex-col gap-1 rounded-[1.25rem] border p-3 shadow-2xl md:hidden ${shellClass}`}>
                    {NAV_ITEMS.map(({ label, to }) => {
                        const isActive = location.pathname === to;
                        return (
                            <Link
                                key={label}
                                to={to}
                                onClick={() => setIsOpen(false)}
                                className={`rounded-2xl px-4 py-3 text-left text-base font-medium ${isActive
                                    ? isGlassy
                                        ? 'bg-[#FDFDFD] text-[#250601]'
                                        : 'bg-[#250601] text-[#FDFDFD]'
                                    : linkClass}`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </nav>
    );
};

export default Navigation;
