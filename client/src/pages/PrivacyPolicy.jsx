import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const PrivacyPolicy = () => {
    return (
        <PolicyLayout title="Privacy Policy">
            <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <h3>1. Introduction</h3>
            <p>
                At MS Innovatics, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.
            </p>

            <h3>2. Data We Collect</h3>
            <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-5 mb-4">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
            </ul>

            <h3>3. How We Use Your Data</h3>
            <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 mb-4">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            </ul>

            <h3>4. Data Security</h3>
            <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
            </p>
        </PolicyLayout>
    );
};

export default PrivacyPolicy;
