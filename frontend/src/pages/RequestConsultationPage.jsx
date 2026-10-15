import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    MessageCircle,
    Video,
    Phone,
    CheckCircle2,
    User,
    Building2,
    Sparkles,
    Send,
    AlertCircle,
} from 'lucide-react';
import Navigation from '../components/layout/Navigation.jsx';
import Footer from '../components/layout/Footer.jsx';

// ─── Channel Options ──────────────────────────────────────────────────────────
const CHANNELS = [
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        description: 'Quick async chat',
        icon: MessageCircle,
        color: 'from-[#25D366]/20 to-[#128C7E]/10',
        ring: 'ring-[#25D366]',
        iconColor: 'text-[#25D366]',
    },
    {
        id: 'video',
        label: 'Video Call',
        description: 'Google Meet / Zoom',
        icon: Video,
        color: 'from-[#4F8EF7]/20 to-[#3461D1]/10',
        ring: 'ring-[#4F8EF7]',
        iconColor: 'text-[#4F8EF7]',
    },
    {
        id: 'phone',
        label: 'Phone Call',
        description: 'Direct conversation',
        icon: Phone,
        color: 'from-[#250601]/12 to-[#250601]/5',
        ring: 'ring-[#250601]',
        iconColor: 'text-[#250601]',
    },
    {
        id: 'email',
        label: 'Email',
        description: 'Detailed exchange',
        icon: Mail,
        color: 'from-[#C4C2B9]/30 to-[#C4C2B9]/10',
        ring: 'ring-[#C4C2B9]',
        iconColor: 'text-[#250601]/70',
    },
];

const SERVICES = [
    'Brand Strategy',
    'Digital Marketing',
    'Content Creation',
    'Social Media',
    'SEO & Growth',
    'Paid Advertising',
    'Web Presence',
    'Other',
];

const INITIAL = {
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    service: '',
    challenge: '',
    channel: '',
    website: '',
};

// ─── Field Input Component ────────────────────────────────────────────────────
const Field = ({ label, required, children, hint }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#250601]/80 tracking-wide">
            {label}
            {required && <span className="ml-1 text-[#250601]">*</span>}
        </label>
        {children}
        {hint && <p className="text-xs text-[#250601]/40">{hint}</p>}
    </div>
);

const inputCls =
    'w-full rounded-xl border border-[#C4C2B9]/50 bg-white/60 px-4 py-3.5 text-[#250601] placeholder-[#250601]/30 text-sm transition-all duration-200 focus:border-[#250601]/60 focus:outline-none focus:ring-2 focus:ring-[#250601]/10 focus:bg-white/80 hover:border-[#250601]/30';

// ─── Thank You Screen ─────────────────────────────────────────────────────────
const ThankYou = ({ name, channel }) => {
    const ch = CHANNELS.find((c) => c.id === channel);
    return (
        <div className="flex flex-col items-center gap-6 py-8 text-center">
            {/* Animated check */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#250601]/10 to-[#250601]/5">
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        animation: 'ping-once 0.6s ease-out forwards',
                        background: 'rgba(37,6,1,0.08)',
                    }}
                />
                <CheckCircle2 size={44} className="text-[#250601] drop-shadow-sm" />
            </div>

            <div>
                <h2 className="font-display text-3xl md:text-4xl text-[#250601] leading-tight">
                    Thank you, {name?.split(' ')[0] || 'there'}!
                </h2>
                <p className="mt-3 text-[#250601]/60 text-base max-w-md mx-auto leading-relaxed">
                    Your request has been received. Our team will reach out within{' '}
                    <strong className="text-[#250601]/80">48 hours</strong>
                    {ch ? (
                        <>
                            {' '}via{' '}
                            <span className="font-semibold text-[#250601]">{ch.label}</span>
                        </>
                    ) : (
                        ''
                    )}.
                </p>
            </div>

            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-full bg-[#250601] px-7 py-3.5 text-sm font-semibold text-[#FDFDFD] shadow-[0_12px_30px_rgba(37,6,1,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#250601]/90"
                >
                    Back to Home
                </Link>
                <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-[#C4C2B9]/50 px-7 py-3.5 text-sm font-semibold text-[#250601] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#250601]/30 hover:bg-white/60"
                >
                    Explore Solutions
                </Link>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const RequestConsultationPage = () => {
    const [form, setForm] = useState(INITIAL);
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleChannel = (id) => {
        setForm((prev) => ({ ...prev, channel: id }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.channel) {
            setErrorMsg('Please select a preferred communication channel.');
            return;
        }
        setStatus('loading');
        setErrorMsg('');
        try {
            const res = await fetch('/api/consultation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Something went wrong.');
            }
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#efe8dc] font-sans text-[#250601]">
            {/* ── Sticky Nav ── */}
            <header className="sticky top-0 z-50 w-full px-6 py-5 md:px-10 lg:px-12">
                <Navigation lightBg />
            </header>

            {/* ── Page wrapper ── */}
            <main className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-0 px-4 pb-20 pt-8 md:px-8 lg:flex-row lg:gap-16 lg:px-12 lg:pt-14">

                {/* ── Left Column – Hero copy ── */}
                <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:h-fit lg:max-w-[420px] lg:flex-shrink-0 lg:pt-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#250601]/50 transition-colors hover:text-[#250601]"
                    >
                        <ArrowLeft size={15} />
                        Back to Home
                    </Link>

                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#250601]/10 bg-white/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#250601]/70 backdrop-blur-sm">
                            <Sparkles size={10} />
                            Free Discovery Session
                        </span>
                        <h1 className="font-display mt-5 text-[2.6rem] leading-[1.05] tracking-[-0.02em] text-[#250601] md:text-[3.2rem] lg:text-[3.8rem]">
                            Let's Talk
                            <br />
                            <em className="not-italic text-[#250601]/50">About Your</em>
                            <br />
                            Growth.
                        </h1>
                        <p className="mt-5 text-[#250601]/65 leading-relaxed text-base max-w-sm">
                            Fill in the form and choose how you'd like to connect. We respond within{' '}
                            <strong className="text-[#250601]/80">48 hours</strong>, and the first conversation is always on us.
                        </p>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-col gap-3">
                        {[
                            { text: 'Tailored to your specific challenges' },
                            { text: 'No commitment, no hard sell' },
                            { text: 'Response within 48 hours guaranteed' },
                        ].map(({ text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <span className="h-1 w-1 rounded-full bg-[#250601]/30 flex-shrink-0"></span>
                                <span className="text-sm text-[#250601]/60">{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Decorative card */}
                    <div className="hidden rounded-2xl border border-[#250601]/08 bg-white/50 p-5 backdrop-blur-sm lg:block">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#250601]/40">What Happens Next</p>
                        <ol className="mt-3 flex flex-col gap-3">
                            {[
                                'We review your request within 24h',
                                'Our strategist reaches out on your chosen channel',
                                'We run a free 30-min discovery session',
                                'You receive a tailored roadmap',
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-[#250601]/70">
                                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#250601]/08 text-[10px] font-bold text-[#250601]">
                                        {i + 1}
                                    </span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>
                </aside>

                {/* ── Right Column – Form card ── */}
                <div className="flex-1 lg:pt-4">
                    <div className="rounded-2xl border border-[#C4C2B9]/30 bg-white/60 p-6 shadow-[0_24px_64px_rgba(37,6,1,0.06)] backdrop-blur-sm md:p-10">

                        {status === 'success' ? (
                            <ThankYou name={form.name} channel={form.channel} />
                        ) : (
                            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">

                                {/* Honeypot anti-spam: deve permanecer vazio */}
                                <div
                                    aria-hidden="true"
                                    style={{
                                        position: 'absolute',
                                        left: '-10000px',
                                        width: '1px',
                                        height: '1px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <label htmlFor="website">Website</label>
                                    <input
                                        id="website"
                                        name="website"
                                        type="text"
                                        value={form.website}
                                        onChange={handleChange}
                                        tabIndex="-1"
                                        autoComplete="off"
                                    />
                                </div>

                                {/* ── Section: About You ── */}
                                <div>
                                    <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#250601]/40">
                                        <User size={12} />
                                        About You
                                    </p>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Full Name" required>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Jane Smith"
                                                className={inputCls}
                                            />
                                        </Field>
                                        <Field label="Company / Organisation">
                                            <div className="relative">
                                                <Building2
                                                    size={15}
                                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#250601]/30"
                                                />
                                                <input
                                                    id="company"
                                                    name="company"
                                                    type="text"
                                                    value={form.company}
                                                    onChange={handleChange}
                                                    placeholder="Acme Corp (optional)"
                                                    className={`${inputCls} pl-9`}
                                                />
                                            </div>
                                        </Field>
                                    </div>
                                </div>

                                {/* ── Section: Contact Details ── */}
                                <div>
                                    <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#250601]/40">
                                        <Mail size={12} />
                                        Contact Details
                                    </p>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <Field label="Email Address" required>
                                            <div className="relative">
                                                <Mail
                                                    size={15}
                                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#250601]/30"
                                                />
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder="jane@company.com"
                                                    className={`${inputCls} pl-9`}
                                                />
                                            </div>
                                        </Field>
                                        <Field
                                            label="WhatsApp Number"
                                            hint="Include country code, e.g. +351 912 345 678"
                                        >
                                            <div className="relative">
                                                <MessageCircle
                                                    size={15}
                                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#25D366]"
                                                />
                                                <input
                                                    id="whatsapp"
                                                    name="whatsapp"
                                                    type="tel"
                                                    value={form.whatsapp}
                                                    onChange={handleChange}
                                                    placeholder="+351 912 345 678"
                                                    className={`${inputCls} pl-9`}
                                                />
                                            </div>
                                        </Field>
                                    </div>
                                </div>

                                {/* ── Section: Your Challenge ── */}
                                <div>
                                    <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#250601]/40">
                                        <Sparkles size={12} />
                                        Your Situation
                                    </p>
                                    <div className="flex flex-col gap-4">
                                        <Field label="Area of Interest">
                                            <select
                                                id="service"
                                                name="service"
                                                value={form.service}
                                                onChange={handleChange}
                                                className={`${inputCls} cursor-pointer appearance-none`}
                                            >
                                                <option value="">Select a topic…</option>
                                                {SERVICES.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                        <Field label="What challenge are you facing?" required>
                                            <textarea
                                                id="challenge"
                                                name="challenge"
                                                required
                                                value={form.challenge}
                                                onChange={handleChange}
                                                placeholder="Briefly describe what's holding your business back, your goals, or what you're looking to achieve…"
                                                rows={5}
                                                className={`${inputCls} resize-none`}
                                            />
                                        </Field>
                                    </div>
                                </div>

                                {/* ── Section: Preferred Channel ── */}
                                <div>
                                    <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#250601]/40">
                                        <Phone size={12} />
                                        Preferred Communication
                                        <span className="text-[#250601]">*</span>
                                    </p>
                                    <p className="mb-4 text-xs text-[#250601]/40">
                                        How would you like us to reach out?
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {CHANNELS.map(({ id, label, description, icon: Icon, color, ring, iconColor }) => {
                                            const selected = form.channel === id;
                                            return (
                                                <button
                                                    key={id}
                                                    type="button"
                                                    onClick={() => handleChannel(id)}
                                                    className={`group relative flex flex-col items-center gap-2.5 rounded-xl border p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${selected
                                                        ? `border-transparent bg-gradient-to-br ${color} ring-2 ${ring} shadow-md`
                                                        : 'border-[#C4C2B9]/40 bg-white/40 hover:border-[#C4C2B9]/80 hover:bg-white/60'
                                                        }`}
                                                >
                                                    <div
                                                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${selected
                                                            ? 'bg-white/70 shadow-sm'
                                                            : 'bg-[#250601]/05 group-hover:bg-white/50'
                                                            }`}
                                                    >
                                                        <Icon size={18} className={iconColor} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#250601]">{label}</p>
                                                        <p className="text-[10px] text-[#250601]/50 leading-tight">{description}</p>
                                                    </div>
                                                    {selected && (
                                                        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#250601] shadow-sm">
                                                            <CheckCircle2 size={10} className="text-white" />
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Error ── */}
                                {(status === 'error' || errorMsg) && (
                                    <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        <AlertCircle size={16} className="flex-shrink-0" />
                                        {errorMsg || 'Something went wrong. Please try again.'}
                                    </div>
                                )}

                                {/* ── Submit ── */}
                                <div className="flex items-center justify-between gap-4 border-t border-[#C4C2B9]/30 pt-6">
                                    <p className="text-xs text-[#250601]/40 leading-relaxed max-w-xs">
                                        By submitting, you agree to be contacted by our team. No spam, ever.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        id="submit-consultation-btn"
                                        className="group inline-flex flex-shrink-0 items-center gap-2.5 rounded-full bg-[#250601] px-8 py-4 text-sm font-semibold text-[#FDFDFD] shadow-[0_16px_40px_rgba(37,6,1,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#250601]/90 hover:shadow-[0_20px_48px_rgba(37,6,1,0.28)] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <span
                                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                                />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                Send Request
                                                <Send
                                                    size={16}
                                                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            {/* ── Footer ── */}
            <div className="px-4 md:px-8 lg:px-12">
                <Footer />
            </div>

            <style>{`
                @keyframes ping-once {
                    0%   { transform: scale(1);   opacity: 0.4; }
                    70%  { transform: scale(1.5); opacity: 0; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .font-display {
                    font-family: 'DM Serif Display', 'Playfair Display', Georgia, serif;
                }
            `}</style>
        </div>
    );
};

export default RequestConsultationPage;
