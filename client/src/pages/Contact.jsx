import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const services = [
        'Website Development',
        'Web Hosting',
        'SMS Integration',
        'DLT Registration',
        'School Management App',
        'School Management Website',
        'Other',
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Wire up to backend/email service as needed
        setSubmitted(true);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-14 py-8">

            {/* Header */}
            <div className="text-center">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Have a project in mind or a question? We'd love to hear from you. Reach out and our team will get back to you promptly.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                {/* Contact Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-7">

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-blue-50 text-blue-600 p-3 rounded-xl">
                                <Phone size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">Call Us</h3>
                                <a href="tel:+917842204203" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    +91 78422 04203
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-purple-50 text-purple-600 p-3 rounded-xl">
                                <Mail size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">Email Us</h3>
                                <a href="mailto:support@msinnovatics.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    support@msinnovatics.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-green-50 text-green-600 p-3 rounded-xl">
                                <Clock size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">Business Hours</h3>
                                <p className="text-gray-600 text-sm">Monday – Friday</p>
                                <p className="text-gray-600 text-sm">10:00 AM – 6:00 PM IST</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-orange-50 text-orange-600 p-3 rounded-xl">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">Location</h3>
                                <p className="text-gray-600 text-sm">India</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-700 to-purple-800 rounded-2xl p-8 text-white">
                        <h3 className="text-xl font-bold mb-2">Quick Response</h3>
                        <p className="text-blue-100 text-sm leading-relaxed">
                            We typically respond to all enquiries within 24 business hours. For urgent matters, please call us directly.
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-3">
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="bg-green-100 text-green-600 rounded-full p-5 mb-5">
                                    <Mail size={36} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-500 max-w-xs">
                                    Thank you for reaching out. We'll get back to you within 24 business hours.
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                                    className="mt-6 text-blue-600 font-semibold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your Name"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Service Interested In</label>
                                    <select
                                        name="service"
                                        value={form.service}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 bg-white transition-all"
                                    >
                                        <option value="">Select a service...</option>
                                        {services.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Tell us about your project or query..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 text-lg"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
