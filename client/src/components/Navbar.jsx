import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/#services' },
    { label: 'Clients', to: '/#clients' },
    { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img
                        src="/logo.png"
                        alt="MS Innovatics"
                        className="h-16 w-auto"
                    />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.to}
                            className={`font-medium transition-colors text-sm ${
                                isActive(link.to)
                                    ? 'text-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="/contact"
                        className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                    >
                        Get a Quote
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-gray-600 focus:outline-none"
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 shadow-lg absolute w-full left-0">
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.to}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-700 hover:text-blue-600 font-medium py-1"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-blue-600 text-white px-5 py-3 rounded-full font-bold text-center hover:bg-blue-700 transition-all"
                        >
                            Get a Quote
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
