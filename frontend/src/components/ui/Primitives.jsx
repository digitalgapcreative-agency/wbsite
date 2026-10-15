// ─── Shared Primitive Components ──────────────────────────────────────────────

export const Badge = ({ children, darkMode = false }) => (
    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] ${darkMode
            ? 'border-[#FDFDFD]/15 bg-[#FDFDFD]/5 text-[#FDFDFD]/80'
            : 'border-[#C4C2B9]/30 bg-[#FDFDFD] text-[#250601]'
        }`}>
        {children}
    </span>
);

export const PillButton = ({
    children,
    primary = true,
    onClick,
    type = 'button',
    disabled = false,
}) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${primary
                ? 'bg-[#250601] text-[#FDFDFD] shadow-[0_12px_30px_rgba(37,6,1,0.12)] hover:-translate-y-0.5 hover:bg-[#250601]/90'
                : 'border border-[#C4C2B9]/30 bg-[#FDFDFD] text-[#250601] hover:-translate-y-0.5 hover:bg-[#FDFDFD]/80'
            }`}
    >
        {children}
    </button>
);

export const InputField = ({ label, name, type = 'text', value, onChange, required, placeholder }) => (
    <div className="flex flex-col gap-1">
        {label && (
            <label htmlFor={name} className="text-sm font-medium text-[#250601]/80">
                {label} {required && <span className="text-[#250601]">*</span>}
            </label>
        )}
        {type === 'textarea' ? (
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                rows={4}
                className="w-full resize-none rounded-2xl border border-[#C4C2B9]/50 bg-[#FDFDFD]/70 px-4 py-3 text-[#250601] placeholder-[#250601]/30 transition focus:border-[#250601] focus:outline-none focus:ring-2 focus:ring-[#250601]/10"
            />
        ) : (
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-[#C4C2B9]/50 bg-[#FDFDFD]/70 px-4 py-3 text-[#250601] placeholder-[#250601]/30 transition focus:border-[#250601] focus:outline-none focus:ring-2 focus:ring-[#250601]/10"
            />
        )}
    </div>
);

export const SectionContainer = ({ children, className = '', whiteBg = true, id }) => (
    <section
        id={id}
        className={`w-full overflow-hidden ${whiteBg ? 'bg-[#FDFDFD]' : ''} ${className}`}
    >
        {children}
    </section>
);
