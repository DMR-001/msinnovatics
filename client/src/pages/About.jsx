import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const About = () => {
    return (
        <PolicyLayout title="About Us">
            <p className="mb-4">
                Welcome to <strong>MS Innovatics</strong>, your number one source for premium software projects and digital solutions. We're dedicated to providing you the very best of web and software development, with an emphasis on quality, innovation, and customer satisfaction.
            </p>
            <p className="mb-4">
                Founded in 2024, MS Innovatics has come a long way from its beginnings. When we first started out, our passion for "technology for everyone" drove us to start our own business.
            </p>
            <p>
                We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
            </p>
            <p className="mt-4 font-bold">Sincerely,<br />The MS Innovatics Team</p>
        </PolicyLayout>
    );
};

export default About;
