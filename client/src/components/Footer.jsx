import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 pt-14 pb-8 mt-16">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

                {/* Brand */}
                <div className="md:col-span-1">
                    <img src="/logo.png" alt="MS Innovatics" className="h-12 w-auto mb-4 brightness-200" />
                    <p className="text-sm leading-relaxed">
                        End-to-end technology services for businesses and institutions — websites, apps, hosting, SMS & more.
                    </p>
                </div>

                {/* Services */}
                <div>
                    <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Services</h4>
                    <ul className="space-y-2 text-sm">
                        <li>Website Development</li>
                        <li>Web Hosting</li>
                        <li>SMS Integration</li>
                        <li>DLT Registration</li>
                        <li>School Management App</li>
                        <li>School Management Website</li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-center gap-3">
                            <Phone size={16} className="text-blue-400 flex-shrink-0" />
                            <a href="tel:+917842204203" className="hover:text-white transition-colors">+91 78422 04203</a>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={16} className="text-blue-400 flex-shrink-0" />
                            <a href="mailto:support@msinnovatics.com" className="hover:text-white transition-colors">support@msinnovatics.com</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-6 text-center text-sm">
                &copy; {new Date().getFullYear()} MS Innovatics. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
