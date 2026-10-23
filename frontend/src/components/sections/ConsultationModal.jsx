
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { PillButton, InputField } from '../ui/Primitives.jsx';
import { useState } from 'react';
import { openConsultationEmail } from '../../utils/consultationEmail.js';

const INITIAL_VALUES = { name: '', email: '', company: '', challenge: '', website: '' };

const ConsultationModal = ({ onClose }) => {
    const [values, setValues] = useState(INITIAL_VALUES);
    const [status, setStatus] = useState('idle');
    const message = 'Complete and send the email in your email app. This website has not sent your request.';

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        openConsultationEmail(values);
        setStatus('success');
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Modal panel */}
            <div className="relative bg-[#FDFDFD] rounded-none p-8 md:p-12 w-full max-w-lg shadow-2xl z-100">
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-6 right-6 text-[#250601]/40 hover:text-[#250601] transition-colors"
                >
                    <X size={22} />
                </button>

                <h2 className="text-3xl font-medium text-[#250601] mb-2">Request a Consultation</h2>
                <p className="text-sm text-[#250601]/60 mb-8">
                    Fill in your details to prepare an email. You must send it from your email app.
                </p>

                {status === 'success' ? (
                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                        <CheckCircle2 size={48} className="text-[#250601]" />
                        <p className="text-lg font-medium">{message}</p>
                        <a href="mailto:agency@digitalgapco.com" className="underline">
                            agency@digitalgapco.com
                        </a>
                        <PillButton onClick={() => setStatus('idle')}>Back to details</PillButton>
                        <PillButton onClick={onClose}>Close</PillButton>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                                value={values.website}
                                onChange={handleChange}
                                tabIndex="-1"
                                autoComplete="off"
                            />
                        </div>

                        <InputField label="Full name" name="name" value={values.name} onChange={handleChange} required placeholder="Jane Smith" />
                        <InputField label="Email address" name="email" type="email" value={values.email} onChange={handleChange} required placeholder="jane@company.com" />
                        <InputField label="Company" name="company" value={values.company} onChange={handleChange} placeholder="Acme Corp (optional)" />
                        <InputField label="What challenge are you facing?" name="challenge" type="textarea" value={values.challenge} onChange={handleChange} placeholder="Briefly describe what's holding your business back…" />

                        {status === 'error' && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-none">
                                <AlertCircle size={16} /> {message}
                            </div>
                        )}

                        <div className="flex justify-end mt-2">
                            <PillButton type="submit" disabled={status === 'loading'}>
                                {status === 'loading' ? 'Preparing…' : 'Prepare Email'}
                            </PillButton>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ConsultationModal;
