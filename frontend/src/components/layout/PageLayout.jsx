import { useEffect, useState } from 'react';
import Navigation from './Navigation.jsx';
import Footer from './Footer.jsx';

/**
 * Shared layout: Hero section + scrollable content with Footer.
 *
 * heroBg:
 * - URL string for a single hero background
 * - Array of URLs for an automatic hero slider
 *
 * heroContent: JSX rendered over the hero
 * lightNav: whether the nav sits on a light background
 */
const PageLayout = ({ heroBg, heroContent, children, lightNav = false }) => {
    const isSlider = Array.isArray(heroBg);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        if (!isSlider || heroBg.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroBg.length);
        }, 3500);

        return () => clearInterval(interval);
    }, [isSlider, heroBg]);

    return (
        <div className="min-h-screen bg-[#efe8dc] font-sans text-[#250601]">

            {/* HERO */}
            <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden">

                {/* HERO BACKGROUND */}
                {heroBg && (
                    <>
                        {isSlider ? (
                            heroBg.map((bg, idx) => (
                                <img
                                    key={`${bg}-${idx}`}
                                    src={bg}
                                    alt=""
                                    aria-hidden="true"
                                    className={`absolute inset-0 h-full w-full object-cover ${bg.position || 'object-center'} transition-opacity duration-1000 ease-in-out ${
                                        currentImage === idx
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    }`}
                                />
                            ))
                        ) : (
                            <img
                                src={heroBg}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
                            />
                        )}

                        {/* LEFT OVERLAY */}
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(37,6,1,0.42)_0%,rgba(37,6,1,0.20)_45%,rgba(0,0,0,0)_100%)]" />

                        {/* GENERAL OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
                    </>
                )}

                {/* NAVIGATION */}
                <header className="absolute inset-x-0 top-0 z-50 w-full px-6 py-5 md:px-10 lg:px-12">
                    <Navigation lightBg={!heroBg && lightNav} />
                </header>

                {/* HERO CONTENT */}
                <div className="relative z-10 flex w-full max-w-[1320px] flex-1 items-end justify-start px-6 pb-20 pt-28 md:px-10 md:pt-36 lg:px-12 lg:pb-24">
                    <div className="w-full">
                        {heroContent}
                    </div>
                </div>

                {/* SCROLL INDICATOR */}
                <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className="text-[11px] uppercase tracking-[0.32em] text-[#FDFDFD]/65">
                        Scroll to explore
                    </span>

                    <div className="relative h-12 w-px overflow-hidden bg-[#FDFDFD]/30">
                        <div className="scroll-line absolute left-0 top-0 h-full w-full bg-[#FDFDFD]" />
                    </div>
                </div>

                {/* SLIDER INDICATORS */}
                {isSlider && heroBg.length > 1 && (
                    <div className="absolute bottom-9 right-6 z-20 flex items-center gap-2 md:right-10 lg:right-12">
                        {heroBg.map((_, idx) => (
                            <span
                                key={idx}
                                className={`h-[2px] transition-all duration-500 ${
                                    currentImage === idx
                                        ? 'w-8 bg-white'
                                        : 'w-3 bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* PAGE CONTENT */}
            <div className="flex-grow px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-6">
                <div className="mx-auto flex max-w-[1400px] flex-col gap-4 md:gap-6">
                    {children}
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default PageLayout;
