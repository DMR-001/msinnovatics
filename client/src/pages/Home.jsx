import React from 'react';
import { Link } from 'react-router-dom';
import {
    Globe, Server, MessageSquare, FileCheck, GraduationCap, Laptop,
    ArrowRight, CheckCircle, Phone, Mail
} from 'lucide-react';

const services = [
    {
        icon: <Globe size={32} />,
        title: 'Website Development',
        description:
            'We design and develop modern, responsive websites tailored to your business goals — from landing pages to full-scale web applications.',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: <Server size={32} />,
        title: 'Web Hosting',
        description:
            'Reliable, fast, and secure hosting solutions to keep your website live 24/7 with maximum uptime and performance.',
        color: 'bg-purple-50 text-purple-600',
    },
    {
        icon: <MessageSquare size={32} />,
        title: 'SMS Integration',
        description:
            'Seamlessly integrate SMS APIs into your platforms for OTP verification, notifications, alerts, and bulk messaging campaigns.',
        color: 'bg-green-50 text-green-600',
    },
    {
        icon: <FileCheck size={32} />,
        title: 'DLT Registration',
        description:
            'End-to-end assistance with Distributed Ledger Technology (DLT) registration for your business to comply with TRAI regulations.',
        color: 'bg-orange-50 text-orange-600',
    },
    {
        icon: <GraduationCap size={32} />,
        title: 'School Management App',
        description:
            'Feature-rich mobile applications for schools covering attendance, timetable, fee management, parent communication, and more.',
        color: 'bg-rose-50 text-rose-600',
    },
    {
        icon: <Laptop size={32} />,
        title: 'School Management Website',
        description:
            'Complete school management web portals with admin dashboards, student/teacher portals, and real-time reporting tools.',
        color: 'bg-teal-50 text-teal-600',
    },
];

const whyUs = [
    'Dedicated support throughout the project lifecycle',
    'On-time delivery with transparent communication',
    'Scalable solutions built for future growth',
    'Competitive pricing with no hidden costs',
];

const Home = () => {
    return (
        <div className="space-y-24">

            {/* Hero */}
            <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-purple-900 text-white rounded-3xl px-10 py-20 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full transform -translate-x-24 translate-y-24"></div>
                </div>
                <div className="relative z-10 max-w-3xl">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1 rounded-full mb-6 tracking-wide">
                        Technology Partner for Growing Businesses
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                        Building Digital Solutions That Drive Growth
                    </h1>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl">
                        MS Innovatics delivers end-to-end technology services — from custom websites and apps to hosting, SMS integration, and DLT compliance.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="#services"
                            className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2"
                        >
                            Our Services <ArrowRight size={18} />
                        </a>
                        <Link
                            to="/contact"
                            className="border-2 border-white/60 text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            Contact Us <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section id="services">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-3">What We Do</h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        We offer a comprehensive range of technology services to help your business establish and grow its digital presence.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service.color} mb-6 group-hover:scale-110 transition-transform`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-12 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-extrabold mb-4">Why Choose MS Innovatics?</h2>
                        <p className="text-blue-200 text-lg mb-8">
                            We combine technical expertise with a deep understanding of business needs to deliver solutions that truly work.
                        </p>
                        <ul className="space-y-4">
                            {whyUs.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-blue-100">
                                    <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                            <div className="text-4xl font-extrabold text-white mb-1">1+</div>
                            <div className="text-blue-200">Happy Client</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                            <div className="text-4xl font-extrabold text-white mb-1">6+</div>
                            <div className="text-blue-200">Services Offered</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                            <div className="text-4xl font-extrabold text-white mb-1">100%</div>
                            <div className="text-blue-200">Client Satisfaction Goal</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Clients */}
            <section id="clients">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Our Clients</h2>
                    <p className="text-gray-500 text-lg">Trusted by forward-thinking organisations.</p>
                </div>
                <div className="flex justify-center">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 flex flex-col items-center gap-6 w-full max-w-xs hover:shadow-lg transition-all">
                        {
                            <img
                                src="/clients/sprout-school.png"
                                alt="Sprout School"
                                className="h-24 w-auto object-contain"
                            />
                        }
                        <div className="h-24 w-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm font-medium">
                            Sprout School Logo
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900">Sprout School</h3>
                            <p className="text-gray-500 text-sm mt-1">School Management Solution</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 rounded-3xl p-12 text-white text-center shadow-xl">
                <h2 className="text-4xl font-extrabold mb-4">Ready to Start Your Project?</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                    Let's talk about how MS Innovatics can help you build the right digital solution for your business.
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium mb-8">
                    <a href="tel:+917842204203" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all">
                        <Phone size={18} /> +91 78422 04203
                    </a>
                    <a href="mailto:support@msinnovatics.com" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-all">
                        <Mail size={18} /> support@msinnovatics.com
                    </a>
                </div>
                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-10 py-4 rounded-full hover:bg-blue-50 transition-all shadow-lg text-lg"
                >
                    Get In Touch <ArrowRight size={20} />
                </Link>
            </section>

        </div>
    );
};

export default Home;
