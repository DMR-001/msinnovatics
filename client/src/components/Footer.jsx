import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 py-10 mt-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">MS Innovatics</h3>
                    <p className="text-sm">
                        Premier destination for high-quality software projects and digital solutions.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                        <li><Link to="/about" className="hover:text-blue-400">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-blue-400">Contact Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Policies</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/privacy-policy" className="hover:text-blue-400">Privacy Policy</Link></li>
                        <li><Link to="/terms-conditions" className="hover:text-blue-400">Terms & Conditions</Link></li>
                        <li><Link to="/refund-policy" className="hover:text-blue-400">Refund & Cancellation</Link></li>
                        <li><Link to="/shipping-policy" className="hover:text-blue-400">Delivery & Shipping</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Contact</h4>
                    <ul className="space-y-2 text-sm">
                        <li>Email: support@msinnovatics.com</li>
                        <li>Phone: +91 7842204203</li>
                        <li>Address: 14-218/5, Raghavanagar Colony, Meerpet, Hyderabad,India</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
                &copy; {new Date().getFullYear()} MS Innovatics. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
