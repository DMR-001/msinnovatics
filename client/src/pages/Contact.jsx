import React from 'react';
import PolicyLayout from '../components/PolicyLayout';
import { Mail, Phone } from 'lucide-react';

const Contact = () => {
    return (
        <PolicyLayout title="Contact Us">
            <p className="mb-6">
                We'd love to hear from you! Whether you have a question about our projects, pricing, or anything else, our team is ready to answer all your questions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Email Us</h3>
                            <p>support@msinnovatics.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Call Us</h3>
                            <p>+91 7842204203</p>
                            <p>Monday - Friday, 10am - 6pm</p>
                        </div>
                    </div>


                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your Name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="your@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32" placeholder="How can we help?"></textarea>
                    </div>
                    <button type="button" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition w-full">
                        Send Message
                    </button>
                </form>
            </div>
        </PolicyLayout>
    );
};

export default Contact;
