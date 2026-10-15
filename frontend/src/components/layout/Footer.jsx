import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => (
    <footer className="mt-3 overflow-hidden rounded-[1.25rem] bg-[#250601] text-[#FDFDFD]">

        {/* CTA / Top */}
        <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-7 sm:flex-row sm:items-center sm:justify-between md:px-9 md:py-8">
            <div>
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40">
                    End of the journey
                </p>

                <p className="text-base font-medium tracking-[-0.02em] text-white md:text-lg">
                    Let's build something unforgettable.
                </p>
            </div>

            <Link
                to="/insights"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[11px] font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
            >
                View all articles
                <ArrowUpRight size={12} strokeWidth={1.8} />
            </Link>
        </div>


        {/* Main footer */}
        <div className="grid gap-8 px-6 py-8 sm:grid-cols-2 md:px-9 lg:grid-cols-[1.7fr_1fr_1fr] lg:gap-12">

            {/* Brand / Contact */}
            <div>
                <div className="mb-5">
                    <div className="font-display text-2xl tracking-[-0.04em] text-white">
                        DGAP
                    </div>

                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/40">
                        Strategic Growth Consultancy
                    </p>
                </div>

                <div className="space-y-2.5 text-[11px] text-white/55">

                    <div className="flex items-start gap-2.5">
                        <MapPin
                            size={13}
                            strokeWidth={1.5}
                            className="mt-0.5 shrink-0 text-white/35"
                        />
                        <span>
                            Jakarta · Sukabumi · Bandung — Indonesia
                        </span>
                    </div>

                    <a
                        href="tel:+6282311844027"
                        className="flex items-center gap-2.5 transition-colors hover:text-white"
                    >
                        <Phone
                            size={13}
                            strokeWidth={1.5}
                            className="shrink-0 text-white/35"
                        />
                        <span>+62 823-1184-4027</span>
                    </a>

                    <a
                        href="mailto:digitalgapcreative@gmail.com"
                        className="flex items-center gap-2.5 transition-colors hover:text-white"
                    >
                        <Mail
                            size={13}
                            strokeWidth={1.5}
                            className="shrink-0 text-white/35"
                        />
                        <span>digitalgapcreative@gmail.com</span>
                    </a>

                </div>
            </div>


            {/* Navigation */}
            <div>
                <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.25em] text-white/35">
                    Navigation
                </p>

                <nav className="flex flex-col gap-2.5">
                    <Link
                        to="/"
                        className="w-fit text-[11px] text-white/60 transition-colors hover:text-white"
                    >
                        Home
                    </Link>

                    <Link
                        to="/services"
                        className="w-fit text-[11px] text-white/60 transition-colors hover:text-white"
                    >
                        Solutions
                    </Link>

                    <Link
                        to="/consulting"
                        className="w-fit text-[11px] text-white/60 transition-colors hover:text-white"
                    >
                        Consulting
                    </Link>

                    <Link
                        to="/insights"
                        className="w-fit text-[11px] text-white/60 transition-colors hover:text-white"
                    >
                        Insights
                    </Link>
                </nav>
            </div>


            {/* Socials */}
            <div>
                <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.25em] text-white/35">
                    Follow us
                </p>

                <div className="flex flex-col gap-2.5">

                    <a
                        href="#"
                        aria-label="Facebook"
                        className="group flex w-fit items-center gap-2.5 text-[11px] text-white/60 transition-colors hover:text-white"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1877F2] text-[11px] font-bold text-white">
                            f
                        </span>
                        Facebook
                        <ArrowUpRight
                            size={10}
                            className="opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>

                    <a
                        href="#"
                        aria-label="Instagram"
                        className="group flex w-fit items-center gap-2.5 text-[11px] text-white/60 transition-colors hover:text-white"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-[11px] font-bold text-white">
                            ◎
                        </span>
                        Instagram
                        <ArrowUpRight
                            size={10}
                            className="opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>

                    <a
                        href="#"
                        aria-label="LinkedIn"
                        className="group flex w-fit items-center gap-2.5 text-[11px] text-white/60 transition-colors hover:text-white"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A66C2] text-[10px] font-bold text-white">
                            in
                        </span>
                        LinkedIn
                        <ArrowUpRight
                            size={10}
                            className="opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>

                </div>
            </div>

        </div>


        {/* Bottom */}
        <div className="flex flex-col gap-2 border-t border-white/10 px-6 py-4 text-[9px] text-white/30 sm:flex-row sm:items-center sm:justify-between md:px-9">

            <p>
                © {new Date().getFullYear()} DGAP — Digital Gap Creative. All rights reserved.
            </p>

            <p className="uppercase tracking-[0.2em]">
                Strategic Growth Consultancy
            </p>

        </div>

    </footer>
);

export default Footer;
