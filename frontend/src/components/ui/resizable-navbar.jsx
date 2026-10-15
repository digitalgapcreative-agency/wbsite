import { useState, createContext, useContext } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

/* ─── Context to share scrolled state with children ─────────────── */
const NavContext = createContext({ scrolled: false });
const useNavContext = () => useContext(NavContext);

/* ─── Main Navbar shell ─────────────────────────────────────────── */
export const Navbar = ({ children }) => {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 80);
    });

    return (
        <NavContext.Provider value={{ scrolled, mobileOpen, setMobileOpen }}>
            <div className="fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none">
                <motion.nav
                    className="relative flex flex-col w-full pointer-events-auto"
                    animate={{
                        maxWidth: scrolled ? "920px" : "1440px",
                        marginTop: scrolled ? "12px" : "0px",
                        borderRadius: scrolled ? "9999px" : "0px",
                        paddingLeft: scrolled ? "20px" : "48px",
                        paddingRight: scrolled ? "20px" : "48px",
                        paddingTop: scrolled ? "10px" : "20px",
                        paddingBottom: scrolled ? "10px" : "20px",
                        backgroundColor: scrolled ? "rgba(253,253,253,0.95)" : "rgba(0,0,0,0)",
                        boxShadow: scrolled
                            ? "0 8px 32px rgba(37,6,1,0.10), 0 0 0 1px rgba(37,6,1,0.06)"
                            : "none",
                        backdropFilter: scrolled ? "blur(18px)" : "blur(0px)",
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                    {children}
                </motion.nav>
            </div>
        </NavContext.Provider>
    );
};

/* ─── Desktop body ──────────────────────────────────────────────── */
export const NavBody = ({ children }) => (
    <div className="hidden md:flex items-center justify-between w-full gap-6">
        {children}
    </div>
);

/* ─── Logo ──────────────────────────────────────────────────────── */
export const NavbarLogo = () => {
    const { scrolled } = useNavContext();
    return (
        <Link to="/" id="nav-logo" className="flex items-center gap-2.5 flex-shrink-0">
            <div
                className="flex h-9 w-9 items-center justify-center rounded-full border p-1.5 transition-all duration-300"
                style={{
                    borderColor: scrolled ? "rgba(37,6,1,0.15)" : "rgba(253,253,253,0.25)",
                    background: scrolled ? "rgba(37,6,1,0.06)" : "rgba(253,253,253,0.12)",
                }}
            >
                <img src="/dgap-logo-exact.svg" alt="DGAP logo" className="h-full w-auto object-contain" />
            </div>
            <span
                className="hidden sm:block font-semibold text-sm tracking-wide transition-colors duration-300"
                style={{ color: scrolled ? "#250601" : "#FDFDFD" }}
            >
                Digital Gap
            </span>
        </Link>
    );
};

/* ─── Nav items (desktop) ───────────────────────────────────────── */
export const NavItems = ({ items }) => {
    const { scrolled } = useNavContext();
    const location = useLocation();

    return (
        <div
            className="flex items-center gap-1 rounded-full border px-2 py-1.5"
            style={{
                borderColor: scrolled ? "rgba(37,6,1,0.10)" : "rgba(253,253,253,0.18)",
                background: scrolled ? "rgba(37,6,1,0.04)" : "rgba(253,253,253,0.10)",
                backdropFilter: "blur(8px)",
            }}
        >
            {items.map(({ name, link }) => {
                const isActive =
                    location.pathname === link ||
                    (link.startsWith("#") && location.hash === link);
                const isHash = link.startsWith("#");
                const activeStyle = scrolled
                    ? { background: "#250601", color: "#FDFDFD" }
                    : { background: "rgba(253,253,253,0.95)", color: "#250601" };
                const idleColor = scrolled ? "rgba(37,6,1,0.65)" : "rgba(253,253,253,0.75)";

                const cls = "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200";

                return isHash ? (
                    <a
                        key={name}
                        href={link}
                        className={cls}
                        style={isActive ? activeStyle : { color: idleColor }}
                    >
                        {name}
                    </a>
                ) : (
                    <Link
                        key={name}
                        to={link}
                        className={cls}
                        style={isActive ? activeStyle : { color: idleColor }}
                    >
                        {name}
                    </Link>
                );
            })}
        </div>
    );
};

/* ─── CTA buttons ───────────────────────────────────────────────── */
export const NavbarButton = ({
    children,
    variant = "primary",
    className = "",
    onClick,
    href,
}) => {
    const { scrolled } = useNavContext();
    const base =
        "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer";

    const styles =
        variant === "primary"
            ? scrolled
                ? { background: "#250601", color: "#FDFDFD" }
                : { background: "rgba(253,253,253,0.95)", color: "#250601" }
            : scrolled
                ? { border: "1.5px solid rgba(37,6,1,0.22)", color: "#250601", background: "transparent" }
                : { border: "1.5px solid rgba(253,253,253,0.45)", color: "#FDFDFD", background: "transparent" };

    const Tag = href ? "a" : "button";
    return (
        <Tag href={href} onClick={onClick} className={`${base} ${className}`} style={styles}>
            {children}
        </Tag>
    );
};

/* ─── Mobile nav wrappers ───────────────────────────────────────── */
export const MobileNav = ({ children }) => (
    <div className="md:hidden relative flex items-center justify-between w-full">
        {children}
    </div>
);

export const MobileNavHeader = ({ children }) => (
    <div className="flex items-center justify-between w-full">{children}</div>
);

export const MobileNavToggle = ({ isOpen, onClick }) => {
    const { scrolled } = useNavContext();
    return (
        <button
            onClick={onClick}
            aria-label="Toggle navigation menu"
            className="rounded-full p-2 border transition-all duration-300"
            style={{
                borderColor: scrolled ? "rgba(37,6,1,0.15)" : "rgba(253,253,253,0.25)",
                background: scrolled ? "rgba(37,6,1,0.06)" : "rgba(253,253,253,0.12)",
                color: scrolled ? "#250601" : "#FDFDFD",
            }}
        >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
    );
};

export const MobileNavMenu = ({ isOpen, onClose, children }) => {
    return (
        <motion.div
            initial={false}
            animate={isOpen ? { opacity: 1, y: 0, pointerEvents: "auto" } : { opacity: 0, y: -8, pointerEvents: "none" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex flex-col gap-2 border border-[#250601]/10 bg-[#FDFDFD]/97 p-4 shadow-2xl backdrop-blur-lg"
            style={{ borderRadius: "1rem" }}
        >
            {children}
        </motion.div>
    );
};
