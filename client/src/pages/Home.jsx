import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Globe, Server, MessageSquare, FileCheck, GraduationCap,
    Laptop, ArrowRight, ArrowUpRight,
    Phone, Mail, Zap, ShieldCheck, Clock, HeartHandshake
} from 'lucide-react';

/* ─── data ─────────────────────────────────────────── */

const SERVICES = [
    {
        icon: Globe,
        label: 'Website Development',
        desc:  'Modern, responsive websites built for performance — from marketing pages to full web applications.',
        accent: '#2563EB',
        bg:     '#EFF6FF',
    },
    {
        icon: Server,
        label: 'Web Hosting',
        desc:  'Reliable, fast, and secure hosting with maximum uptime, SSL, and dedicated support.',
        accent: '#7C3AED',
        bg:     '#F5F3FF',
    },
    {
        icon: MessageSquare,
        label: 'SMS Integration',
        desc:  'Integrate SMS APIs for OTP, alerts, notifications, and bulk messaging campaigns.',
        accent: '#059669',
        bg:     '#ECFDF5',
    },
    {
        icon: FileCheck,
        label: 'DLT Registration',
        desc:  'End-to-end TRAI DLT compliance — sender IDs, templates, and entity registration.',
        accent: '#D97706',
        bg:     '#FFFBEB',
    },
    {
        icon: GraduationCap,
        label: 'School Management App',
        desc:  'Attendance, timetables, fee collection, parent communication — all in one mobile app.',
        accent: '#DC2626',
        bg:     '#FEF2F2',
    },
    {
        icon: Laptop,
        label: 'School Management Website',
        desc:  'Admin dashboards, teacher & student portals, and real-time analytics for your institution.',
        accent: '#0891B2',
        bg:     '#ECFEFF',
    },
];

const WHY = [
    { icon: Zap,            title: 'On-Time Delivery',    desc: 'We respect deadlines — your launch date is our commitment.' },
    { icon: ShieldCheck,    title: 'Transparent Process', desc: 'Clear milestones, regular updates, zero surprises.' },
    { icon: Clock,          title: 'Ongoing Support',     desc: 'We stay with you after launch for fixes, updates, and growth.' },
    { icon: HeartHandshake, title: 'Competitive Pricing', desc: 'Quality solutions at rates that make sense for your business.' },
];

const STATS = [
    { value: '1+',   label: 'Happy Client'     },
    { value: '6+',   label: 'Services Offered' },
    { value: '100%', label: 'Satisfaction Goal' },
];

/* ─── counter hook ──────────────────────────────────── */
function StatCounter({ value }) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            const num    = parseInt(value);
            const suffix = value.replace(String(num), '');
            if (isNaN(num)) { el.textContent = value; return; }
            let start = 0;
            const step = num / (900 / 16);
            const tick = () => {
                start = Math.min(start + step, num);
                el.textContent = Math.ceil(start) + suffix;
                if (start < num) requestAnimationFrame(tick);
            };
            tick();
        }, { threshold: 0.5 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [value]);
    return <span ref={ref}>{value}</span>;
}

/* ─── page ──────────────────────────────────────────── */

export default function Home() {
    return (
        <div className="overflow-x-hidden">

            {/* ════════════════════ HERO ════════════════════════════════ */}
            <section className="relative min-h-[88vh] flex items-center bg-ink overflow-hidden -mx-4 -mt-8 px-4">

                {/* dot-grid */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(96,165,250,0.13) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                {/* glow blobs */}
                <div className="absolute top-[-8rem] left-[58%] w-[36rem] h-[36rem] rounded-full bg-blue-600 opacity-[0.13] blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-6rem] left-[-4rem] w-[28rem] h-[28rem] rounded-full bg-violet-700 opacity-[0.10] blur-[80px] pointer-events-none" />

                <div className="relative z-10 max-w-6xl mx-auto w-full py-28 lg:py-36">
                    <div className="max-w-3xl">

                        <span className="anim-0 inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/12 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                            Technology Partner for Growing Businesses
                        </span>

                        <h1 className="anim-1 font-display font-extrabold text-white leading-[1.08] text-5xl sm:text-6xl lg:text-7xl mb-7">
                            Building Digital{' '}
                            <span className="shimmer-text">Solutions</span>
                            <br />That Drive Growth
                        </h1>

                        <p className="anim-2 text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
                            MS Innovatics delivers end-to-end technology services — custom websites, school management systems, SMS integration, and DLT compliance.
                        </p>

                        <div className="anim-3 flex flex-wrap gap-3">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-brand-dark active:scale-95 transition-all shadow-lg shadow-blue-700/40 text-sm"
                            >
                                Get a Free Quote <ArrowRight size={16} />
                            </Link>
                            <a
                                href="#services"
                                className="inline-flex items-center gap-2 bg-white/8 text-white border border-white/15 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/14 transition-all text-sm"
                            >
                                Our Services
                            </a>
                        </div>
                    </div>
                </div>

                {/* bottom fade to page bg */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none" />
            </section>

            {/* ════════════════ SERVICES ════════════════════════════════ */}
            <section id="services" className="max-w-6xl mx-auto pt-24 pb-20 px-2">
                <div className="mb-14">
                    <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">What We Do</p>
                    <h2 className="font-display font-bold text-ink text-4xl lg:text-5xl leading-tight max-w-xl">
                        Services Built Around Your Needs
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SERVICES.map(({ icon: Icon, label, desc, accent, bg }, i) => (
                        <article
                            key={i}
                            className="group relative bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden"
                        >
                            {/* hover tint */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                                style={{ background: `linear-gradient(135deg, ${bg}99 0%, transparent 65%)` }}
                            />

                            <div
                                className="relative z-10 inline-flex items-center justify-center rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110"
                                style={{ background: bg, color: accent, width: 52, height: 52 }}
                            >
                                <Icon size={23} />
                            </div>

                            <h3 className="relative z-10 font-display font-bold text-ink text-lg mb-2">{label}</h3>
                            <p className="relative z-10 text-gray-500 text-sm leading-relaxed">{desc}</p>

                            <div
                                className="relative z-10 mt-5 inline-flex items-center gap-1 text-xs font-semibold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                                style={{ color: accent }}
                            >
                                Learn more <ArrowUpRight size={13} />
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* ════════════════ WHY US ══════════════════════════════════ */}
            <section className="bg-ink -mx-4 px-4 py-24 relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(96,165,250,0.07) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="absolute top-0 right-[18%] w-[30rem] h-[30rem] bg-blue-700 opacity-10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        <div>
                            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3">Why MS Innovatics</p>
                            <h2 className="font-display font-bold text-white text-4xl lg:text-5xl leading-tight mb-6">
                                We Don't Just Build.<br />We Partner.
                            </h2>
                            <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-md">
                                We combine sharp technical skills with a genuine understanding of your business — so you get a solution that actually works.
                            </p>
                            <ul className="space-y-5">
                                {WHY.map(({ icon: Icon, title, desc }) => (
                                    <li key={title} className="flex items-start gap-4">
                                        <span className="flex-shrink-0 bg-white/8 border border-white/10 p-2.5 rounded-xl text-blue-400">
                                            <Icon size={18} />
                                        </span>
                                        <div>
                                            <p className="text-white font-semibold text-sm mb-0.5">{title}</p>
                                            <p className="text-gray-500 text-sm">{desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 gap-4">
                            {STATS.map(({ value, label }) => (
                                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center gap-6 hover:bg-white/8 transition-colors">
                                    <span className="font-display font-extrabold text-white text-5xl tabular-nums">
                                        <StatCounter value={value} />
                                    </span>
                                    <span className="text-gray-400 text-base">{label}</span>
                                </div>
                            ))}

                            <div className="bg-brand rounded-2xl p-8 border border-brand-light/20">
                                <p className="font-display font-bold text-white text-xl mb-2">Ready to get started?</p>
                                <p className="text-blue-100 text-sm mb-5">Let's build something remarkable together.</p>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 bg-white text-brand font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all"
                                >
                                    Talk to Us <ArrowRight size={15} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════ CLIENTS ═════════════════════════════════ */}
            <section id="clients" className="max-w-6xl mx-auto py-24 px-2">
                <div className="text-center mb-14">
                    <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">Our Clients</p>
                    <h2 className="font-display font-bold text-ink text-4xl lg:text-5xl">Trusted By Organisations</h2>
                </div>

                <div className="flex justify-center">
                    <div className="group bg-white border border-gray-100 rounded-2xl px-12 py-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center gap-6 min-w-[280px]">

                        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                            SPROUT SCHOOL LOGO
                            ─────────────────────────────────────────────
                            To add the logo:
                              1. Drop the file at:
                                 client/public/clients/sprout-school.png
                              2. Replace the <div> below with:

                                 <img
                                   src="/clients/sprout-school.png"
                                   alt="Sprout School"
                                   className="h-20 w-auto object-contain"
                                 />
                        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                        <div className="h-20 w-52 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-dashed border-emerald-200 flex items-center justify-center">
                            <span className="text-emerald-500 text-xs font-semibold tracking-wide">Sprout School Logo</span>
                        </div>

                        <div className="text-center">
                            <h3 className="font-display font-bold text-ink text-xl">Sprout School</h3>
                            <p className="text-gray-400 text-sm mt-1">School Management Solution</p>
                        </div>

                        {/* 5-star rating */}
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════ CTA BANNER ══════════════════════════════ */}
            <section className="max-w-6xl mx-auto pb-16 px-2">
                <div className="relative bg-gradient-to-br from-brand to-brand-dark rounded-3xl px-8 py-14 text-center overflow-hidden shadow-2xl shadow-blue-700/20">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                    />
                    <div className="relative z-10">
                        <h2 className="font-display font-extrabold text-white text-4xl lg:text-5xl mb-4">
                            Let's Build Something Great
                        </h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                            Tell us about your project and we'll get back to you within 24 hours.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                            <a
                                href="tel:+917842204203"
                                className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-white/25 transition-all"
                            >
                                <Phone size={15} /> +91 78422 04203
                            </a>
                            <a
                                href="mailto:support@msinnovatics.com"
                                className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-white/25 transition-all"
                            >
                                <Mail size={15} /> support@msinnovatics.com
                            </a>
                        </div>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-white text-brand font-bold text-base px-9 py-4 rounded-xl hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-black/15"
                        >
                            Start a Conversation <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
