import React from 'react';
import { Target, Eye, Users, Zap } from 'lucide-react';

const values = [
    {
        icon: <Target size={28} />,
        title: 'Mission',
        description:
            'To empower businesses and institutions with innovative, reliable, and affordable technology solutions that accelerate growth.',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: <Eye size={28} />,
        title: 'Vision',
        description:
            'To be the most trusted technology partner for small and medium businesses across India.',
        color: 'bg-purple-50 text-purple-600',
    },
    {
        icon: <Users size={28} />,
        title: 'Client First',
        description:
            'Every decision we make is guided by what delivers the most value and clarity to the people we serve.',
        color: 'bg-green-50 text-green-600',
    },
    {
        icon: <Zap size={28} />,
        title: 'Innovation',
        description:
            'We stay ahead of the curve — adopting the right technologies to solve real-world problems efficiently.',
        color: 'bg-orange-50 text-orange-600',
    },
];

const About = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-16 py-8">

            {/* Header */}
            <div className="text-center">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">About MS Innovatics</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    We are a technology services company dedicated to building digital solutions that help businesses and institutions thrive in the modern world.
                </p>
            </div>

            {/* Story */}
            <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
                <h2 className="text-3xl font-bold text-gray-900 mb-5">Our Story</h2>
                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                    <p>
                        Founded in 2024, <strong className="text-gray-900">MS Innovatics</strong> was born out of a passion for technology and a recognition that many businesses — especially schools and small organisations — lacked access to affordable, quality digital tools.
                    </p>
                    <p>
                        We started by building school management systems and quickly expanded into full-scale website development, web hosting, SMS integrations, and DLT compliance services. Today, we are a growing team committed to delivering technology that just works.
                    </p>
                    <p>
                        Our approach is simple: understand your needs, build the right solution, and support you every step of the way.
                    </p>
                </div>
            </div>

            {/* Values */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Drives Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {values.map((v, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all flex gap-5 items-start">
                            <div className={`flex-shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-xl ${v.color}`}>
                                {v.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{v.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team note */}
            <div className="bg-gradient-to-r from-blue-700 to-purple-800 rounded-3xl p-10 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">The Team Behind the Work</h2>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
                    We are a small but passionate team of developers, designers, and technology consultants. We take pride in owning every project we deliver and holding ourselves to a high standard of quality and transparency.
                </p>
                <p className="mt-6 text-white font-bold text-xl">— The MS Innovatics Team</p>
            </div>

        </div>
    );
};

export default About;
