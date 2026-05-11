import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LINKS = [
    { label: 'Home',     href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Clients',  href: '/#clients' },
    { label: 'About',    href: '/about' },
];

export default function Navbar() {
    const [open,      setOpen]      = useState(false);
    const [scrolled,  setScrolled]  = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 18);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* close mobile menu on route change */
    useEffect(() => { setOpen(false); }, [pathname]);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100'
                    : 'bg-white border-b border-transparent'
            }`}
        >
            <nav className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
                    <img
                        src="/logo.png"
                        alt="MS Innovatics"
                        className="h-10 w-auto transition-opacity group-hover:opacity-80"
                    />
                </Link>

                {/* Desktop links */}
                <ul className="hidden md:flex items-center gap-1">
                    {LINKS.map(({ label, href }) => (
                        <li key={label}>
                            <a
                                href={href}
                                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    pathname === href
                                        ? 'text-brand'
                                        : 'text-gray-600 hover:text-ink hover:bg-gray-50'
                                }`}
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-1.5 bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
                    >
                        Get a Quote
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setOpen(p => !p)}
                    aria-label="Toggle menu"
                    className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {/* Mobile drawer */}
            {open && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <ul className="flex flex-col px-5 pt-3 pb-5 gap-1">
                        {LINKS.map(({ label, href }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    onClick={() => setOpen(false)}
                                    className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-brand hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                        <li className="pt-3">
                            <Link
                                to="/contact"
                                onClick={() => setOpen(false)}
                                className="block text-center bg-ink text-white text-sm font-semibold px-5 py-3 rounded-xl"
                            >
                                Get a Quote
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
