import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';

const SERVICES = [
    'Website Development',
    'Web Hosting',
    'SMS Integration',
    'DLT Registration',
    'School Management App',
    'School Management Website',
    'Other',
];

const INFO = [
    {
        icon: Phone,
        label: 'Call Us',
        value: '+91 78422 04203',
        href:  'tel:+917842204203',
        accent: '#2563EB',
        bg:     '#EFF6FF',
    },
    {
        icon: Mail,
        label: 'Email Us',
        value: 'support@msinnovatics.com',
        href:  'mailto:support@msinnovatics.com',
        accent: '#7C3AED',
        bg:     '#F5F3FF',
    },
    {
        icon: Clock,
        label: 'Business Hours',
        value: 'Mon – Fri, 10 AM – 6 PM IST',
        href:  null,
        accent: '#059669',
        bg:     '#ECFDF5',
    },
    {
        icon: MapPin,
        label: 'Location',
        value: 'India',
        href:  null,
        accent: '#D97706',
        bg:     '#FFFBEB',
    },
];

export default function Contact() {
    const [form, setForm]     = useState({ name: '', email: '', phone: '', service: '', message: '' });
    const [sent, setSent]     = useState(false);
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setSent(true); }, 900);
    };

    return (
        <div className="max-w-5xl mx-auto px-2 py-12 space-y-14">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
                <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">Contact</p>
                <h1 className="font-display font-extrabold text-ink text-5xl lg:text-6xl leading-tight mb-5">
                    Let's Talk
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed">
                    Have a project in mind or a question? Drop us a message and we'll get back to you within 24 hours.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Info cards */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {INFO.map(({ icon: Icon, label, value, href, accent, bg }) => (
                        <div
                            key={label}
                            className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex gap-4 items-start"
                        >
                            <div
                                className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl transition-transform group-hover:scale-110 duration-200"
                                style={{ background: bg, color: accent }}
                            >
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                                {href ? (
                                    <a href={href} className="text-ink font-semibold text-sm hover:text-brand transition-colors">
                                        {value}
                                    </a>
                                ) : (
                                    <p className="text-ink font-semibold text-sm">{value}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Quick-response blurb */}
                    <div className="bg-ink rounded-2xl p-6 text-white">
                        <p className="font-display font-bold text-lg mb-2">Quick Response</p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            We respond to all enquiries within 24 business hours. For urgent matters, call us directly.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                    {sent ? (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-5">
                            <div className="bg-green-100 text-green-600 rounded-full p-5">
                                <CheckCircle2 size={40} />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-2xl text-ink mb-2">Message Sent!</h3>
                                <p className="text-gray-500 text-sm max-w-xs">
                                    Thank you for reaching out. We'll be in touch within 24 business hours.
                                </p>
                            </div>
                            <button
                                onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                                className="text-brand text-sm font-semibold hover:underline mt-2"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} className="space-y-5">
                            <div>
                                <h2 className="font-display font-bold text-2xl text-ink mb-1">Send a Message</h2>
                                <p className="text-gray-400 text-sm mb-6">Fill in the details and we'll take it from there.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        Full Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={onChange}
                                        required
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-ink focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={onChange}
                                        placeholder="+91 XXXXX XXXXX"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-ink focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Email Address <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={onChange}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-ink focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Service Interested In
                                </label>
                                <select
                                    name="service"
                                    value={form.service}
                                    onChange={onChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-ink focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
                                >
                                    <option value="">Select a service...</option>
                                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Message <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={onChange}
                                    required
                                    rows={5}
                                    placeholder="Tell us about your project or query..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-ink focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-blue-500/20 text-sm disabled:opacity-70 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : (
                                    <Send size={15} />
                                )}
                                {loading ? 'Sending…' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
