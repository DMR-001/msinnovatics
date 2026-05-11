import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Users, Zap, ArrowRight } from 'lucide-react';

const VALUES = [
    {
        icon: Target,
        title: 'Mission',
        desc:  'Empower businesses and institutions with innovative, reliable, and affordable technology solutions.',
        accent: '#2563EB',
        bg:     '#EFF6FF',
    },
    {
        icon: Eye,
        title: 'Vision',
        desc:  'Become the most trusted technology partner for growing organisations across India.',
        accent: '#7C3AED',
        bg:     '#F5F3FF',
    },
    {
        icon: Users,
        title: 'Client First',
        desc:  'Every decision is guided by what delivers the most value and clarity to the people we serve.',
        accent: '#059669',
        bg:     '#ECFDF5',
    },
    {
        icon: Zap,
        title: 'Innovation',
        desc:  'We stay ahead — adopting the right technologies to solve real-world problems efficiently.',
        accent: '#D97706',
        bg:     '#FFFBEB',
    },
];

export default function About() {
    return (
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 space-y-20">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
                <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">About Us</p>
                <h1 className="font-display font-extrabold text-ink text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
                    Who We Are
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed">
                    A technology services company dedicated to building digital solutions that help businesses and institutions thrive.
                </p>
            </div>

            {/* Story */}
            <div className="relative bg-ink rounded-3xl overflow-hidden px-6 sm:px-10 py-10 sm:py-14">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(96,165,250,0.10) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 opacity-10 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                    <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">Our Story</p>
                    <h2 className="font-display font-bold text-white text-2xl sm:text-3xl lg:text-4xl mb-6 sm:mb-7 leading-snug">
                        Started With Purpose.<br />Growing With Precision.
                    </h2>
                    <div className="space-y-4 text-gray-400 text-base leading-relaxed">
                        <p>
                            Founded in 2024, <strong className="text-white">MS Innovatics</strong> was born out of a recognition that many businesses — especially schools and small organisations — lacked access to affordable, quality digital tools.
                        </p>
                        <p>
                            We started by building school management systems and quickly expanded into full-scale website development, web hosting, SMS integrations, and DLT compliance. Today we're a focused team committed to delivering technology that just works.
                        </p>
                        <p>
                            Our approach is simple: understand your needs, build the right solution, and support you every step of the way.
                        </p>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div>
                <div className="mb-10">
                    <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">Our Principles</p>
                    <h2 className="font-display font-bold text-ink text-3xl sm:text-4xl leading-tight">What Drives Us</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {VALUES.map(({ icon: Icon, title, desc, accent, bg }) => (
                        <div
                            key={title}
                            className="group bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex gap-5 items-start"
                        >
                            <div
                                className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl transition-transform duration-300 group-hover:scale-110"
                                style={{ background: bg, color: accent }}
                            >
                                <Icon size={22} />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-ink text-lg mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team */}
            <div className="bg-gradient-to-br from-brand to-brand-dark rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />
                <div className="relative z-10">
                    <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl mb-4">The Team Behind the Work</h2>
                    <p className="text-blue-100 text-base max-w-xl mx-auto leading-relaxed mb-8">
                        We are a small but passionate team of developers, designers, and technology consultants. We take pride in owning every project and holding ourselves to a high standard of quality and transparency.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-white text-brand font-bold text-sm px-7 py-3 rounded-xl hover:bg-blue-50 transition-all"
                    >
                        Work With Us <ArrowRight size={15} />
                    </Link>
                </div>
            </div>

        </div>
    );
}
