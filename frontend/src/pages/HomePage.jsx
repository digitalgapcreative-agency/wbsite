import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Layout
import Footer from '../components/layout/Footer.jsx';

// Resizable Navbar components
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../components/ui/resizable-navbar.jsx';

// Hero Parallax
import { HeroParallax } from '../components/ui/hero-parallax.jsx';

// Section components (content below parallax)
import { FamiliarSection } from '../features/home/components/FamiliarSection.jsx';
import { BuildingBrandsSection } from '../features/home/components/BuildingBrandsSection.jsx';
import { ApproachSection } from '../features/home/components/ApproachSection.jsx';
import { ProcessSection } from '../features/home/components/ProcessSection.jsx';
import { ClaritySection } from '../features/home/components/ClaritySection.jsx';
import { CtaSection } from '../features/home/components/CtaSection.jsx';
import { homeContent } from '../features/home/homeContent.js';

/* ─── Product thumbnails for parallax ───────────────────────────── */
const products = [
  {
    title: 'Brand Strategy',
    link: '/services',
    thumbnail: '/images/mockup_brand_strategy.png',
  },
  {
    title: 'Brand Identity',
    link: '/services',
    thumbnail: '/images/mockup_brand_identity.png',
  },
  {
    title: 'Marketing Strategy',
    link: '/services',
    thumbnail: '/images/mockup_marketing_strategy.png',
  },
  {
    title: 'Website Redesign',
    link: '/services',
    thumbnail: '/images/mockup_website_redesign.png',
  },
  {
    title: 'Brand Audit Report',
    link: '/services',
    thumbnail: '/images/mockup_brand_audit.png',
  },
  {
    title: 'Messaging Framework',
    link: '/services',
    thumbnail: '/images/mockup_messaging_framework.png',
  },
  {
    title: 'Social Brand Strategy',
    link: '/services',
    thumbnail: '/images/mockup_social_media.png',
  },
  {
    title: 'Design Direction',
    link: '/services',
    thumbnail: '/home_section_03.png',
  },
  {
    title: 'Brand Positioning',
    link: '/services',
    thumbnail: '/home_session_02.png',
  },
  {
    title: 'Strategic Discovery',
    link: '/consulting',
    thumbnail: '/consulting_approach.png',
  },
  {
    title: 'Identity System',
    link: '/services',
    thumbnail: '/images/Gemini_Generated_Image_id0z6cid0z6cid0z.jpeg',
  },
  {
    title: 'Campaign Direction',
    link: '/services',
    thumbnail: '/images/Gemini_Generated_Image_tgz1vatgz1vatgz1.jpeg',
  },
  {
    title: 'Visual Consulting',
    link: '/consulting',
    thumbnail: '/images/Gemini_Generated_Image_3th9ba3th9ba3th9.jpeg',
  },
  {
    title: 'Brand Rollout',
    link: '/services',
    thumbnail: '/images/mockup_brand_strategy.png',
  },
  {
    title: 'Growth Strategy',
    link: '/request-consultation',
    thumbnail: '/images/mockup_marketing_strategy.png',
  },
];

/* ─── Nav items ─────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { name: 'Solutions', link: '/services' },
  { name: 'Consulting', link: '/consulting' },
  { name: 'Insights', link: '/insights' },
];

/* ─── Hero header (rendered inside parallax) ────────────────────── */
const ParallaxHeader = () => (
  <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
    <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[#FDFDFD]/70 mb-5">
      {homeContent.hero.eyebrow}
    </p>
    <h1 className="text-4xl md:text-7xl font-medium leading-[1.05] tracking-[-0.02em] text-[#FDFDFD] max-w-[52rem]"
      style={{ fontFamily: "'DM Serif Display', 'Playfair Display', Georgia, serif" }}>
      {homeContent.hero.headingLine1}
      <br />
      {homeContent.hero.headingLine2}
    </h1>
    <p className="max-w-2xl text-base md:text-xl mt-8 text-[#FDFDFD]/70 font-sans font-light leading-relaxed">
      {homeContent.hero.description}
    </p>
    <div className="mt-10 flex flex-col sm:flex-row gap-4">
      <Link
        to="/request-consultation"
        id="hero-request-consultation-btn"
        className="inline-flex items-center justify-center gap-2 rounded-none bg-[#FDFDFD] px-8 py-4 text-sm font-semibold text-[#250601] shadow-lg transition-all duration-300 hover:bg-[#efe8dc] hover:shadow-xl active:scale-[0.98]"
      >
        Request a Consultation
      </Link>
      <Link
        to="/services"
        className="inline-flex items-center justify-center gap-2 rounded-none border border-[#FDFDFD]/35 px-8 py-4 text-sm font-semibold text-[#FDFDFD] transition-all duration-300 hover:border-[#FDFDFD]/70 hover:bg-[#FDFDFD]/10 active:scale-[0.98]"
      >
        Explore Solutions
      </Link>
    </div>
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleConsultClick = () => navigate('/request-consultation');

  return (
    <div className="min-h-screen font-sans" style={{ background: '#efe8dc', color: '#250601' }}>

      {/* GLOBAL NAV – fixed, renders on top of everything */}
      <Navbar>
        {/* Desktop */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={NAV_ITEMS} />
          <div className="flex items-center gap-3">
            <NavbarButton variant="secondary" href="/consulting">
              Contact
            </NavbarButton>
            <NavbarButton variant="primary" href="/request-consultation">
              Book a call
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-[#250601]/80 hover:bg-[#250601]/6 hover:text-[#250601] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full"
                href="/consulting"
              >
                Contact
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
                href="/request-consultation"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* HERO PARALLAX – top color: winery dark, transitions to cream */}
      <HeroParallax products={products} header={<ParallaxHeader />} />

      {/* CONTENT SECTIONS – cream/warm background */}
      <div className="px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-6" style={{ background: '#efe8dc' }}>
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 md:gap-6">
          <FamiliarSection />
          <BuildingBrandsSection />
          <ApproachSection />
          <ProcessSection />
          <ClaritySection />
          <CtaSection onConsultClick={handleConsultClick} />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
