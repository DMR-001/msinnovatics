import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const TermsConditions = () => {
    return (
        <PolicyLayout title="Terms and Conditions">
            <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <h3>1. Acceptance of Terms</h3>
            <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h3>2. Use License</h3>
            <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on MS Innovatics' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-5 mb-4">
                <li>modify or copy the materials;</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>attempt to decompile or reverse engineer any software contained on MS Innovatics' website;</li>
                <li>remove any copyright or other proprietary notations from the materials; or</li>
                <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>

            <h3>3. Disclaimer</h3>
            <p>
                The materials on MS Innovatics' website are provided on an 'as is' basis. MS Innovatics makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h3>4. Limitations</h3>
            <p>
                In no event shall MS Innovatics or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MS Innovatics' website.
            </p>
        </PolicyLayout>
    );
};

export default TermsConditions;
