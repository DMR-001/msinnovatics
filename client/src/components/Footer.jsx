import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ArrowUpRight } from 'lucide-react';

const SERVICES = [
    'Website Development',
    'Web Hosting',
    'SMS Integration',
    'DLT Registration',
    'School Management App',
    'School Management Website',
];

const COMPANY = [
    { label: 'Home',            to: '/' },
    { label: 'About Us',        to: '/about' },
    { label: 'Contact Us',      to: '/contact' },
    { label: 'Privacy Policy',  to: '/privacy-policy' },
    { label: 'Terms & Conditions', to: '/terms-conditions' },
];

export default function Footer() {
    return (
        <footer className="bg-ink text-white mt-16">
            {/* Top band */}
            <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="sm:col-span-2 lg:col-span-1">
                    <img
                        src="/logo.png"
                        alt="MS Innovatics"
                        className="h-10 w-auto mb-5 brightness-0 invert"
                    />
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        End-to-end technology services for businesses &amp; institutions — websites, apps, hosting, SMS and DLT compliance.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 text-sm">
                        <a href="tel:+917842204203" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                            <span className="flex-shrink-0 bg-white/10 p-1.5 rounded-lg group-hover:bg-brand transition-colors">
                                <Phone size={13} />
                            </span>
                            +91 78422 04203
                        </a>
                        <a href="mailto:support@msinnovatics.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                            <span className="flex-shrink-0 bg-white/10 p-1.5 rounded-lg group-hover:bg-brand transition-colors">
                                <Mail size={13} />
                            </span>
                            support@msinnovatics.com
                        </a>
                    </div>
                </div>

                {/* Services */}
                <div>
                    <h3 className="font-display font-semibold text-xs uppercase tracking-widest text-gray-500 mb-5">Services</h3>
                    <ul className="space-y-3">
                        {SERVICES.map(s => (
                            <li key={s} className="text-sm text-gray-400 hover:text-white transition-colors cursor-default">{s}</li>
                        ))}
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="font-display font-semibold text-xs uppercase tracking-widest text-gray-500 mb-5">Company</h3>
                    <ul className="space-y-3">
                        {COMPANY.map(({ label, to }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                                >
                                    {label}
                                    <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Get in touch CTA */}
                <div>
                    <h3 className="font-display font-semibold text-xs uppercase tracking-widest text-gray-500 mb-5">Start a Project</h3>
                    <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                        Ready to build something great? Let's talk about your idea.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-blue-900/30"
                    >
                        Contact Us <ArrowUpRight size={15} />
                    </Link>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 py-5 px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
                <span>&copy; {new Date().getFullYear()} MS Innovatics. All rights reserved.</span>
                <span className="text-gray-700">Crafted with precision in India</span>
            </div>
        </footer>
    );
}
